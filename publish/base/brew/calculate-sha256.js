import crypto from 'crypto';
import { execSync } from 'child_process';
import fs from 'fs';

function calculateSha256() {
  const tagName = process.env.NEXT_TAG;
  const tempTarGzPath = './temp.tar.gz';

  if (!tagName) {
    throw new Error('NEXT_TAG is not set in the environment.');
  }

  console.log(`Generating tar.gz archive for tag ${tagName}...`);
  execSync(`git archive --format=tar.gz --prefix=${tagName}/ ${tagName} > ${tempTarGzPath}`);

  console.log(`Calculating SHA256 checksum for ${tempTarGzPath}...`);
  const fileBuffer = fs.readFileSync(tempTarGzPath);
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
}

(() => {
  try {
    console.log('Calculating sha256...');

    const sha256 = calculateSha256();

    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `sha256=${sha256}\n`);
    }

    console.log(`SHA256 calculated: ${sha256}`);
  } catch (error) {
    console.error('Error calculating sha256:', error);
    process.exit(1);
  }
})();
