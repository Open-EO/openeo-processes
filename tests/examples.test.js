const glob = require('glob');
const fs = require('fs');
const path = require('path');
const { normalizeString, checkDescription } = require('./testHelpers');
const { ProcessRegistry, ProcessGraph } = require('@openeo/js-processgraphs');

const registry = new ProcessRegistry();
const processes = glob.sync("../*.json", {realpath: true});
processes.forEach(file => {
	try {
		var process = require(file);
		registry.add(process);
	} catch(err) {
		console.error(err);
	}
});

const files = glob.sync("../examples/*.json", {realpath: true});
var examples = [];
files.forEach(file => {
	try {
		var fileContent = fs.readFileSync(file);
		// Check JSON structure for faults
		var example = JSON.parse(fileContent);

		// Prepare for tests
		examples.push([file, example, fileContent.toString()]);
	} catch(err) {
		examples.push([file, {}, ""]);
		console.error(err);
		expect(err).toBeUndefined();
	}
});

describe.each(examples)("%s", (file, e, fileContent) => {

	test("File / JSON", () => {
		const ext = path.extname(file);
		// Check that the process file has a lower-case json extension
		expect(ext).toEqual(".json");
		// If id is set: Check that the process name is also the file name
		if (typeof e.id !== 'undefined') {
			expect(path.basename(file, ext)).toEqual(e.id);
		}
		// lint: Check whether the file is correctly JSON formatted
		expect(normalizeString(JSON.stringify(e, null, 4))).toEqual(normalizeString(fileContent));
	});

	let pg = new ProcessGraph(e, registry);

	test("Require descriptions", () => {
		// description
		expect(typeof e.description).toBe('string');
		// lint: Description should be longer than a summary
		expect(e.description.length).toBeGreaterThan(55);
		checkDescription(e.description, e);
	});

	test("Parse", () => {
		expect(() => pg.parse()).not.toThrow();
		expect(pg.parsed).toBe(true);
	});

	test("Validation", async () => {
		await expect(pg.validate()).resolves.not.toThrow();
		expect(pg.isValid()).toBeTruthy();
	});

});
