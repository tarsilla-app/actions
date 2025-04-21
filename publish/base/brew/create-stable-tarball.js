import crypto from 'crypto';
import { execSync } from 'child_process';
import fs from 'fs';

function createStableTarball() {
  const nextTag = process.env.NEXT_TAG;
  const stableTarball = `${nextTag}-stable.tar.gz`;
  const stableTarballPath = `./${stableTarball}`;

  if (!nextTag) {
    throw new Error('NEXT_TAG is not set in the environment.');
  }

  execSync(`git archive --format=tar.gz --output=${stableTarballPath} HEAD`);

  return stableTarball;
}

(() => {
  try {
    console.log('Creating stable tarball...');

    const stableTarball = createStableTarball();

    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `stableTarball=${stableTarball}\n`);
    }

    console.log(`Stable tarball created: ${stableTarball}`);
  } catch (error) {
    console.error('Error creating stable tarball:', error);
    process.exit(1);
  }
})();
