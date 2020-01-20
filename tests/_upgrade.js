const glob = require('glob');
const fs = require('fs');

var files = glob.sync("../*.json", {realpath: true});

console.log(files);

files.forEach(file => {
	try {
		// Check JSON structure for faults
		var p = JSON.parse(fs.readFileSync(file));

		if (!Array.isArray(p.parameter_order) || p.parameter_order.length === 0) {
			p.parameter_order = [];
			for(var param in p.parameters) {
				p.parameter_order.push(param);
			}
		}

		var newParams = [];
		for(var i in p.parameter_order) {
			var param = p.parameter_order[i];
			newParams.push(upgrade(p.parameters[param], p, param));
		}

		delete p.parameter_order;

		p.returns = upgrade(p.returns, p);

		fs.writeFileSync(file, JSON.stringify(p, null, 4))
	} catch(err) {
		console.error(file, err);
	}
});

function upgrade(o, process, paramName = null) {
	// Add param name
	if (paramName) {
		o = Object.assign({name: paramName}, o); // Make sure is name is the "first" element
	}

	// Upgrade schema structure
	o.schema = convertAnyOf(o.schema, process, paramName);

	var schemas = Array.isArray(o.schema) ? o.schema : [o.schema];
	for(var i in schemas) {
		// Upgrade default value
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

		// Upgrade callback parameters
		if (paramName && typeof schemas[i].parameters !== 'undefined' && Object.keys(schemas[i].parameters).length > 0) {
			var newCbParams = [];
			for(var cbParamName in schemas[i].parameters) {
				var cbParam = schemas[i].parameters[cbParamName];
				var newParam = {
					name: cbParamName,
					description: cbParam.description || "",
					required: true
				};
				if (newParam.description.length < 1) {
					console.warn(process.id, paramName, 'Callback parameter has no description.');
				}
				delete cbParam.description;
				if (Object.keys(cbParam).length === 0) {
					console.info(process.id, paramName, 'Any type schema');
					cbParam.description = "Any data type.";
				}
				newParam.schema = convertAnyOf(cbParam);
				newCbParams.push(newParam);
			}
			schemas[i].parameters = newCbParams;
		}

	}
	if (paramName && !o.required && typeof o.default === 'undefined') {
		console.warn(process.id, paramName, 'Parameter has no default value.');
	}


	return o;
}

function convertAnyOf(schema, process, paramName = null) {
	if (schema.oneOf) {
		schema = schema.oneOf;
		console.warn(process.id, paramName, 'Schema uses oneOf');
	}
	else if (schema.anyOf) {
		if (typeof schema.default !== 'undefined') {
			o.default = schema.default;
		}
		schema = schema.anyOf;
	}
	else {
		return schema;
	}
}