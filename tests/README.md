# Tests

This folder contains test cases for the openEO processes.

## Supported processes

- [x] absolute
- [x] add
- [ ] add_dimension
- [ ] aggregate_spatial
- [ ] aggregate_spatial_window
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
- [ ] apply_polygon
- [ ] arccos
- [ ] arcosh
- [ ] arcsin
- [ ] arctan
- [ ] arctan2
- [ ] array_append
- [ ] array_apply
- [ ] array_concat
- [ ] array_contains
- [ ] array_create
- [ ] array_create_labeled
- [ ] array_element
- [ ] array_filter
- [ ] array_find
- [ ] array_find_label
- [ ] array_interpolate_linear
- [ ] array_labels
- [ ] array_modify
- [ ] arsinh
- [ ] artanh
- [ ] between
- [ ] ceil
- [ ] climatological_normal
- [ ] clip
- [x] constant
- [ ] cos
- [ ] cosh
- [ ] count
- [ ] create_data_cube
- [ ] cummax
- [ ] cummin
- [ ] cumproduct
- [ ] cumsum
- [ ] date_between
- [ ] date_difference
- [ ] date_shift
- [ ] dimension_labels
- [ ] divide
- [ ] drop_dimension
- [x] e
- [ ] eq
- [ ] exp
- [ ] extrema
- [ ] filter_bands
- [ ] filter_bbox
- [ ] filter_labels
- [ ] filter_spatial
- [ ] filter_temporal
- [ ] filter_vector
- [ ] first
- [ ] flatten_dimensions
- [ ] floor
- [ ] gt
- [ ] gte
- [ ] if
- [ ] int
- [ ] is_infinite
- [x] is_nan
- [ ] is_valid
- [ ] last
- [ ] linear_scale_range
- [ ] ln
- [ ] load_geojson
- [ ] load_stac
- [ ] load_uploaded_files
- [ ] load_url
- [ ] log
- [ ] lt
- [ ] lte
- [ ] mask
- [ ] mask_polygon
- [ ] max
- [ ] mean
- [ ] median
- [ ] merge_cubes
- [ ] min
- [ ] mod
- [ ] multiply
- [x] nan
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
- [ ] reduce_spatial
- [ ] rename_dimension
- [ ] rename_labels
- [ ] resample_cube_spatial
- [ ] resample_cube_temporal
- [ ] resample_spatial
- [ ] round
- [ ] sd
- [ ] sgn
- [ ] sin
- [ ] sinh
- [ ] sort
- [ ] sqrt
- [x] subtract
- [ ] sum
- [ ] tan
- [ ] tanh
- [x] text_begins
- [x] text_concat
- [x] text_contains
- [x] text_ends
- [ ] trim_cube
- [ ] unflatten_dimension
- [ ] variance
- [ ] vector_buffer
- [ ] vector_reproject
- [ ] vector_to_regular_points
- [x] xor

## Incomplete processes

- [x] is_nodata - actual no-data values depends on context / metadata

## Missing processes

The following processes have no test cases as the results heavily depend on the underlying implementation
or need an external services to be available for testing (e.g. loading files from the user workspace or a UDF server).
We don't expect that we can provide meaningful test cases for these processes.

- [ ] ard_normalized_radar_backscatter
- [ ] ard_surface_reflectance
- [ ] atmospheric_correction
- [ ] cloud_detection
- [ ] fit_curve
- [ ] inspect
- [ ] load_collection
- [ ] load_uploaded_files
- [ ] predict_curve
- [ ] run_udf
- [ ] run_udf_externally
- [ ] sar_backscatter
- [ ] save_result
- [ ] vector_to_random_points

## Assumptions

The test cases assume a couple of things as they are an abstraction and not bound to specific implementations:
- The JSON Schema type `number` explicitly includes the values `+Infinity`, `-Infinity` and `NaN`.
- The input and output values for no-data values are `null`, so there's no mapping to e.g. `0` as no-data value.
- Input that is not valid according to the schemas, will be rejected upfront and will not be checked on. For example, the absolute process only tests against the data types `number` and `null`. There are no tests for a boolean or string input.
- Numerical data types such as uint8 don't matter, i.e. tests don't check for overflows etc. This suite can't provide such tests as the underlying data type is not known.

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
      description: A test case with a set of arguments and a specific return value or exception
      type: object
      required:
        - arguments
      properties:
        arguments:
          description: A key-value pair for an argument. Key = Parameter name, Value = Argument value
          type: object
          additionalProperties:
            description: An argument, can be of any type
      oneOf:
        - required:
            - returns
          properties:
            returns:
              description: The return value, can be of any type
            delta:
              description: If set to a positive number the equality of the actual return value and the expected return value is checked against a delta value to circumvent problems with floating-point inaccuracy.
              type: number
        - required:
            - throws
          properties:
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

### Assets

Additional assets will be provided for the test cases.

- Raster data cubes will be provided as CoverageJSON.
- Multi-dimensional vector data cubes can't be provided right now, we use GeoJSON whenever possible.
