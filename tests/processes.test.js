const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { normalizeString, checkDescription, checkSpelling, checkJsonSchema, getAjv, prepareSchema, isObject } = require('./testHelpers');

const anyOfRequired = [
  "quantiles",
  "array_element"
];

var jsv = null;
beforeAll(async () => {
	jsv = await getAjv();
});

var loader = (file, proposal = false) => {
	try {
		var fileContent = fs.readFileSync(file);
		// Check JSON structure for faults
		var p = JSON.parse(fileContent);

		// Prepare for tests
		processes.push([file, p, fileContent.toString(), proposal]);
		processIds.push(p.id);
	} catch(err) {
		processes.push([file, {}, "", proposal]);
		console.error(err);
		expect(err).toBeUndefined();
	}
};

var processes = [];
var processIds = [];

const files = glob.sync("../*.json", {realpath: true});
files.forEach(file => loader(file));

const proposals = glob.sync("../proposals/*.json", {realpath: true});
proposals.forEach(file => loader(file, true));

test("Check for duplicate process ids", () => {
	const duplicates = processIds.filter((id, index) => processIds.indexOf(id) !== index);
	expect(duplicates).toEqual([]);
});

describe.each(processes)("%s", (file, p, fileContent, proposal) => {

	test("File / JSON", () => {
		const ext = path.extname(file);
		// Check that the process file has a lower-case json extension
		expect(ext).toEqual(".json");
		// Check that the process name is also the file name
		expect(path.basename(file, ext)).toEqual(p.id);
		// lint: Check whether the file is correctly JSON formatted
		expect(normalizeString(JSON.stringify(p, null, 4))).toEqual(normalizeString(fileContent));
	});

	test("ID", () => {
		expect(typeof p.id).toBe('string');
		expect(/^\w+$/.test(p.id)).toBeTruthy();
	});

	test("Summary", () => {
		expect(typeof p.summary === 'undefined' || typeof p.summary === 'string').toBeTruthy();
		// lint: Summary should be short
		expect(p.summary.length).toBeLessThan(60);
		// lint: Summary should not end with a dot
		expect(/[^\.]$/.test(p.summary)).toBeTruthy();
		checkSpelling(p.summary, p);
	});

	test("Description", () => {
		// description
		expect(typeof p.description).toBe('string');
		// lint: Description should be longer than a summary
		expect(p.description.length).toBeGreaterThan(60);
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
		checkFlags(p, proposal);
	});

	test("Parameters", () => {
		expect(Array.isArray(p.parameters)).toBeTruthy();
	});
	
	var params = o2a(p.parameters);
	if (params.length > 0) {
		test.each(params)("Parameters > %s", (key, param) => {
			checkParam(param, p);
		});
	}

	test("Return Value", () => {
		expect(isObject(p.returns)).toBeTruthy();
		expect(p.returns).not.toBeNull();

		// return value description
		expect(typeof p.returns.description).toBe('string');
		// lint: Description should not be empty
		expect(p.returns.description.length).toBeGreaterThan(0);
		checkDescription(p.returns.description, p);

		// return value schema
		expect(p.returns.schema).not.toBeNull();
		expect(typeof p.returns.schema).toBe('object');
		// lint: Description should not be empty
		checkJsonSchema(jsv, p.returns.schema);
	});

	test("Exceptions", () => {
		expect(typeof p.exceptions === 'undefined' || isObject(p.exceptions)).toBeTruthy();
	});

	var exceptions = o2a(p.exceptions);
	if (exceptions.length > 0) {
		test.each(exceptions)("Exceptions > %s", (key, e) => {
			expect(/^\w+$/.test(key)).toBeTruthy();

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
			// Make an object for easier access later
			var parametersObj = {};
			for(var i in p.parameters) {
				parametersObj[p.parameters[i].name] = p.parameters[i];
			}
			var paramKeys = Object.keys(parametersObj);

			expect(isObject(example)).toBeTruthy();
			expect(example).not.toBeNull();

			// example title
			expect(typeof example.title === 'undefined' || typeof example.title === 'string').toBeTruthy();
			checkSpelling(example.title, p);

			// example description
			expect(typeof example.description === 'undefined' || typeof example.description === 'string').toBeTruthy();
			checkDescription(example.description, p);

			// example process graph
			expect(example.process_graph).toBeUndefined();

			// example arguments
			expect(typeof example.arguments).toBe('object');
			expect(example.arguments).not.toBeNull();
			// Check argument values
			for(let argName in example.arguments) {
				// Does parameter with this name exist?
				
				expect(paramKeys).toContain(argName);
				checkJsonSchemaValue(parametersObj[argName].schema, example.arguments[argName]);
			}
			// Check whether all required parameters are set
			for(let key in parametersObj) {
				if (!parametersObj[key].optional) {
					expect(example.arguments[key]).toBeDefined();
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
			expect(isObject(link)).toBeTruthy();

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

function checkFlags(p, proposal = false) {
	// deprecated
	expect(typeof p.deprecated === 'undefined' || typeof p.deprecated === 'boolean').toBeTruthy();
	// lint: don't specify defaults
	expect(typeof p.deprecated === 'undefined' || p.deprecated === true).toBeTruthy();
	if (proposal) {
		// experimental must be true for proposals
		expect(p.experimental).toBe(true);
	}
	else {
		// experimental must not be false for stable
		// lint: don't specify defaults, so false should not be set explicitly
		expect(p.experimental).toBeUndefined();
	}
}

function checkParam(param, p, checkCbParams = true) {
	// parameter name
	expect(typeof param.name).toBe('string');
	expect(/^\w+$/.test(param.name)).toBeTruthy();

	// parameter description
	expect(typeof param.description).toBe('string');
	// lint: Description should not be empty
	expect(param.description.length).toBeGreaterThan(0);
	checkDescription(param.description, p);

	// Parameter flags
	expect(typeof param.optional === 'undefined' || typeof param.optional === 'boolean').toBeTruthy();
	// lint: don't specify defaults
	expect(typeof param.optional === 'undefined' || param.optional === true).toBeTruthy();
	// lint: make sure there's no old required flag
	expect(typeof param.required === 'undefined').toBeTruthy();
	// Check flags (recommended / experimental)
	checkFlags(param);

	// Parameter schema
	expect(param.schema).not.toBeNull();
	expect(typeof param.schema).toBe('object');
	checkJsonSchema(jsv, param.schema);

	if (!checkCbParams) {
		// Parameters that are not required should define a default value
		if(param.optional === true && !anyOfRequired.includes(p.id)) {
			expect(param.default).toBeDefined();
		}
	}
	else {
		// Checking that callbacks (process-graphs) define their parameters
		if (typeof param.schema === 'object' && param.schema.subtype === 'process-graph') {
			// lint: A callback without parameters is not very useful
			expect(Array.isArray(param.schema.parameters) && param.schema.parameters.length > 0).toBeTruthy();

			// Check all callback params
			for(var i in param.schema.parameters) {
				checkParam(param.schema.parameters[i], p, false);
			}
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
		a.push([
			o[k].name ? o[k].name : k, // name
			o[k] // obj
		]);
	}
	return a;
}