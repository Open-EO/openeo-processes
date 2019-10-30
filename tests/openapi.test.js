const glob = require('glob');
const fs = require('fs');
const markdownlint = require('markdownlint');
const ajv = require('ajv');
const spellcheck = require('markdown-spellcheck').default;

var idRegExp = /^[A-Za-z0-9_]+$/;
var paramKeyRegExp = /^[A-Za-z0-9_]+$/; 
var exceptionNameRegExp = /^[A-Za-z0-9_]+$/;

var files = glob.sync("../*.json", {realpath: true});

var anyOfRequired = [
  "filter_bands",
  "quantiles"
];

var ajvOptions = {
	schemaId: 'auto',
	format: 'full',
	formats: {
		// ToDo: Add validators
		'band-name': {type: 'string', validate: () => true},
		'bounding-box': {type: 'object', validate: () => true},
		'callback': {type: 'object', validate: () => true},
		'collection-id': {type: 'string', validate: () => true},
		'epsg-code': {type: 'integer', validate: () => true},
		'geojson': {type: 'object', validate: () => true},
		'job-id': {type: 'string', validate: () => true},
		'kernel': {type: 'array', validate: () => true},
		'output-format': {type: 'string', validate: () => true},
		'output-format-options': {type: 'array', validate: () => true},
		'process-graph-id': {type: 'string', validate: () => true},
		'process-graph-variables': {type: 'array', validate: () => true},
		'proj-definition': {type: 'string', validate: () => true},
		'projjson-definition': {type: 'string', validate: () => true},
		'raster-cube': {type: 'object', validate: () => true},
		'temporal-interval': {type: 'array', validate: () => true},
		'temporal-intervals': {type: 'array', validate: () => true},
		'vector-cube': {type: 'object', validate: () => true},
		'wkt2-definition': {type: 'string', validate: () => true}
	}
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
jsv.addKeyword('parameters', {
	dependencies: [
		"type",
		"format"
	],
	metaSchema: {
		type: "object",
		additionalProperties: {
			type: "object"
		}
	},
	valid: true,
	errors: true
});

// Read custom dictionary for spell check
var words = fs.readFileSync('.words').toString().split(/\r\n|\n|\r/);
for(let i in words) {
	spellcheck.spellcheck.addWord(words[i]);
}

var processes = [];

files.forEach((file) => {
	try {
		// Check JSON structure for faults
		var p = JSON.parse(fs.readFileSync(file));

		// Add process name to dictionary
		if (typeof p.id === 'string') {
			spellcheck.spellcheck.addWord(p.id);
		}

		// Prepare for tests
		processes.push([file, p]);
	} catch(err) {
		processes.push([file, null]);
		console.error(err);
		expect(err).toBeUndefined();
	}
});

describe.each(processes)("%s", (file, p) => {

	test("ID", () => {
		expect(typeof p.id).toBe('string');
		expect(idRegExp.test(p.id)).toBe(true);
	});


	test("Summary", () => {
		expect(typeof p.summary === 'undefined' || typeof p.summary === 'string').toBeTruthy();
		checkSpelling(p.summary, p);
	});

	test("Description", () => {
		// description
		expect(typeof p.description).toBe('string');
		checkDescription(p.description, p);
	});

	test("Categories", () => {
		// categories
		expect(typeof p.categories === 'undefined' || Array.isArray(p.categories)).toBeTruthy();
		if (Array.isArray(p.categories)) {
			for(let i in p.categories) {
				expect(typeof p.categories[i]).toBe('string');
			}
		}
	});

	test("Deprecated", () => {
		// deprecated
		expect(typeof p.deprecated === 'undefined' || typeof p.deprecated === 'boolean').toBeTruthy();
	});

	test("Parameters", () => {
		expect(typeof p.parameters).toBe('object');
		expect(p.parameters).not.toBeNull();
	});
	
	var params = o2a(p.parameters);
	if (params.length > 0) {
		test.each(params)("Parameters > %s", (key, param) => {
			expect(paramKeyRegExp.test(key)).toBe(true);

			// parameter description
			expect(typeof param.description).toBe('string');
			checkDescription(param.description, p);

			// Parameter flags
			expect(typeof param.required === 'undefined' || typeof param.required === 'boolean').toBeTruthy();
			expect(typeof param.deprecated === 'undefined' || typeof param.deprecated === 'boolean').toBeTruthy();

			// Parameter media type
			expect(typeof param.media_type === 'undefined' || typeof param.media_type === 'string').toBeTruthy();

			// Parameter schema
			expect(typeof param.schema).toBe('object');
			expect(param.schema).not.toBeNull();
			checkJsonSchema(param.schema);

			// Parameters that are not required should define a default value - just a warning for now
			// ToDo: Doesn't work for oneOf/allOf/...
			if(param.required !== true && typeof param.schema.default === 'undefined' && !anyOfRequired.includes(p.id)) {
				console.warn(p.id + ": Optional parameter '" + key + "' should define a default value.");
			}

			// Checking that callbacks define their parameters
			if (typeof param.schema === 'object' && param.schema.format === 'callback') {
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

		// return value media type
		expect(typeof p.returns.media_type === 'undefined' || typeof p.returns.media_type === 'string').toBeTruthy();

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
			expect(exceptionNameRegExp.test(key)).toBe(true);

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
				"first-heading-h1": false, // Usually not required for descriptions
				"fenced-code-language": false // Usually no languages available anyway
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

function checkJsonSchema(schema) {
	if (typeof schema["$schema"] === 'undefined') {
		// Set applicable JSON SChema draft version if not already set
		schema["$schema"] = "http://json-schema.org/draft-07/schema#";
	}

	let result = jsv.compile(schema);
	expect(result.errors).toBeNull();

	checkSchemaSpelling(schema);
}

function checkSchemaSpelling(schema) {
	for(var i in schema) {
		var obj = schema[i];
		if (typeof obj === 'object' && obj !== null) {
			checkSchemaSpelling(obj);
		}

		switch(i) {
			case 'title':
			case 'description':
				checkSpelling(obj);
				break;
		}
	}
}

function checkJsonSchemaValue(schema, value) {
	jsv.validate(schema, value);
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