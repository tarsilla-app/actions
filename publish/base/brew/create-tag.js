import { execSync } from 'child_process';

async function createTag() {
  const nextTag = process.env.NEXT_TAG;

  execSync(`git tag -a ${nextTag} -m "Release ${nextTag}"`);
}

(async () => {
  try {
    console.log('Creating local tag...');

    await createTag();

    console.log(`Local Tag created...`);
  } catch (error) {
    console.error('Error creating local tag:', error);
    process.exit(1);
  }
})();