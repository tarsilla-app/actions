import fs from 'fs';

async function updateFormulaFileSha256() {
  const formulaFile = process.env.FORMULA_FILE_NAME;
  const sha256 = process.env.SHA256;

  if (!formulaFile) {
    throw new Error('FORMULA_FILE_NAME is not set in the environment.');
  } else  if (!sha256) {
    throw new Error('SHA256 is not set in the environment.');
  }
  
  if (!fs.existsSync(formulaFile)) {
    throw new Error(`Formula file not found: ${formulaFile}`);
  }

  let formulaContent = fs.readFileSync(formulaFile, 'utf8');
  formulaContent = formulaContent.replace(/sha256 ".*"/, `sha256 "${sha256}"`);
  fs.writeFileSync(formulaFile, formulaContent);

  execSync(`git add ${formulaFile}`);
  execSync(`git commit --amend --no-edit`);
}

(async () => {
  try {
    console.log('Updating formula file sha256...');

    await updateFormulaFileSha256();

    console.log('Formula file sha256 updated...');
  } catch (error) {
    console.error('Error updating formula file sha256:', error);
    process.exit(1);
  }
})();
