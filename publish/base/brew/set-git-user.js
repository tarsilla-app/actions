import crypto from 'crypto';
import fs from 'fs';

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

    const sha256 = await setGitUser();
    
    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `sha256=${sha256}\n`);
    }

    console.log(`Git user set: ${sha256}`);
  } catch (error) {
    console.error('Error setting git user:', error);
    process.exit(1);
  }
})();
