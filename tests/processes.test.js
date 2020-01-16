const glob = require('glob');
const fs = require('fs');
const path = require('path');
const markdownlint = require('markdownlint');
const ajv = require('ajv');
const spellcheck = require('markdown-spellcheck').default;

var idRegExp = /^[A-Za-z0-9_]+$/;
var paramKeyRegExp = /^[A-Za-z0-9_]+$/; 
var exceptionNameRegExp = /^[A-Za-z0-9_]+$/;
var summaryDotRegexp = /[^\.]$/;

var files = glob.sync("../*.json", {realpath: true});

var anyOfRequired = [
  "quantiles"
];

var subtypes = {
	// Inherited from JSON Schema format
	'date': {type: 'string'},
	'date-time': {type: 'string'},
	'time': {type: 'string'},
	'uri': {type: 'string'},
	// Custom subtypes
	'band-name': {type: 'string'},
	'bounding-box': {type: 'object'},
	'collection-id': {type: 'string'},
	'epsg-code': {type: 'integer'},
	'file-paths': {type: 'array'},
	'file-path': {type: 'string'},
	'geojson': {type: 'object'},
	'input-format': {type: 'string'},
	'input-format-options': {type: 'object'},
	'job-id': {type: 'string'},
	'kernel': {type: 'array'},
	'output-format': {type: 'string'},
	'output-format-options': {type: 'object'},
	'process-graph': {type: 'object'},
	'process-graph-id': {type: 'string'},
	'process-graph-variables': {type: 'object'},
	'proj-definition': {type: 'string'},
	'projjson-definition': {type: 'object'},
	'raster-cube': {type: 'object'},
	'temporal-interval': {type: 'array'},
	'temporal-intervals': {type: 'array'},
	'udf-code': {type: 'string'},
	'udf-runtime': {type: 'string'},
	'udf-runtime-version': {type: 'string'},
	'vector-cube': {type: 'object'},
	'wkt2-definition': {type: 'string'}
}

var ajvOptions = {
	schemaId: 'auto',
	format: 'full'
};

var spellcheckOptions = {
	ignoreAcronyms: true,
	ignoreNumbers: true,
	suggestions: false,
	relativeSpellingFiles: true,
	dictionary: {
		language: "en-us"
	}
};

// Init JSON Schema validator
var jsv = new ajv(ajvOptions);
jsv.addKeyword("parameters", {
	dependencies: [
		"type",
		"subtype"
	],
	metaSchema: {
		type: "object",
		additionalProperties: {
			type: "object"
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
		enum: Object.keys(subtypes)
	},
	compile: function (subtype, schema) {
		if (schema.type != subtypes[subtype].type) {
			throw "Subtype '"+subtype+"' not allowed for type '"+schema.type+"'."
		}
		return () => true;
	},
	errors: false
});

// Read custom dictionary for spell check
var words = fs.readFileSync('.words').toString().split(/\r\n|\n|\r/);
for(let i in words) {
	spellcheck.spellcheck.addWord(words[i]);
}

var processes = [];

files.forEach(file => {
	try {
		var fileContent = fs.readFileSync(file);
		// Check JSON structure for faults
		var p = JSON.parse(fileContent);

		// Add process name to dictionary
		if (typeof p.id === 'string') {
			spellcheck.spellcheck.addWord(p.id);
		}

		// Prepare for tests
		processes.push([file, p, fileContent.toString()]);
	} catch(err) {
		processes.push([file, {}, ""]);
		console.error(err);
		expect(err).toBeUndefined();
	}
});

describe.each(processes)("%s", (file, p, fileContent) => {

	test("File / JSON", () => {
		const ext = path.extname(file);
		// Check that the process file has a lower-case json extension
		expect(ext).toEqual(".json");
		// Check that the process name is also the file name
		expect(path.basename(file, ext)).toEqual(p.id);
		// lint: Check whether the file is correctly JSON formatted
		// expect(JSON.stringify(p, null, 4).trim()).toEqual(fileContent.trim());
	});

	test("ID", () => {
		expect(typeof p.id).toBe('string');
		expect(idRegExp.test(p.id)).toBeTruthy();
	});


	test("Summary", () => {
		expect(typeof p.summary === 'undefined' || typeof p.summary === 'string').toBeTruthy();
		// lint: Summary should be short
		expect(p.summary.length).toBeLessThan(55);
		// lint: Summary should not end with a dot
		expect(summaryDotRegexp.test(p.summary)).toBeTruthy();
		checkSpelling(p.summary, p);
	});

	test("Description", () => {
		// description
		expect(typeof p.description).toBe('string');
		// lint: Description should be longer than a summary
		expect(p.description.length).toBeGreaterThan(55);
		checkDescription(p.description, p);
	});

	test("Categories", () => {
		// categories
		expect(Array.isArray(p.categories)).toBeTruthy();
		// lint: There should be at least one category assigned
		expect(p.categories.length).toBeGreaterThan(0);
		if (Array.isArray(p.categories)) {
			for(let i in p.categories) {
				expect(typeof p.categories[i]).toBe('string');
			}
		}
	});

	test("Flags", () => {
		checkFlags(p);
	});

	test("Parameters", () => {
		expect(typeof p.parameters).toBe('object');
		expect(p.parameters).not.toBeNull();
	});
	
	var params = o2a(p.parameters);
	if (params.length > 0) {
		test.each(params)("Parameters > %s", (key, param) => {
			expect(paramKeyRegExp.test(key)).toBeTruthy();

			// parameter description
			expect(typeof param.description).toBe('string');
			checkDescription(param.description, p);

			// Parameter flags
			expect(typeof param.required === 'undefined' || typeof param.required === 'boolean').toBeTruthy();
			// lint: don't specify defaults
			expect(typeof param.required === 'undefined' || param.required === true).toBeTruthy();
			// Check flags (recommended / experimental)
			checkFlags(param);

			// Parameter schema
			expect(typeof param.schema).toBe('object');
			expect(param.schema).not.toBeNull();
			checkJsonSchema(param.schema);

			// Parameters that are not required should define a default value
			if(param.required !== true && !anyOfRequired.includes(p.id)) {
				expect(param.default).toBeDefined();
			}

			// Checking that callbacks (process-graphs) define their parameters
			if (typeof param.schema === 'object' && param.schema.subtype === 'process-graph') {
				expect(typeof param.schema.parameters === 'object' && Object.keys(param.schema.parameters).length).toBeTruthy();
			}
		});
	}

	test("Parameter Order", () => {
		let paramKeys = Object.keys(p.parameters);
		let paramCount = paramKeys.length;

		expect(typeof p.parameter_order === 'undefined' || Array.isArray(p.parameter_order)).toBeTruthy();
		expect(typeof p.parameter_order === 'undefined' || p.parameter_order.length === paramCount).toBeTruthy();

		if (Array.isArray(p.parameter_order)) {
			let difference = array_diff(p.parameter_order, paramKeys);
			expect(difference.length).toBe(0);
		}

		if (paramCount >= 2) {
			expect(typeof p.parameter_order !== 'undefined' && p.parameter_order.length === paramCount).toBeTruthy();
		}
	});

	test("Return Value", () => {
		expect(typeof p.returns).toBe('object');
		expect(p.returns).not.toBeNull();

		// return value description
		expect(typeof p.returns.description).toBe('string');
		checkDescription(p.returns.description, p);

		// return value schema
		expect(typeof p.returns.schema).toBe('object');
		expect(p.returns.schema).not.toBeNull();
		checkJsonSchema(p.returns.schema);
	});

	test("Exceptions", () => {
		expect(typeof p.exceptions === 'undefined' || (typeof p.exceptions === 'object' && p.exceptions !== 'null')).toBeTruthy();
	});

	var exceptions = o2a(p.exceptions);
	if (exceptions.length > 0) {
		test.each(exceptions)("Exceptions > %s", (key, e) => {
			expect(exceptionNameRegExp.test(key)).toBeTruthy();

			// exception message
			expect(typeof e.message).toBe('string');
			checkSpelling(e.message, p);

			// exception description
			expect(typeof e.description === 'undefined' || typeof e.description === 'boolean').toBeTruthy();
			checkDescription(e.description, p);

			// exception http code
			if (typeof e.http !== 'undefined') {
				expect(e.http).toBeGreaterThanOrEqual(100);
				expect(e.http).toBeLessThan(600);
			}
		});
	}

	test("Examples", () => {
		expect(typeof p.examples === 'undefined' || Array.isArray(p.examples)).toBeTruthy();
	});

	if (Array.isArray(p.examples) && p.examples.length > 0) {
		test.each(p.examples)("Examples > %#", (example) => {
			let paramKeys = Object.keys(p.parameters);

			expect(typeof example).toBe('object');
			expect(example).not.toBeNull();

			// example title
			expect(typeof example.title === 'undefined' || typeof example.title === 'string').toBeTruthy();
			checkSpelling(example.title, p);

			// example description
			expect(typeof example.description === 'undefined' || typeof example.description === 'string').toBeTruthy();
			checkDescription(example.description, p);

			// Is either process_graph or arguments set?
			expect((example.process_graph || example.arguments) && !(example.process_graph && example.arguments)).toBeTruthy();

			// example process graph
			if (typeof example.process_graph !== 'undefined') {
				expect(typeof example.process_graph).toBe('object');
				expect(example.process_graph).not.toBeNull();
				checkProcessGraph(example.process_graph);
			}

			// example arguments
			if (typeof example.arguments !== 'undefined') {
				expect(typeof example.arguments).toBe('object');
				expect(example.arguments).not.toBeNull();
				// Check argument values
				for(let argName in example.arguments) {
					// Does parameter with this name exist?
					
					expect(paramKeys).toContain(argName);
					checkJsonSchemaValue(p.parameters[argName].schema, example.arguments[argName]);
				}
				// Check whether all required parameters are set
				for(let key in p.parameters) {
					if (p.parameters[key].required) {
						expect(example.arguments[key]).toBeDefined();
					}
				}
			}

			// example returns: Nothing to validate, everything is allowed
		});
	}

	test("Links", () => {
		expect(typeof p.links === 'undefined' || Array.isArray(p.links)).toBeTruthy();
	});

	if (Array.isArray(p.links)) {
		test.each(p.links)("Links > %#", (link) => {
			expect(typeof link).toBe('object');
			expect(link).not.toBeNull();

			// link href
			expect(typeof link.href).toBe('string');

			// link rel
			expect(typeof link.rel === 'undefined' || typeof link.rel === 'string').toBeTruthy();

			// link title
			expect(typeof link.title === 'undefined' || typeof link.title === 'string').toBeTruthy();
			checkSpelling(link.title, p);

			// link type
			expect(typeof link.type === 'undefined' || typeof link.type === 'string').toBeTruthy();
		});
	}
});

function array_diff(arr1, arr2) {
	return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
}

function checkFlags(p) {
	// deprecated
	expect(typeof p.deprecated === 'undefined' || typeof p.deprecated === 'boolean').toBeTruthy();
	// lint: don't specify defaults
	expect(typeof p.deprecated === 'undefined' || p.deprecated === true).toBeTruthy();
	// experimental
	expect(typeof p.experimental === 'undefined' || typeof p.experimental === 'boolean').toBeTruthy();
	// lint: don't specify defaults
	expect(typeof p.experimental === 'undefined' || p.experimental === true).toBeTruthy();
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

function checkProcessGraph(pg) {
	if (!pg) {
		return;
	}
	
	// ToDo: Validate process graph
}

function prepareSchema(schema) {
	if (typeof schema["$schema"] === 'undefined') {
		// Set applicable JSON SChema draft version if not already set
		schema["$schema"] = "http://json-schema.org/draft-07/schema#";
	}
	if (Array.isArray(schema)) {
		schema = {
			anyOf: schema
		};
	}
	return schema;
}

function checkJsonSchema(schema) {
	if (Array.isArray(schema)) {
		// lint: For array schemas there should be more than one schema specified, otherwise use directly the schema object
		expect(schema.length).toBeGreaterThan(1);
	}

	let result = jsv.compile(prepareSchema(schema));
	expect(result.errors).toBeNull();

	checkSchemaRecursive(schema);
}

function checkSchemaRecursive(schema) {
	for(var i in schema) {
		var val = schema[i];
		if (typeof val === 'object' && val !== null) {
			checkSchemaRecursive(val);
		}

		switch(i) {
			case 'title':
			case 'description':
				checkSpelling(val);
				break;
			case 'format':
				if (schema.subtype !== val) {
					throw "format '"+val+"' has no corresponding subtype.";
				}
				break;
		}
	}
}

function checkJsonSchemaValue(schema, value) {
	jsv.validate(prepareSchema(schema), value);
	expect(jsv.errors).toBeNull();
}

function o2a(o) {
	if (!o) {
		return [];
	}
	var a = [];
	for(var k in o) {
		a.push([k, o[k]]);
	}
	return a;
}