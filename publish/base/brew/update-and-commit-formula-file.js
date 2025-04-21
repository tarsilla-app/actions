import fs from 'fs';
import { execSync } from 'child_process';

async function updateFormulaFileUrl() {
  const repository = process.env.REPOSITORY;
  const formulaFile = process.env.FORMULA_FILE_NAME;
  const nextTag = process.env.NEXT_TAG;
  const sha256 = process.env.SHA256;
  const branchName = process.env.BRANCH ?? 'main';

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else  if (!formulaFile) {
    throw new Error('FORMULA_FILE_NAME is not set in the environment.');
  } else  if (!nextTag) {
    throw new Error('NEXT_TAG is not set in the environment.');
  } else  if (!sha256) {
    throw new Error('SHA256 is not set in the environment.');
  }
  
  const tarUrl = `https://codeload.github.com/${repository}/tar.gz/refs/tags/${nextTag}`;
  
  if (!fs.existsSync(formulaFile)) {
    throw new Error(`Formula file not found: ${formulaFile}`);
  }

  let formulaContent = fs.readFileSync(formulaFile, 'utf8');
  formulaContent = formulaContent.replace(/url ".*"/, `url "${tarUrl}"`);
  formulaContent = formulaContent.replace(/sha256 ".*"/, `sha256 "${sha256}"`);
  fs.writeFileSync(formulaFile, formulaContent);

  execSync(`git add ${formulaFile}`);
  execSync(`git commit -m "chore(release): ${nextTag}"`);
  execSync(`git push origin ${branchName}`);
}

(async () => {
  try {
    console.log('Updating formula file url...');

    await updateFormulaFileUrl();

    console.log('Formula file url updated...');
  } catch (error) {
    console.error('Error updating formula file url:', error);
    process.exit(1);
  }
})();
