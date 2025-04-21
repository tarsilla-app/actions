import fs from 'fs';

function getFormulaFileName() {
  const repository = process.env.REPOSITORY;
  const formulaFile = process.env.FORMULA_FILE;

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  }

  const project = repository.split('/').pop();

  return formulaFile || `${project}.rb`;
}

(() => {
  try {
    console.log('Getting formula file name...');

    const formulaFileName = getFormulaFileName();

    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `formulaFileName=${formulaFileName}\n`);
    }

    console.log(`Formula file name: ${formulaFileName}`);
  } catch (error) {
    console.error('Error getting formula file name:', error);
    process.exit(1);
  }
})();
