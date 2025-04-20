(() => {
  try {
    const config = JSON.parse(process.env.CONFIG);
    console.log('Config is valid:', config);
  } catch (e) {
    console.error('Invalid JSON in inputs.config:', process.env.CONFIG);
    console.error('Error:', e.message);
    process.exit(1);
  }
})();