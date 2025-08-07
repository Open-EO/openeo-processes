// Ensure that each test is valid

const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');
const ajv = require('ajv');

const testsDir = path.join(__dirname, '../tests');

const tests = fs.readdirSync(testsDir).filter(file => file.endsWith('.json5'));

const schemaPath = path.join(testsDir, 'schema', 'schema.json');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');
const schema = JSON.parse(schemaContent);
const validate = new ajv().compile(schema);

const results = {};
for (const testFile of tests) {
    const testPath = path.join(testsDir, testFile);

    let testData;
    // Ensure we can load the test file as JSON5
    try {
        testData = JSON5.parse(fs.readFileSync(testPath, 'utf8'));
    } catch (error) {
        results[testFile] = `Invalid JSON5: ${error.message}`;
        continue;
    }

    // Ensure the file is valid against the schema
    if (!validate(testData)) {
        results[testFile] = `Schema validation failed: ${validate.errors.map(err => err.message).join(', ')}`;
        continue;
    }

    // Make sure the id is the same as filename without extension
    const expectedId = path.basename(testFile, '.json5');
    if (testData.id !== expectedId) {
        results[testFile] = `ID mismatch: expected ${expectedId}, got ${testData.id}`;
        continue;
    }

    // Check if experimental is set to the same value as in the process itself
    let processFile = path.join(__dirname, '../', expectedId + '.json');
    if (!fs.existsSync(processFile)) {
        processFile = path.join(__dirname, '../proposals/', expectedId + '.json');
    }
    if (fs.existsSync(processFile)) {
        const processData = JSON.parse(fs.readFileSync(processFile, 'utf8'));
        const expected = processData.experimental || false;
        const actual = testData.experimental || false;
        if (expected !== actual) {
            results[testFile] = `Experimental flag mismatch: expected ${expected}, got ${actual}`;
            continue;
        }
    }
}

if (Object.keys(results).length > 0) {
    console.error('The following test files have issues:');
    for (const [file, error] of Object.entries(results)) {
        console.error(`- ${file}: ${error}`);
    }
    process.exit(1);
}
else {
    console.log('All test files are valid and match the expected schema.');
}