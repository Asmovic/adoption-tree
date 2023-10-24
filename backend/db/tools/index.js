const path = require('path');
const chalk = require('chalk');
const { readFileSync, readdirSync } = require('fs');
const db = require('../../lib/knexConnection');
const args = process.argv.slice(2);

const directory = path.join(__dirname, 'scripts/');

const processFile = async (filename) => {
  const content = readFileSync(filename, 'utf-8');

  try {
    await db.raw(content);

    console.log(
      chalk.green(`${path.basename(filename)} processed successfully`),
    );
  } catch (error) {
    console.error(chalk.red(error));
  }
};

const processFiles = async (files) => {
  for (const file of files) {
    await processFile(file);
  }
};

let files;

// Run specific file if specified or run all files instead
if (args[0]) {
  files = [args[0]];
} else {
  files = readdirSync(directory).map((x) => path.join(directory, x));
}

(async () => {
  await processFiles(files);
  process.exit();
})();
