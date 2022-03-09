const glob = require('glob');
const fs = require('fs');
const path = require('path');
const ajv = require('ajv');
const $RefParser = require("@apidevtools/json-schema-ref-parser");
const markdownlint = require('markdownlint');
const spellcheck = require('markdown-spellcheck').default;

const ajvOptions = {
	schemaId: 'auto',
	format: 'full'
};

const spellcheckOptions = {
	ignoreAcronyms: true,
	ignoreNumbers: true,
	suggestions: false,
	relativeSpellingFiles: true,
	dictionary: {
		language: "en-us"
	}
};

// Read custom dictionary for spell check
const words = fs.readFileSync('.words').toString().split(/\r\n|\n|\r/);
for(let i in words) {
	spellcheck.spellcheck.addWord(words[i]);
}
// Add the process IDs to the word list
const files = glob.sync("../{*,proposals/*}.json", {realpath: true});
for(let i in files) {
	spellcheck.spellcheck.addWord(path.basename(files[i], path.extname(files[i])));
}


async function getAjv() {
	let subtypes = await $RefParser.dereference(
		require('../meta/subtype-schemas.json'),
		{
			dereference: { circular: "ignore" }
		}
	);

	let jsv = new ajv(ajvOptions);
	jsv.addKeyword("parameters", {
		dependencies: [
			"type",
			"subtype"
		],
		metaSchema: {
			type: "array",
			items: {
				type: "object",
				required: [
					"name",
					"description",
					"schema"
				],
				properties: {
					name: {
						type: "string",
						pattern: "^[A-Za-z0-9_]+$"
					},
					description: {
						type: "string"
					},
					optional: {
						type: "boolean"
					},
					deprecated: {
						type: "boolean"
					},
					experimental: {
						type: "boolean"
					},
					default: {
						// Any type
					},
					schema: {
						oneOf: [
							{
								type: "object",
								// ToDo: Check Schema
							},
							{
								type: "array",
								items: {
									type: "object"
									// ToDo: Check Schema
								}
							}
						]
					}
				}
			}
		},
		valid: true
	});
	jsv.addKeyword("subtype", {
		dependencies: [
			"type"
		],
		metaSchema: {
			type: "string",
			enum: Object.keys(subtypes.definitions)
		},
		compile: function (subtype, schema) {
			if (schema.type != subtypes.definitions[subtype].type) {
				throw "Subtype '"+subtype+"' not allowed for type '"+schema.type+"'."
			}
			return () => true;
		},
		errors: false
	});

	return jsv;
}

function isObject(obj) {
	return (typeof obj === 'object' && obj === Object(obj) && !Array.isArray(obj));
}

function normalizeString(str) {
	return str.replace(/\r\n|\r|\n/g, "\n").trim();
}

function checkDescription(text, p = null, commonmark = true) {
	if (!text) {
		return;
	}

	// Check markdown
	if (commonmark) {
		const options = {
			strings: {
			description: text
			},
			config: {
				"line-length": false, // Nobody cares in JSON files anyway
				"first-line-h1": false, // Usually no headings in descriptions
				"fenced-code-language": false, // Usually no languages available anyway
				"single-trailing-newline": false, // New lines at end of a JSON string doesn't make sense. We don't have files here.
			}
		};
		const result = markdownlint.sync(options);
		expect(result).toEqual({description: []});
	}

	// Check spelling
	checkSpelling(text, p);
}

function checkSpelling(text, p = null) {
	if (!text) {
		return;
	}

	const errors = spellcheck.spell(text, spellcheckOptions);
	if (errors.length > 0) {
		let pre = "Misspelled word";
		if (p && p.id) {
			pre += " in " + p.id;
		}
		console.warn(pre + ": " + JSON.stringify(errors));
	}
}

function prepareSchema(schema) {
	if (Array.isArray(schema)) {
		schema = {
			anyOf: schema
		};
	}
	if (typeof schema["$schema"] === 'undefined') {
		// Set applicable JSON SChema draft version if not already set
		schema["$schema"] = "http://json-schema.org/draft-07/schema#";
	}
	return schema;
}

function checkJsonSchema(jsv, schema, checkFormat = true) {
	if (Array.isArray(schema)) {
		// lint: For array schemas there should be more than one schema specified, otherwise use directly the schema object
		expect(schema.length).toBeGreaterThan(1);
	}

	let result = jsv.compile(prepareSchema(schema));
	expect(result.errors).toBeNull();

	checkSchemaRecursive(schema, checkFormat);
}

function checkSchemaRecursive(schema, checkFormat = true) {
	for(var i in schema) {
		var val = schema[i];
		if (typeof val === 'object' && val !== null) {
			checkSchemaRecursive(val, checkFormat);
		}

		switch(i) {
			case 'title':
			case 'description':
				checkSpelling(val);
				break;
			case 'format':
				if (checkFormat && schema.subtype !== val) {
					throw "format '"+val+"' has no corresponding subtype.";
				}
				break;
		}
	}
}

module.exports = {
	getAjv,
	normalizeString,
	checkDescription,
	checkSpelling,
	checkJsonSchema,
	checkSchemaRecursive,
	prepareSchema,
	isObject
};