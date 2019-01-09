const glob = require('glob');
const fs = require('fs');

describe('openAPI Schema', () => {
	var files = glob.sync("../*.json", {realpath: true});

	var idRegExp = /^[A-Za-z0-9_]+$/;
	var paramKeyRegExp = /^[A-Za-z0-9_]+$/; 
	var exceptionNameRegExp = /^[A-Za-z0-9_]+$/;

	for (var i in files) {
		let file = files[i];
		try {
			var p = JSON.parse(fs.readFileSync(file));
			
			test(file + " > Basics", () => {
				// id
				expect(typeof p.id).toBe('string');
				expect(idRegExp.test(p.id)).toBe(true);

				// summary
				expect(typeof p.summary === 'undefined' || typeof p.summary === 'string').toBeTruthy();
				// ToDo: Spellcheck


				// description
				expect(typeof p.description).toBe('string');
				// ToDo: Spellcheck + CommonMark Lint


				// categories
				expect(typeof p.categories === 'undefined' || Array.isArray(p.categories)).toBeTruthy();
				if (Array.isArray(p.categories)) {
					for(var i in p.categories) {
						expect(typeof p.categories[i]).toBe('string');
					}
				}

				// deprecated
				expect(typeof p.deprecated === 'undefined' || typeof p.deprecated === 'boolean').toBeTruthy();

			});

			test(file + " > Parameters", () => {
				expect(typeof p.parameters).toBe('object');
				expect(p.parameters).not.toBeNull();

				var paramKeys = Object.keys(p.parameters);
				var paramCount = paramKeys.length;
				for(var key in p.parameters) {
					expect(paramKeyRegExp.test(key)).toBe(true);
					var param = p.parameters[key];

					// parameter description
					expect(typeof param.description).toBe('string');

					// Parameter flags
					expect(typeof param.required === 'undefined' || typeof param.required === 'boolean').toBeTruthy();
					expect(typeof param.deprecated === 'undefined' || typeof param.deprecated === 'boolean').toBeTruthy();

					// Parameter media type
					expect(typeof param.media_type === 'undefined' || typeof param.media_type === 'string').toBeTruthy();

					// Parameter schema
					expect(typeof param.schema).toBe('object');
					expect(param.schema).not.toBeNull();
					// ToDo: Check JSON schema
				}

				// parameter order
				expect(typeof p.parameter_order === 'undefined' || Array.isArray(p.parameter_order)).toBeTruthy();
				expect(typeof p.parameter_order === 'undefined' || p.parameter_order.length == paramCount).toBeTruthy();

				if (Array.isArray(p.parameter_order)) {
					let difference = array_diff(p.parameter_order, paramKeys);
					expect(difference.length).toBe(0);
				}

				if (paramCount >= 2) {
					expect(p.parameter_order.length).toBeGreaterThanOrEqual(2);
				}
			});

			test(file + " > Return Value", () => {
				expect(typeof p.returns).toBe('object');
				expect(p.returns).not.toBeNull();

				// return value description
				expect(typeof p.returns.description).toBe('string');

				// return value media type
				expect(typeof p.returns.media_type === 'undefined' || typeof p.returns.media_type === 'string').toBeTruthy();

				// return value schema
				expect(typeof p.returns.schema).toBe('object');
				expect(p.returns.schema).not.toBeNull();
				// ToDo: Check JSON schema
			});

			test(file + " > Exceptions", () => {
				expect(typeof p.exceptions === 'undefined' || (typeof p.exceptions === 'object' && p.exceptions !== 'null')).toBeTruthy();

				if (typeof p.exceptions !== 'undefined') {
					for(var key in p.exceptions) {
						expect(exceptionNameRegExp.test(key)).toBe(true);
						var e = p.exceptions[key];

						// exception message
						expect(typeof e.message).toBe('string');

						// exception description
						expect(typeof e.description === 'undefined' || typeof e.description === 'boolean').toBeTruthy();

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
					for(var i in p.examples) {
						var example = p.examples[i];
		
						expect(typeof example).toBe('object');
						expect(example).not.toBeNull();

						// example title
						expect(typeof example.title === 'undefined' || typeof example.title === 'string').toBeTruthy();

						// example description
						expect(typeof example.description === 'undefined' || typeof example.description === 'string').toBeTruthy();

						// Is either process_graph or arguments set?
						expect(( example.process_graph || example.arguments ) && !( example.process_graph && example.arguments )).toBeTruthy();

						// example process graph
						if (typeof example.process_graph !== 'undefined') {
							expect(typeof example.process_graph).toBe('object');
							expect(example.process_graph).not.toBeNull();
							// ToDo: Validate process graph
						}

						// example arguments
						if (typeof example.process_graph !== 'undefined') {
							expect(typeof example.arguments).toBe('object');
							expect(example.arguments).not.toBeNull();
							for(var argName in p.arguments) {
								var arg = p.arguments[argName];
								// Does parameter with this name exist?
								expect(p.parameters[argName]).toBeDefined();
								// ToDo: Validate arguments against parameter schema
								// ToDo: Check whether all required parameters are set
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
	}

	// ToDo
	// http://json-schema.org/draft-08/schema.json
});

function array_diff(arr1, arr2) {
	return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
}