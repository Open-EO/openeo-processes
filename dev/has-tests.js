// Ensure that each process has a corresponding file in the tests directory.
// It can be empty, but it must exist to ensure people made that decision consciously.

const fs = require('fs');
const path = require('path');

const processesDir = path.join(__dirname, '../');
const proposalsDir = path.join(__dirname, '../proposals');
const testsDir = path.join(__dirname, '../tests');

const processes = [
    ...fs.readdirSync(processesDir),
    ...fs.readdirSync(proposalsDir),
]
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));;
const tests = fs.readdirSync(testsDir)
    .filter(file => file.endsWith('.json5'))
    .map(file => path.basename(file, '.json5'));

// Check which tests are missing for the processes
const missingTests = processes.filter(process => !tests.includes(process));

if (missingTests.length > 0) {
    console.error('The following processes are missing tests:');
    missingTests.forEach(process => console.error(`- ${process}`));
}

// Check whether there are tests for non-existing processes
const extraTests = tests.filter(test => !processes.includes(test));
if (extraTests.length > 0) {
    console.error('\nThe following tests exist without a corresponding process:');
    extraTests.forEach(test => console.error(`- ${test}`));
}

// todo: add check that json5 files are valid

if (missingTests.length === 0 && extraTests.length === 0) {
    console.log('All processes have corresponding tests and vice versa.');
    process.exit(0);
}
else {
    process.exit(1);
}