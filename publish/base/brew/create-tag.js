import { execSync } from 'child_process';

async function createTag() {
  const nextTag = process.env.NEXT_TAG;

  execSync(`git tag -a ${nextTag} -m "Release ${nextTag}"`);
  execSync(`git push origin ${nextTag}`);
}

(async () => {
  try {
    console.log('Creating tag...');

    await createTag();

    console.log(`Tag created...`);
  } catch (error) {
    console.error('Error creating tag:', error);
    process.exit(1);
  }
})();