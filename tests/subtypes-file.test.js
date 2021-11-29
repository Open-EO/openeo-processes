const fs = require('fs');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const { checkJsonSchema, getAjv, isObject, normalizeString } = require('./testHelpers');

test("File subtype-schemas.json", async () => {
	let schema;
	let fileContent;
	try {
		fileContent = fs.readFileSync('../meta/subtype-schemas.json');
		schema = JSON.parse(fileContent);
	} catch(err) {
		console.error("The file for subtypes is invalid and can't be read:");
		console.error(err);
		expect(err).toBeUndefined();
	}

	expect(isObject(schema)).toBeTruthy();
	expect(isObject(schema.definitions)).toBeTruthy();

	// lint: Check whether the file is correctly JSON formatted
	expect(normalizeString(JSON.stringify(schema, null, 4))).toEqual(normalizeString(fileContent.toString()));

	// Is JSON Schema valid?
	checkJsonSchema(await getAjv(), schema);

	// is everything dereferencable?
	let subtypes = await $RefParser.dereference(schema, { dereference: { circular: "ignore" } });
	expect(isObject(subtypes)).toBeTruthy();
});