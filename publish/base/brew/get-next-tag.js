import fs from 'fs';
import { CommitParser } from 'conventional-commits-parser';
import { Octokit } from '@octokit/rest';
import semver from 'semver';

const analyzerConfig = {
  parserOpts: {
    headerPattern: /^(?<type>\w+)(?<exclamation1>!?)(?:\((?<scope>[^)]+)\)(?<exclamation2>!?))?: (?<subject>.+)$/,
    headerCorrespondence: ['type', 'exclamation1', 'scope', 'exclamation2', 'subject'],
  },
  releaseRules: [
    { type: 'feat', exclamation1: '!', release: 'major' },
    { type: 'feat', exclamation2: '!', release: 'major' },
    { type: 'feat', release: 'minor' },
    { type: 'fix', release: 'patch' },
    { type: 'docs', release: 'patch' },
    { type: 'style', release: 'patch' },
    { type: 'refactor', release: 'patch' },
    { type: 'perf', release: 'patch' },
    { type: 'test', release: 'patch' },
    { type: 'build', release: 'patch' },
    { type: 'ci', release: 'patch' },
    { type: 'chore', release: 'patch' },
    { type: 'revert', release: 'patch' },
  ],
};

async function parseCommitMessage(commitMessage) {
  const parser = new CommitParser(analyzerConfig.parserOpts)

  return parser.parse(commitMessage);
}

async function getNextTag() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.REPOSITORY;
  const branchName = process.env.BRANCH ?? 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set in the environment.');
  } else if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  }

  const [owner, repo] = repository.split('/');
  const octokit = new Octokit({ auth: token });

  console.log(`Fetching list of tags...`);
  const { data: tags } = await octokit.repos.listTags({
    owner,
    repo,
    per_page: 1,
  });

  let lastTag = 'v0.0.0';
  let commits = [];
  if (tags.length > 0) {
    lastTag = tags[0].name;
    console.log(`Latest tag: ${lastTag}`);

    console.log(`Get commit associated with ${lastTag}...`);
    const { data: commit } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: tags[0].commit.sha,
    });

    console.log(`Fetching commits since ${lastTag}...`);
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branchName,
      since: commit.committer.date,
    });

    commits = data;
  } else {
    console.log(`Latest tag: ${lastTag}`);

    console.log(`Fetching commits ${lastTag}...`);
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branchName,
    });
    commits = data;
  }

  console.log(`Analyzing ${commits.length} commits`);
  let releaseType = null;
  for (const commit of commits) {
    const parsed = await parseCommitMessage(commit.commit.message);
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

  const lastVersion = lastTag.replace(/^v/, '');
  const nextVersion = semver.inc(lastVersion, releaseType);
  const nextTag = `v${nextVersion}`;

  return nextTag;
}

(async () => {
  try {
    console.log('Getting next tag...');

    const nextTag = await getNextTag();

    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `nextTag=${nextTag}\n`);
    }

    console.log(`Next tag got: ${nextTag}`);
  } catch (error) {
    console.error('Error getting next tag:', error);
    process.exit(1);
  }
})();