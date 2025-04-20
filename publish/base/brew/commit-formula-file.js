import { Octokit } from '@octokit/rest';

async function commitFormulaFile() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.REPOSITORY;
  const formulaFile = process.env.FORMULA_FILE_NAME;
  const branchName = process.env.BRANCH ?? 'main';

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set in the environment.');
  } else if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else if (!formulaFile) {
    throw new Error('FORMULA_FILE_NAME is not set in the environment.');
  }

  const [owner, repo] = repository.split('/');

  console.log(`Committing updated formula file ${formulaFile} to branch ${branchName}...`);

  const octokit = new Octokit({
    auth: token
  });

  try {
    // Get the latest commit SHA and tree SHA from the branch
    const { data: branch } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: branchName,
    });

    const latestCommitSha = branch.commit.sha;
    const baseTreeSha = branch.commit.commit.tree.sha;

    console.log(`Latest commit SHA: ${latestCommitSha}`);
    console.log(`Base tree SHA: ${baseTreeSha}`);

    // Read the updated formula file content
    const formulaContent = fs.readFileSync(formulaFile, 'utf8');

    // Create a new blob for the updated formula file
    const { data: blob } = await octokit.git.createBlob({
      owner,
      repo,
      content: formulaContent,
      encoding: 'utf-8',
    });

    console.log(`Created blob for ${formulaFile} with SHA: ${blob.sha}`);

    // Create a new tree with the updated formula file
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: [
        {
          path: formulaFile,
          mode: '100644',
          type: 'blob',
          sha: blob.sha,
        },
      ],
    });

    console.log(`Created new tree with SHA: ${newTree.sha}`);

    // Create a new commit with the updated tree
    const commitMessage = `chore(release): ${nextRelease.version}`;
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    console.log(`Created new commit with SHA: ${newCommit.sha}`);

    // Update the branch reference to point to the new commit
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: newCommit.sha,
    });

    console.log(`Branch ${branchName} updated to commit ${newCommit.sha}`);
  } catch (error) {
    console.error(`Failed to commit formula file: ${error.message}`);
    throw error;
  }
}

(async () => {
  try {
    console.log('Committing formula file...');

    await createTag();

    console.log('Formula file committed...');
  } catch (error) {
    console.error('Error committing formula file:', error);
    process.exit(1);
  }
})();
