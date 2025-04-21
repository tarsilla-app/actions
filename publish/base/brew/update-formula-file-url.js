import fs from 'fs';
import { execSync } from 'child_process';

async function updateFormulaFileUrl() {
  const repository = process.env.REPOSITORY;
  const formulaFile = process.env.FORMULA_FILE_NAME;
  const nextTag = process.env.NEXT_TAG;

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else  if (!formulaFile) {
    throw new Error('FORMULA_FILE_NAME is not set in the environment.');
  } else  if (!nextTag) {
    throw new Error('NEXT_TAG is not set in the environment.');
  }
  
  const tarUrl = `https://codeload.github.com/${repository}/tar.gz/refs/tags/${nextTag}`;
  
  if (!fs.existsSync(formulaFile)) {
    throw new Error(`Formula file not found: ${formulaFile}`);
  }

  let formulaContent = fs.readFileSync(formulaFile, 'utf8');
  formulaContent = formulaContent.replace(/url ".*"/, `url "${tarUrl}"`);
  fs.writeFileSync(formulaFile, formulaContent);

  execSync(`git add ${formulaFile}`);
  execSync(`git commit -m "chore(release): ${nextTag}"`);
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
