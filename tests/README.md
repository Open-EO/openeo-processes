# Tests

This folder contains test cases for the openEO processes.

## Supported processes

- [x] absolute
- [x] add
- [ ] add_dimension
- [ ] aggregate_spatial
- [ ] aggregate_temporal
- [ ] aggregate_temporal_period
- [x] all
- [x] and
- [ ] anomaly
- [x] any
- [ ] apply
- [ ] apply_dimension
- [ ] apply_kernel
- [ ] apply_neighborhood
- [x] arccos - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] arcosh - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] arcsin - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] arctan
- [x] arctan2
- [x] array_append - <https://github.com/Open-EO/openeo-processes/pull/478>
- [ ] array_apply
- [x] array_concat
- [x] array_contains
- [x] array_create
- [x] array_element
- [ ] array_filter
- [x] array_find
- [ ] array_interpolate_linear
- [x] array_labels
- [x] array_modify (experimental) - could use some more tests
- [x] arsinh
- [x] artanh - <https://github.com/Open-EO/openeo-processes/pull/476>
- [ ] between
- [x] ceil
- [ ] climatological_normal
- [x] clip - missing: <https://github.com/Open-EO/openeo-processes/issues/472>
- [x] constant
- [x] cos - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] cosh - <https://github.com/Open-EO/openeo-processes/pull/476>
- [ ] count
- [x] cummax (experimental) - could use some more tests
- [x] cummin (experimental) - could use some more tests
- [x] cumproduct (experimental) - could use some more tests
- [x] cumsum (experimental) - could use some more tests
- [ ] create_data_cube
- [ ] date_between (experimental) - could use some more tests
- [ ] date_difference (experimental) - could use some more tests
- [ ] date_shift (experimental) - could use some more tests
- [ ] dimension_labels
- [x] divide - <https://github.com/Open-EO/openeo-processes/pull/473>
- [ ] drop_dimension
- [x] e
- [ ] eq
- [x] exp
- [ ] extrema
- [ ] filter_bands
- [ ] filter_bbox
- [ ] filter_spatial
- [ ] filter_temporal
- [ ] first
- [x] floor
- [ ] gt
- [ ] gte
- [x] if
- [x] int
- [x] is_infinite (experimental)
- [x] is_nan
- [ ] last
- [ ] linear_scale_range
- [x] ln - <https://github.com/Open-EO/openeo-processes/pull/473>
- [x] log - <https://github.com/Open-EO/openeo-processes/pull/473>
- [ ] lt
- [ ] lte
- [ ] mask
- [ ] mask_polygon
- [ ] max
- [ ] mean
- [ ] median
- [ ] merge_cubes
- [ ] min
- [x] mod - <https://github.com/Open-EO/openeo-processes/pull/473>
- [ ] multiply
- [x] nan (experimental)
- [ ] ndvi
- [ ] neq
- [ ] normalized_difference
- [x] not
- [x] or
- [ ] order
- [x] pi
- [ ] power
- [ ] product
- [ ] quantiles
- [ ] rearrange
- [ ] reduce_dimension
- [ ] rename_dimension
- [ ] rename_labels
- [ ] resample_cube_spatial
- [ ] resample_cube_temporal
- [ ] resample_spatial
- [x] round
- [ ] sd
- [x] sgn
- [x] sin - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] sinh
- [ ] sort
- [x] sqrt - missing: <https://github.com/Open-EO/openeo-processes/issues/474>
- [x] subtract
- [ ] sum
- [x] tan - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] tanh - <https://github.com/Open-EO/openeo-processes/pull/476>
- [x] text_begins
- [x] text_concat
- [x] text_contains
- [x] text_ends
- [ ] trim_cube
- [ ] variance
- [x] xor

## Incomplete processes

- [x] is_nodata - actual no-data values depends on context / metadata

## Missing processes

The following processes have no test cases as the results heavily depend on the underlying implementation
or need an external services to be available for testing (e.g. loading files from the user workspace or a UDF server).
We don't expect that we can provide meaningful test cases for these processes.

- [ ] ard_normalized_radar_backscatter (experimental)
- [ ] ard_surface_reflectance (experimental)
- [ ] atmospheric_correction (experimental)
- [ ] cloud_detection (experimental)
- [ ] fit_curve (experimental)
- [ ] inspect (experimental)
- [ ] load_collection
- [ ] load_stac (experimental)
- [ ] load_uploaded_files (experimental)
- [ ] predict_curve (experimental)
- [ ] run_udf
- [ ] run_udf_externally (experimental)
- [ ] sar_backscatter (experimental)
- [ ] save_result
- [ ] vector_to_random_points (experimental)

The following processes are in proposal state (i.e. experimental) and may be added later:

- [ ] aggregate_spatial_window (experimental)
- [ ] apply_polygon (experimental)
- [ ] array_create_labeled (experimental)
- [ ] array_find_label (experimental)
- [ ] filter_labels (experimental)
- [ ] filter_vector (experimental)
- [ ] flatten_dimensions (experimental)
- [ ] load_geojson (experimental)
- [ ] load_url (experimental)
- [ ] reduce_spatial (experimental)
- [ ] unflatten_dimension (experimental)
- [ ] vector_buffer (experimental)
- [ ] vector_reproject (experimental)
- [ ] vector_to_regular_points (experimental)

## Assumptions

The test cases assume a couple of things as they are an abstraction and not bound to specific implementations:
- The JSON Schema type `number` explicitly includes the values `+Infinity`, `-Infinity` and `NaN`.
- The input and output values for no-data values are `null`, so there's no mapping to e.g. `0` as no-data value.
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
  - tests
properties:
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
        optional:
          description: Marks optional test so a failure produces only a warning.
          type: boolean
          default: false
        returns:
          description: The return value, can be of any type
        delta:
          description: If set to a positive number the equality of the actual return value and the expected return value is checked against a delta value to circumvent problems with floating-point inaccuracy.
          type: number
        throws:
          oneOf:
            - description: Specify an exception name from the process specification
              type: string
              minLength: 1
            - description: Use true if the type of exception is unknown
              type: boolean
              const: true
```

Arguments and return values can point to external files, e.g.
```json
{
  "$ref": "https://host.example/file.nc"
}
```

There are a couple of data types that can't be represented in JSON5 and will be provided as an object instead.

**Labeled arrays:**
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

**Data Cube Metadata:**
```json
{
  "type": "datacube",
  "data": {
    // uses the STAC datacube extension
    "bands": {
        "type": "bands",
        "values": [
          "B01",
          "B02",
          "Bo3"
        ]
    }
    // ...
  }
}
```

### Assets

Additional assets will be provided for the test cases.

- Raster data cubes will be provided as CoverageJSON.
- Multi-dimensional vector data cubes can't be provided right now, we use GeoJSON whenever possible.
