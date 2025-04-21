import fs from 'fs';
import { Octokit } from '@octokit/rest';

async function createRelease() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.REPOSITORY;
  const nextTag = process.env.NEXT_TAG;
  const stableTarball = process.env.STABLE_TARBALL;

  if (!token) {
    throw new Error('GITHUB_TOKEN is not set in the environment.');
  } else if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else if (!nextTag) {
    throw new Error('NEXT_TAG is not set in the environment.');
  } else if (!stableTarball) {
    throw new Error('STABLE_TARBALL is not set in the environment.');
  }

  const [owner, repo] = repository.split('/');
  const octokit = new Octokit({ auth: token });

  console.log(`Creating release for tag ${nextTag}...`);
  const releaseResponse = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: nextTag,
    name: nextTag,
    body: `This is the release for ${nextTag}.`,
    draft: false,
    prerelease: false,
  });

  const releaseId = releaseResponse.data.id;
  console.log(`Release created with ID: ${releaseId}`);

  console.log(`Uploading ${stableTarball} as a release asset...`);
  const stableTarballPath = `./${stableTarball}`;
  if (!fs.existsSync(stableTarballPath)) {
    throw new Error(`Tarball file ${stableTarball} does not exist.`);
  }

  await octokit.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: releaseId,
    name: stableTarball,
    data: fs.readFileSync(stableTarballPath),
  });

  console.log(`Release asset ${stableTarball} uploaded successfully.`);
}

(async () => {
  try {
    console.log('Creating release...');

    await createRelease();

    console.log('Release created successfully.');
  } catch (error) {
    console.error('Error creating release:', error);
    process.exit(1);
  }
})();