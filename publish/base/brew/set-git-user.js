import { execSync } from 'child_process';

async function setGitUser() {
  const name = process.env.GIT_USER_NAME;
  const email = process.env.GIT_USER_EMAIL;

  if (!name) {
    throw new Error('GIT_USER_NAME is not set in the environment.');
  } else  if (!email) {
    throw new Error('GIT_USER_EMAIL is not set in the environment.');
  }
  
  execSync(`git config user.name "${name}"`); 
  execSync(`git config user.email "${email}"`);
}

(async () => {
  try {
    console.log('Setting git user...');

    await setGitUser();

    console.log('Git user set');
  } catch (error) {
    console.error('Error setting git user:', error);
    process.exit(1);
  }
})();
