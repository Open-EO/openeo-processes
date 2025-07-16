# Tests

This folder contains test cases for the openEO processes.

## Assumptions

The test cases assume a couple of things as they are an abstraction and not bound to specific implementations:
- The JSON Schema type `number` explicitly includes the values `+Infinity`, `-Infinity` and `NaN`.
- The input and output values for no-data values are `null` by default unless otherwise specified by a runner.
- Input that is not valid according to the schemas, will be rejected upfront and will not be checked on. For example, the absolute process only tests against the data types `number` and `null`. There are no tests for a boolean or string input.
- Numerical data types such as uint8 don't matter, i.e. tests don't check for overflows etc. This suite can't provide such tests as the underlying data type is not known.
- If not otherwise specified for numbers, a precision of 10 decimals is checked so return values should have at least 11 decimals.

## Test Files

To allow for more data types (e.g. infinity and nan for numbers), all the files are encoded in **JSON5** instead of JSON.

The test files have the following schema: [schema/schema.json](./schema/schema.json)

### No-data values

No-data values have a special encoding in tests (see below).
The encoding is replaced with `null` unless otherwise specified by the runners.

```json5
{
  "type": "nodata"
}
```

### Datetimes

Datetimes as strings have a varying precision, especially regarding the milliseconds.
Also, sometimes timezones are differently handled.

Datetimes in return values should be encoded as follows so that the results can be compared better:

```json5
{
  "type": "datetime",
  "value": "2020-01-01T00:00:00Z"
}
```

### External references

Arguments and return values can point to external files, e.g.

```json5
{
  "$ref": "https://host.example/datacube.json"
}
```

The test suite can currently only load JSON and JSON5 files.

### Labeled arrays

Labeled arrays can't be represented in JSON5 and will be provided as an object instead.

```json5
{
  "type": "labeled-array",
  "data": [
    {
      "key": "B01",
      "value": 1.23
    },
    {
      "key": "B02",
      "value": 0.98
    }
    // ...
  ]
}
```

### Datacubes

Datacubes can't be represented in JSON5 and will be provided as an object instead.
Vector datacubes are currently not supported.

```json5
{
  "type": "datacube",
  "data": [
    // multi-dimensional array
    // can be set to `null` if the data values are irrelevant for the test.
  ],
  "nodata": [
    NaN
  ],
  "order": ["bands", "t", "y", "x"],
  "dimensions": {
    // similar to the STAC datacube extension
    // properties: type, axis (if type = spatial), values, and reference_system (optional)
    "bands": {
      "type": "bands",
      "values": ["blue","green","red","nir"]
    },
    "t": {
      "type": "temporal",
      "values": ["2020-06-01T00:00:00Z","2020-06-03T00:00:00Z","2020-06-06T00:00:00Z"]
    },
    "y": {
      "type": "spatial",
      "axis": "y",
      "values": [5757495.0,5757485.0,5757475.0,5757465.0],
      "reference_system": "EPSG:25832"
    },
    "x": {
      "type": "spatial",
      "axis": "x",
      "values": [404835.0,404845.0,404855.0,404865.0,404875.0],
      "reference_system": "EPSG:25832"
    }
  }
}
```
