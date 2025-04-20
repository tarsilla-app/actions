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

    console.log(`::set-output name=formulaFileName::${formulaFileName}`);
  } catch (error) {
    console.error('Error getting formula file name:', error);
    process.exit(1);
  }
})();
