const glob = require('glob');
const fs = require('fs');

var files = glob.sync("../*.json", {realpath: true});

console.log(files);

files.forEach(file => {
	try {
		// Check JSON structure for faults
		var p = JSON.parse(fs.readFileSync(file));

		for(var param in p.parameters) {
			p.parameters[param] = upgrade(p.parameters[param], p, param);
		}

		p.returns = upgrade(p.returns, p);

		fs.writeFileSync(file, JSON.stringify(p, null, 4))
	} catch(err) {
		console.error(file, err);
	}
});

function upgrade(o, process, paramName = null) {
	var s = o.schema;

	if (s.oneOf) {
		o.schema = s.oneOf;
		console.warn(process.id, paramName, 'Schema uses oneOf');
	}
	else if (s.anyOf) {
		if (typeof o.schema.default !== 'undefined') {
			o.default = o.schema.default;
		}
		o.schema = s.anyOf;
	}

	var schemas = Array.isArray(o.schema) ? o.schema : [o.schema];
	for(var i in schemas) {
		if (typeof schemas[i].default !== 'undefined') {
			if (!paramName) {
				console.warn(process.id, 'Return value has default value.');
			}
			if (typeof o.default !== 'undefined') {
				console.warn(process.id, paramName, 'Parameter has multiple default values:', schemas[i].default);
			}
			else {
				o.default = schemas[i].default;
				delete schemas[i].default;
			}
		}
	}
	if (paramName && !o.required && typeof o.default === 'undefined') {
		console.warn(process.id, paramName, 'Parameter has no default value.');
	}


	return o;
}