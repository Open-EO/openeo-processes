const glob = require('glob');
const fs = require('fs');
const markdownlint = require('markdownlint');

var idRegExp = /^[A-Za-z0-9_]+$/;
var paramKeyRegExp = /^[A-Za-z0-9_]+$/; 
var exceptionNameRegExp = /^[A-Za-z0-9_]+$/;

var files = glob.sync("../*.json", {realpath: true});

describe.each(files)("%s", (file) => {
	try {
		var p = JSON.parse(fs.readFileSync(file));
		
		test(file + " > Basics", () => {
			// id
			expect(typeof p.id).toBe('string');
			expect(idRegExp.test(p.id)).toBe(true);

			// summary
			expect(typeof p.summary === 'undefined' || typeof p.summary === 'string').toBeTruthy();
			checkSpelling(p.summary);

			// description
			expect(typeof p.description).toBe('string');
			checkDescription(p.description);

			// categories
			expect(typeof p.categories === 'undefined' || Array.isArray(p.categories)).toBeTruthy();
			if (Array.isArray(p.categories)) {
				for(let i in p.categories) {
					expect(typeof p.categories[i]).toBe('string');
				}
			}

			// deprecated
			expect(typeof p.deprecated === 'undefined' || typeof p.deprecated === 'boolean').toBeTruthy();

		});

		test(file + " > Parameters", () => {
			expect(typeof p.parameters).toBe('object');
			expect(p.parameters).not.toBeNull();

			let paramKeys = Object.keys(p.parameters);
			let paramCount = paramKeys.length;
			for(let key in p.parameters) {
				expect(paramKeyRegExp.test(key)).toBe(true);
				let param = p.parameters[key];

				// parameter description
				expect(typeof param.description).toBe('string');
				checkDescription(param.description);

				// Parameter flags
				expect(typeof param.required === 'undefined' || typeof param.required === 'boolean').toBeTruthy();
				expect(typeof param.deprecated === 'undefined' || typeof param.deprecated === 'boolean').toBeTruthy();

				// Parameter media type
				expect(typeof param.media_type === 'undefined' || typeof param.media_type === 'string').toBeTruthy();

				// Parameter schema
				expect(typeof param.schema).toBe('object');
				expect(param.schema).not.toBeNull();
				checkJsonSchema(param.schema);
			}

			// parameter order
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

		test(file + " > Return Value", () => {
			expect(typeof p.returns).toBe('object');
			expect(p.returns).not.toBeNull();

			// return value description
			expect(typeof p.returns.description).toBe('string');
			checkDescription(p.returns.description);

			// return value media type
			expect(typeof p.returns.media_type === 'undefined' || typeof p.returns.media_type === 'string').toBeTruthy();

			// return value schema
			expect(typeof p.returns.schema).toBe('object');
			expect(p.returns.schema).not.toBeNull();
			checkJsonSchema(p.returns.schema);
		});

		test(file + " > Exceptions", () => {
			expect(typeof p.exceptions === 'undefined' || (typeof p.exceptions === 'object' && p.exceptions !== 'null')).toBeTruthy();

			if (typeof p.exceptions !== 'undefined') {
				for(let key in p.exceptions) {
					expect(exceptionNameRegExp.test(key)).toBe(true);
					let e = p.exceptions[key];

					// exception message
					expect(typeof e.message).toBe('string');

					// exception description
					expect(typeof e.description === 'undefined' || typeof e.description === 'boolean').toBeTruthy();
					checkDescription(e.description);

					// exception http code
					if (typeof e.http !== 'undefined') {
						expect(e.http).toBeGreaterThanOrEqual(100);
						expect(e.http).toBeLessThan(600);
					}
				}
			}
		});

		test(file + " > Examples", () => {
			expect(typeof p.examples === 'undefined' || Array.isArray(p.examples)).toBeTruthy();

			if (typeof p.examples !== 'undefined') {
				let paramKeys = Object.keys(p.parameters);
				for(let i in p.examples) {
					let example = p.examples[i];
	
					expect(typeof example).toBe('object');
					expect(example).not.toBeNull();

					// example title
					expect(typeof example.title === 'undefined' || typeof example.title === 'string').toBeTruthy();

					// example description
					expect(typeof example.description === 'undefined' || typeof example.description === 'string').toBeTruthy();
					checkDescription(example.description);

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
				}
			}
		});

		test(file + " > Links", () => {
			expect(typeof p.links === 'undefined' || Array.isArray(p.links)).toBeTruthy();

			if (typeof p.links !== 'undefined') {
				for(var i in p.links) {
					var link = p.links[i];
	
					expect(typeof link).toBe('object');
					expect(link).not.toBeNull();

					// link href
					expect(typeof link.href).toBe('string');

					// link rel
					expect(typeof link.rel === 'undefined' || typeof link.rel === 'string').toBeTruthy();

					// link title
					expect(typeof link.title === 'undefined' || typeof link.title === 'string').toBeTruthy();

					// link type
					expect(typeof link.type === 'undefined' || typeof link.type === 'string').toBeTruthy();
				}
			}
		});

	} catch(err) {
		expect(err).toBeUndefined();
	}
});

function array_diff(arr1, arr2) {
	return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
}

function checkDescription(text, commonmark = true) {
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
	checkSpelling(text);
}

function checkSpelling(text) {
	if (!text) {
		return;
	}

}

function checkProcessGraph(pg) {
	if (!pg) {
		return;
	}
	
	// ToDo: Validate process graph
}

function checkJsonSchema(schema) {
	// ToDo: Check JSON schema
	// http://json-schema.org/draft-07/schema.json
}

function checkJsonSchemaValue(schema, value) {
	// ToDo: Validate value against parameter schema

}