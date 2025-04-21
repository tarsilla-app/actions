import crypto from 'crypto';
import { execSync } from 'child_process';
import fs from 'fs';

function calculateSha256() {
  const stableTarball = process.env.STABLE_TARBALL;

  if (!stableTarball) {
    throw new Error('STABLE_TARBALL is not set in the environment.');
  }

  const stableTarballPath = `./${stableTarball}`;
  if (!fs.existsSync(stableTarballPath)) {
    throw new Error(`Tarball file ${stableTarball} does not exist.`);
  }

  const fileBuffer = fs.readFileSync(stableTarballPath);
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
