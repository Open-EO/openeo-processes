# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- New processes:
    - `add`
    - `all`
    - `any`
    - `array_find`
    - `drop_dimension`
    - `load_uploaded_files`
    - `rename_labels`
- Added further examples

### Changed
- The JSON Schema keyword `format` has been replaced with the custom keyword `subtype`.
- Schema format/subtype `callback` has been renamed to `process-graph`.
- Default values are now specified on the parameter-level, not in the JSON schemas.
- Processes supporting multiple data types in parameters or return values with `anyOf` are now listing the data types directly as array. `anyOf` is discouraged.
- `add_dimension`: Parameter `value` renamed to `label`.
- `clip`: Works on a single value instead on arrays (replaced parameter `data` with `x`). [#75](https://github.com/Open-EO/openeo-processes/issues/75)
- `debug`: Replaced with a completely new definition. [#82](https://github.com/Open-EO/openeo-processes/issues/71), [API#100](https://github.com/Open-EO/openeo-api/issues/100), [API#214](https://github.com/Open-EO/openeo-api/issues/214)
- `filter_bands`: Merged parameters `bands` and `common_names`. [#77]( https://github.com/Open-EO/openeo-processes/issues/77)
- `load_collection`: Parameter `bands` accepts common band names. [#77]( https://github.com/Open-EO/openeo-processes/issues/77)
- `ndvi` and `normalized_difference`: Rewrite of the processes with a completely new behavior. [#60](https://github.com/Open-EO/openeo-processes/issues/60)
- `resample_spatial`: Default value of parameter `align` changed from `lower-left` to `upper-left`. [#61](https://github.com/Open-EO/openeo-processes/issues/61)
- The following operations work on two values instead on a sequence of values: `and`, `divide`, `multiply`, `or`, `subtract`, `xor`. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- `product` works as before, but is not an alias of `multiply` any longer. [#85](https://github.com/Open-EO/openeo-processes/issues/85)

### Deprecated
- `filter_bbox`, `load_collection`, `resample_spatial`: PROJ definitions are deprecated in favor of EPSG codes, WKT2 and PROJJSON. [#58](https://github.com/Open-EO/openeo-processes/issues/58)

### Removed
- `reduce`: The `null` (no-operation) reducer has been removed. Use the process `drop_dimension` instead. [#57](https://github.com/Open-EO/openeo-processes/issues/57)
- The following operations don't support `ignore_nodata` any longer: `and`, `divide`, `multiply`, `or`, `subtract`, `xor`. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- Removed processes:
    - `find_collections`: Use `load_collection` and manual data discovery through the clients. [API#52](https://github.com/Open-EO/openeo-api/issues/52)
    - `output`: Use `debug` instead.

### Fixed
- Several clarifications in written texts. [#86](https://github.com/Open-EO/openeo-processes/issues/86)
- `filter_bbox`, `load_collection`: The schema for the property `crs` in the parameters `extent`/`spatial_extent` contained invalid JSON Schema.

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