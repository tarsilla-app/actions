const { Octokit } = require('@octokit/rest');
const semver = require('semver');
const conventionalCommitsParser = require('conventional-commits-parser').sync;

async function createTag() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.REPOSITORY;
  const branchName = process.env.BRANCH ?? 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set in the environment.');
  } else if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  }

  const [owner, repo] = repository.split('/');

  const octokit = new Octokit({
    auth: token,
  });

  try {
    // Fetch the list of tags
    console.log('Fetching the list of tags...');
    const { data: tags } = await octokit.repos.listTags({
      owner,
      repo,
      per_page: 1, // Fetch only the latest tag
    });

    let lastTag = 'v0.0.0';
    let commits = [];
    if (tags.length > 0) {
      lastTag = tags[0].name;
      console.log(`Latest tag: ${lastTag}`);
  
      // Get the commit associated with the last tag
      const { data: tagCommit } = await octokit.git.getTag({
        owner,
        repo,
        tag_sha: tags[0].commit.sha,
      });
  
      // Fetch commits since the last tag
      console.log(`Fetching commits since ${lastTag}...`);
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branchName,
        since: tagCommit.tagger.date, // Use the date of the last tag
      });
      commits = data;
    } else {
      console.log(`Latest tag: ${lastTag}`);

      // Fetch commits
      console.log(`Fetching commits ${lastTag}...`);
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branchName,
      });
      commits = data;
    }

    // Analyze commits to determine the next version increment
    let releaseType = null;
    for (const commit of commits) {
      const parsed = conventionalCommitsParser.sync(commit.commit.message, analyzerConfig.parserOpts);
      const rule = analyzerConfig.releaseRules.find(
        (r) =>
          r.type === parsed.type &&
          (!r.exclamation1 || r.exclamation1 === parsed.exclamation1) &&
          (!r.exclamation2 || r.exclamation2 === parsed.exclamation2)
      );
      if (rule) {
        if (rule.release === 'major') {
          releaseType = 'major';
          break;
        } else if (rule.release === 'minor' && releaseType !== 'major') {
          releaseType = 'minor';
        } else if (rule.release === 'patch' && !releaseType) {
          releaseType = 'patch';
        }
      }
    }

    if (!releaseType) {
      console.log('No relevant commits found for a new release.');
      return null;
    }

    // Increment the version
    const newVersion = semver.inc(lastTag.replace(/^v/, ''), releaseType);
    const tagName = `v${newVersion}`;
    console.log(`Determined new version: ${tagName}`);

    // Get the latest commit SHA from the default branch
    const { data: branch } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: branchName,
    });

    const commitSha = branch.commit.sha;
    console.log(`Latest commit SHA: ${commitSha}`);

    // Create the tag object
    console.log(`Creating tag object for ${tagName}...`);
    await octokit.git.createTag({
      owner,
      repo,
      tag: tagName,
      message: `Release ${tagName}`,
      object: commitSha,
      type: 'commit',
    });

    // Create the reference for the tag
    console.log(`Creating reference for tag ${tagName}...`);
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: commitSha,
    });

    console.log(`Tag ${tagName} created successfully.`);

    return tagName;
  } catch (error) {
    console.error(`Failed to create tag ${tagName}: ${error.message}`);
    throw error;
  }
}

(async () => {
  try {
    console.log('Creating tag...');

    const tagName = await createTag();

    console.log(`Tag created: ${tagName}`);

    console.log(`::set-output name=tagName::${tagName}`);
  } catch (error) {
    console.error('Error creating tag:', error);
    process.exit(1);
  }
})();
