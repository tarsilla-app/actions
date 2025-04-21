import { execSync } from 'child_process';

function pushAll() {
  const branchName = process.env.BRANCH ?? 'main';

  //execSync(`git push origin ${branchName} --follow-tags`);
  execSync(`git push origin ${branchName} --force-with-lease`);
  execSync(`git push origin ${tagName} --force`);

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
