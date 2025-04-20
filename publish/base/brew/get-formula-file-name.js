const fs = require('fs');

function getFormulaFileName() {
  const repository = process.env.REPOSITORY;
  const tap = process.env.TAP;

  if (!repository) {
    throw new Error('REPOSITORY is not set in the environment.');
  }

  const project = repository.split('/').pop();

  return tap || `${project}.rb`;
}

(() => {
  try {
    console.log('Getting formula file name...');

    const formulaFileName = getFormulaFileName();

    console.log(`Formula file name: ${formulaFileName}`);

    const outputPath = process.env.GITHUB_OUTPUT;
    if (outputPath) {
      fs.appendFileSync(outputPath, `formulaFileName=${formulaFileName}\n`);
    }

    //console.log(`::set-output name=formulaFileName::${formulaFileName}`);
  } catch (error) {
    console.error('Error getting formula file name:', error);
    process.exit(1);
  }
})();
