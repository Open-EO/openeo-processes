# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Processes:
    - `add`
    - `aggregate_polygon_binary`
    - `all`
    - `any`
    - `array_apply`
    - `array_filter`
    - `array_find`
    - `drop_dimension`
    - `filter_labels`
    - `labels`
    - `load_uploaded_files`
    - `mask_polygon`
    - `reduce_dimension`
    - `reduce_dimension_binary`
    - `rename_labels`
- Added further examples

### Changed
- The JSON Schema keyword `format` has been replaced with the custom keyword `subtype`.
- Schema format/subtype `callback` has been renamed to `process-graph`.
- Default values are now specified on the parameter-level, not in the JSON schemas.
- Processes supporting multiple data types in parameters or return values with `anyOf` are now listing the data types directly as array. `anyOf` is discouraged.
- Comparison processes `eq`, `gt`, `gte`, `lt`, `lte`, `neq` and `between` accept all data types as input for the operands.
- `add_dimension`: Parameter `value` renamed to `label`.
- `apply_dimension`: Replaced with a completely new definition. [#73](https://github.com/Open-EO/openeo-processes/issues/73)
- `aggregate_polygon`: The data cube implicitly gets restricted to the bounds of the polygons as if `filter_polygon` would have been used beforehand. [#101](https://github.com/Open-EO/openeo-processes/issues/101)
- `aggregate_temporal`: Parameter `labels` is optional. [#19](https://github.com/Open-EO/openeo-processes/issues/19)
- `apply_kernel`: Only supported 2D kernels on the horizontal spatial dimensions. [#69](https://github.com/Open-EO/openeo-processes/issues/69)
- `clip`: Works on a single value instead on arrays (replaced parameter `data` with `x`). [#75](https://github.com/Open-EO/openeo-processes/issues/75)
- `count`: Renamed parameter `expression` to `condition`.
- `debug`: Replaced with a completely new definition. [#82](https://github.com/Open-EO/openeo-processes/issues/71), [API#100](https://github.com/Open-EO/openeo-api/issues/100), [API#214](https://github.com/Open-EO/openeo-api/issues/214)
- `filter_bands`: Merged parameters `bands` and `common_names`. [#77](https://github.com/Open-EO/openeo-processes/issues/77)
- `if`:
    - Doesn't pass through `null`, but instead `null` leads to rejecting the condition.
    - Parameter `expression` renamed to `value`.
    - Parameter `accept` is required.
    - Parameter `reject` defaults to `null`.
- `load_collection`:
    - Parameter `bands` accepts common band names. [#77](https://github.com/Open-EO/openeo-processes/issues/77)
    - Parameter `properties`: Callback parameter `value` renamed to `x`.
- `mask`: Clarifies behavior for missing dimensions in the mask. [#55](https://github.com/Open-EO/openeo-processes/issues/55)
- `merge_cubes` works with binary reduction operators instead of list-based reducers. [#94](https://github.com/Open-EO/openeo-processes/issues/94)
- `ndvi` and `normalized_difference`: Rewrite of the processes with a completely new behavior. [#60](https://github.com/Open-EO/openeo-processes/issues/60)
- `not`: Parameter `expression` renamed to `x`.
- `resample_spatial`: Default value of parameter `align` changed from `lower-left` to `upper-left`. [#61](https://github.com/Open-EO/openeo-processes/issues/61)
- The following operations work on two values instead on a sequence of values: `and`, `divide`, `multiply`, `or`, `subtract`, `xor`. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- `product` works as before, but is not an alias of `multiply` any longer. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- `text_begins`, `text_contains`, `text_ends`: `null` values are supported and get passed through.

### Deprecated
- `filter_bbox`, `load_collection`, `resample_spatial`: PROJ definitions are deprecated in favor of EPSG codes, WKT2 and PROJJSON. [#58](https://github.com/Open-EO/openeo-processes/issues/58)

### Removed
- The following processes don't support `ignore_nodata` any longer: `and`, `divide`, `multiply`, `or`, `subtract`, `xor`. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- The following processes don't support `binary` any longer: `aggregate_temporal`, `merge_cubes`, `resample_cube_temporal`. [#94](https://github.com/Open-EO/openeo-processes/issues/94)
- Support for vector data cubes, except for the processes `aggregate_poylgon` and `save_result`. [#68](https://github.com/Open-EO/openeo-processes/issues/68)
- `aggregate_polygon`: Doesn't allow returning a GeoJSON any longer.
- `filter_temporal` and `load_collection`: Temporal extents don't support time-only intervals any longer. [#88](https://github.com/Open-EO/openeo-processes/issues/88)
- `mask`: The mask parameter doesn't accept vectors (polygons) any longer. Use process `mask_polygon` instead. [#110](https://github.com/Open-EO/openeo-processes/issues/110)
- Processes:
    - `find_collections`: Use `load_collection` and manual data discovery through the clients. [API#52](https://github.com/Open-EO/openeo-api/issues/52)
    - `filter`: Use `filter_labels` instead.
    - `output`: Use `debug` instead.
    - `property` [#84](https://github.com/Open-EO/openeo-processes/issues/84)
    - `reduce`: Use `reduce_dimension` or `drop_dimension` instead.

### Fixed
- Several clarifications in written texts. [#86](https://github.com/Open-EO/openeo-processes/issues/86)
- `between` may return a `null` value.
- `filter_bbox`, `load_collection`: The schema for the property `crs` in the parameters `extent`/`spatial_extent` contained invalid JSON Schema.
- `merge_cubes`: Clarified merging behavior with several examples.

## [0.4.2] - 2019-06-11

### Added
- Added examples.

### Fixed
- Fixed outdated process examples.

## [0.4.1] - 2019-05-29

### Added
- Added `band-name` format to `load_collection` and `filter_bands` properties.

### Fixed
- `product`: Added exceptions and examples
- Clarified error handling related to dimension parameters.

## [0.4.0] - 2019-03-07
First version which is separated from the openEO API. Complete rework of all processes.

## Legacy versions
Older versions of the processes were released as part of the openEO API, see the corresponding changelog for more information.
