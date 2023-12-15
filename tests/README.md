# Tests

This folder contains test cases for the openEO processes.

## Processes

- [x] absolute
- [x] add
- [x] add_dimension
- [ ] aggregate_spatial
- [ ] aggregate_spatial_window (experimental)
- [ ] aggregate_temporal
- [ ] aggregate_temporal_period
- [x] all
- [x] and
- [ ] anomaly
- [x] any
- [x] apply*
- [x] apply_dimension*
- [ ] apply_kernel
- [ ] apply_neighborhood
- [ ] apply_polygon (experimental)
- [x] arccos
- [x] arcosh
- [x] arcsin
- [x] arctan
- [x] arctan2
- [x] array_append
- [x] array_apply
- [x] array_concat
- [x] array_contains
- [x] array_create
- [x] array_create_labeled (experimental)
- [x] array_element
- [x] array_filter
- [x] array_find
- [x] array_find_label (experimental)
- [x] array_interpolate_linear
- [x] array_labels
- [x] array_modify* (experimental)
- [x] arsinh
- [x] artanh
- [x] between
- [x] ceil
- [ ] climatological_normal
- [x] clip
- [x] constant
- [x] cos
- [x] cosh
- [x] count*
- [x] cummax* (experimental)
- [x] cummin* (experimental)
- [x] cumproduct* (experimental)
- [x] cumsum* (experimental)
- [x] create_data_cube
- [x] date_between* (experimental)
- [x] date_difference* (experimental)
- [x] date_shift* (experimental)
- [x] dimension_labels
- [x] divide
- [x] drop_dimension*
- [x] e
- [x] eq
- [x] exp
- [x] extrema
- [x] filter_bands*
- [ ] filter_bbox
- [ ] filter_labels (experimental)
- [ ] filter_spatial
- [x] filter_temporal*
- [ ] filter_vector (experimental)
- [x] first
- [ ] flatten_dimensions (experimental)
- [x] floor
- [x] gt
- [x] gte
- [x] if
- [x] int
- [x] is_infinite (experimental)
- [x] is_nan
- [x] is_nodata*
- [x] last
- [x] linear_scale_range
- [x] ln
- [ ] load_geojson (experimental)
- [x] log
- [x] lt
- [x] lte
- [x] mask*
- [ ] mask_polygon
- [x] max
- [x] mean
- [x] median
- [x] merge_cubes*
- [x] min
- [x] mod
- [x] multiply
- [x] nan (experimental)
- [ ] ndvi
- [x] neq
- [x] normalized_difference
- [x] not
- [x] or
- [x] order*
- [x] pi
- [x] power
- [x] product
- [x] quantiles
- [x] rearrange*
- [x] reduce_dimension*
- [ ] reduce_spatial (experimental)
- [x] rename_dimension
- [x] rename_labels
- [ ] resample_cube_spatial
- [ ] resample_cube_temporal
- [ ] resample_spatial
- [x] round
- [x] sd
- [x] sgn
- [x] sin
- [x] sinh
- [x] sort*
- [x] sqrt
- [x] subtract
- [x] sum
- [x] tan
- [x] tanh
- [x] text_begins
- [x] text_concat
- [x] text_contains
- [x] text_ends
- [ ] trim_cube
- [ ] unflatten_dimension (experimental)
- [x] variance
- [ ] vector_buffer (experimental)
- [ ] vector_reproject (experimental)
- [ ] vector_to_regular_points (experimental)
- [x] xor

\* = could use some more tests

**Important:** The differentiation of null and NaN is to be discussed and reflected in the tests.
See <https://github.com/Open-EO/openeo-processes/issues/480> for details.

## Missing processes

The following processes have no test cases as the results heavily depend on the underlying implementation
or need an external services to be available for testing (e.g. loading files from the user workspace or a UDF server).
We don't expect that we can provide meaningful test cases for these processes.

- ard_normalized_radar_backscatter (experimental)
- ard_surface_reflectance (experimental)
- atmospheric_correction (experimental)
- cloud_detection (experimental)
- fit_curve (experimental)
- inspect (experimental)
- load_collection
- load_stac (experimental)
- load_uploaded_files (experimental)
- load_url (experimental)
- predict_curve (experimental)
- run_udf
- run_udf_externally (experimental)
- sar_backscatter (experimental)
- save_result
- vector_to_random_points (experimental)

## Assumptions

The test cases assume a couple of things as they are an abstraction and not bound to specific implementations:
- The JSON Schema type `number` explicitly includes the values `+Infinity`, `-Infinity` and `NaN`.
- The input and output values for no-data values are `null` by default unless otherwise specified by a runner.
- Input that is not valid according to the schemas, will be rejected upfront and will not be checked on. For example, the absolute process only tests against the data types `number` and `null`. There are no tests for a boolean or string input.
- Numerical data types such as uint8 don't matter, i.e. tests don't check for overflows etc. This suite can't provide such tests as the underlying data type is not known.
- If not otherwise specified for numbers, a precision of 10 decimals is checked so return values should have at least 11 decimals.

## Test Files

To allow for more data types (e.g. infinity and nan for numbers), all the files are encoded in **JSON5** instead of JSON.

The test files have the following schema:

```yaml
description: A document with test cases for a specific openEO process
type: object
required:
  - id
  - experimental
  - tests
properties:
  id:
    type: string
    description: The identifier for the process.
    pattern: '^\w+$'
  experimental:
    type: boolean
    description: Declares that the process is experimental, tests may fail.
    default: false
  level:
    type: string
    description: openEO process profile the process is assigned to.
    default: L4
    pattern: 'L\d([\w-])?'
  tests:
    description: A list of test cases without a specific order
    type: array
    items:
      description: |-
        A test case with a set of arguments and a specific return value or exception

        If both `returns` and `throws` are provided, it means that either of it should be true.
        So either the process retuens as specified or throws the specified error.
      type: object
      required:
        - arguments
      oneOf:
        - required:
            - returns
        - required:
            - throws
      properties:
        arguments:
          description: A key-value pair for an argument. Key = Parameter name, Value = Argument value
          type: object
          additionalProperties:
            description: An argument, can be of any type
        returns:
          description: The return value, can be of any type
        required:
          description: >-
            A list of processes that is required for this test (except for the process provided in `id`).
            This is usually required for processes that run a sub-process (callback) so that the test suite can skip tests for processes that are not supported.
          type: array
          items:
            type: string
            description: The identifier for the sub-process.
            pattern: '^\w+$'
        delta:
          description: If set to a positive number the equality of the actual return value and the expected return value is checked against a delta value to circumvent problems with floating-point inaccuracy.
          type: number
          default: 0.0000000001
        throws:
          description: >-
            Specifies whether the execution is meant to throw an exception.
            If used in combination with a return value, it makes the test effectively optional.
          oneOf:
            - description: Specify an exception name from the process specification
              type: string
              minLength: 1
            - description: Use true if the type of exception is unknown
              type: boolean
              const: true
        level:
          type:
           - string
           - null
          description: >-
            openEO process profile the test is assigned to.
            Defaults to the level of the process.
          default: null
          pattern: 'L\d([\w-])?'
```

### No-data values

No-data values have a special encoding in tests (see below).
The encoding is replaced with `null` unless otherwise specified by the runners.

```json
{
  "type": "nodata"
}
```

### Datetimes

Datetimes as strings have a varying precision, especially regarding the milliseconds.
Also, sometimes timezones are differently handled.

Datetimes in return values should be encoded as follows so that the results can be compared better:

```json
{
  "type": "datetime",
  "value": "2020-01-01T00:00:00Z"
}
```

### External references

Arguments and return values can point to external files, e.g.

```json
{
  "$ref": "https://host.example/datacube.json"
}
```

The test suite can currently only load JSON and JSON5 files.

### Labeled arrays

Labeled arrays can't be represented in JSON5 and will be provided as an object instead.

```json
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

```json
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
