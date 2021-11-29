const $RefParser = require("@apidevtools/json-schema-ref-parser");
const { checkDescription, checkSpelling, isObject } = require('./testHelpers');

// I'd like to run the tests for each subtype individually instead of in a loop,
// but jest doesn't support that, so you need to figure out yourself what is broken.
// The console.log in afterAll ensures we have a hint of which process was checked last

// Load and dereference schemas
let subtypes = {};
let lastTest = null;
let testsCompleted = 0; 
beforeAll(async () => {
	subtypes = await $RefParser.dereference('../meta/subtype-schemas.json', { dereference: { circular: "ignore" } });
	return subtypes;
});

afterAll(async () => {
	if (testsCompleted != Object.keys(subtypes.definitions).length) {
		console.log('The schema the test has likely failed for: ' + lastTest);
	}
});

test("Schemas in subtype-schemas.json", () => {
	// Each schema must contain at least a type, subtype, title and description
	for(let name in subtypes.definitions) {
		let schema = subtypes.definitions[name];
		lastTest = name;

		// Schema is object
		expect(isObject(schema)).toBeTruthy();

		// Type is array with an element or a stirng
		expect((Array.isArray(schema.type) && schema.type.length > 0) || typeof schema.type === 'string').toBeTruthy();

		// Subtype is a string
		expect(typeof schema.subtype === 'string').toBeTruthy();

		// Check title
		expect(typeof schema.title === 'string').toBeTruthy();
		// lint: Summary should be short
		expect(schema.title.length).toBeLessThan(60);
		// lint: Summary should not end with a dot
		expect(/[^\.]$/.test(schema.title)).toBeTruthy();
		checkSpelling(schema.title, schema);

		// Check description
		expect(typeof schema.description).toBe('string');
		// lint: Description should be longer than a summary
		expect(schema.description.length).toBeGreaterThan(60);
		checkDescription(schema.description, schema);

		testsCompleted++;
	}
});