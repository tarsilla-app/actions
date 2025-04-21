import crypto from 'crypto';
import fs from 'fs';

async function calculateSha256() {
  const repository = process.env.REPOSITORY;
  const tagName = process.env.NEXT_TAG;

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else  if (!tagName) {
    throw new Error('NEXT_TAG is not set in the environment.');
  }
  
  const tarUrl = `https://codeload.github.com/${repository}/tar.gz/refs/tags/${tagName}`;

  const response = await fetch(tarUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch file. Status Code: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Response body is null.');
  }

  const hash = crypto.createHash('sha256');
  const reader = response.body.getReader();

  return new Promise((resolve, reject) => {
    function read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            return resolve(hash.digest('hex'));
          }
          if (value) {
            hash.update(value);
          }
          read();
        })
        .catch(reject);
    }
    read();
  });
}

(async () => {
  try {
    console.log('Calculating sha256...');

    const sha256 = await calculateSha256();
    
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
