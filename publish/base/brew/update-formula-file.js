import fs from 'fs';

async function updateFormulaFile() {
  const repository = process.env.REPOSITORY;
  const formulaFile = process.env.FORMULA_FILE_NAME;
  const tagName = process.env.TAG_NAME;
  const sha256 = process.env.SHA256;

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  } else  if (!formulaFile) {
    throw new Error('FORMULA_FILE_NAME is not set in the environment.');
  } else  if (!tagName) {
    throw new Error('TAG_NAME is not set in the environment.');
  } else  if (!sha256) {
    throw new Error('SHA256 is not set in the environment.');
  }
  
  const tarUrl = `https://codeload.github.com/${repository}/tar.gz/refs/tags/${tagName}`;
  
  if (!fs.existsSync(formulaFile)) {
    throw new Error(`Formula file not found: ${formulaFile}`);
  }

  let formulaContent = fs.readFileSync(formulaFile, 'utf8');
  formulaContent = formulaContent.replace(/url ".*"/, `url "${tarUrl}"`);
  formulaContent = formulaContent.replace(/sha256 ".*"/, `sha256 "${sha256}"`);
  fs.writeFileSync(formulaFile, formulaContent);
}

(async () => {
  try {
    console.log('Updating formula file...');

    await updateFormulaFile();

    console.log('Formula file updated...');
  } catch (error) {
    console.error('Error updating formula file:', error);
    process.exit(1);
  }
})();
