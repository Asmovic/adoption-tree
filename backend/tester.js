// For testing scripts
(async () => {
  await require('./sheduledTasks/seedHospitalsTask').run();
  process.exit();
})();
