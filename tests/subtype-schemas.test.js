const fs = require('fs');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const { checkJsonSchema, normalizeString, getAjv } = require('./testHelpers');

test("subtype-schemas.json", async () => {
	let fileContent = fs.readFileSync('../meta/subtype-schemas.json');

	let schema = JSON.parse(fileContent);
	expect(schema).not.toBe(null);
	expect(typeof schema).toBe('object');

	// lint: Check whether the file is correctly JSON formatted
	expect(normalizeString(JSON.stringify(schema, null, 4))).toEqual(normalizeString(fileContent.toString()));

	// Is JSON Schema valid?
	checkJsonSchema(await getAjv(), schema);

	// is everything dereferencable?
	let subtypes = await $RefParser.dereference(schema, { dereference: { circular: "ignore" } });
	expect(subtypes).not.toBe(null);
	expect(typeof subtypes).toBe('object');
});