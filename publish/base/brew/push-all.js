import { execSync } from 'child_process';

function pushAll() {
  const branchName = process.env.BRANCH ?? 'main';

  // Push the commit and the tag to the remote repository
  console.log('Pushing the commit and the tag...');
  execSync(`git push origin ${branchName} --follow-tags`);
}

(() => {
  try {
    console.log('Pushing commit and tag...');

    pushAll();

    console.log('Commit and tag pushed...');
  } catch (error) {
    console.error('Error pushing commit and tag:', error);
    process.exit(1);
  }
})();
