# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased / Draft

### Added
- New processes in proposal state
    - `array_append`
    - `array_concat`
    - `array_create`
    - `array_find_label`
    - `array_modify`
    - `date_shift`
    - `is_infinite`
    - `nan`
    - `reduce_spatial`
- Added return value details (property `returns`) for the schemas with the subtype `process-graph`. [API#350](https://github.com/Open-EO/openeo-api/issues/350)
- `apply_neighborhood`: Clarify behavior for data cubes returned by the child processes and for that add the exception `DataCubePropertiesImmutable`.

### Changed
- Added `proposals` folder for experimental processes. Experimental processes are not covered by the CHANGELOG and MAY include breaking changes! [#196](https://github.com/Open-EO/openeo-processes/issues/196), [#207](https://github.com/Open-EO/openeo-processes/issues/207), [PSC#8](https://github.com/Open-EO/PSC/issues/8)
    - Moved the experimental processes `aggregate_spatial_binary`, `reduce_dimension_binary` and `run_udf_externally` to the proposals.
    - Moved the rarely used and implemented processes `cummax`, `cummin`, `cumproduct`, `cumsum`, `debug`, `filter_labels`, `load_result`, `load_uploaded_files`, `resample_cube_temporal` to the proposals.
- Exception messages have been aligned always use ` instead of '. Tooling could render it with CommonMark.
- `load_collection`  and `mask_polygon`: Also support multi polygons instead of just polygons. [#237](https://github.com/Open-EO/openeo-processes/issues/237)
- `run_udf` and `run_udf_externally`: Specify specific (extensible) protocols for UDF URIs.

### Deprecated
- `GeometryCollection`s are discouraged in all relevant processes.

### Fixed
- Clarify that the user workspace is server-side. [#225](https://github.com/Open-EO/openeo-processes/issues/225)
- Clarify that the `condition` parameter for `array_filter` works also on indices and labels.
- Clarify contradicting statements in `filter_temporal` for the default value of the `dimension` parameter. By default *all* temporal dimensions are affected by the process. [#203](https://github.com/Open-EO/openeo-processes/issues/203)
- Clarify how the parameters passed to the overlap resolver correspond to the data cubes. [#184](https://github.com/Open-EO/openeo-processes/issues/184)
- Improve and clarify specifications for `is_nan`, `is_nodata`, `is_valid`. [#189](https://github.com/Open-EO/openeo-processes/issues/189)
- Improve and clarify specifications for `all` and `any`. [#189](https://github.com/Open-EO/openeo-processes/issues/199)
- `array_element`: Clarify that `ArrayNotLabeled` exception is thrown when parameter `label` is specified and the given array is not labeled.
- `array_apply`, `array_element`, `array_filter`: Added the `minimum: 0` constraint to all schemas describing zero-based indices (parameter `index`).
- `array_labels`: Clarified the accepted data type for array elements passed to the parameter `data`.
- `merge_cubes`: Clarified the dimension label order after the merge. [#212](https://github.com/Open-EO/openeo-processes/issues/212)
- Fixed typos, grammar issues and other spelling-related issues in many of the processes.
- Fixed the examples `array_contains_nodata` and `array_find_nodata`.
- Fixed links to openEO glossary and added links to data cube introduction. [#216](https://github.com/Open-EO/openeo-processes/issues/216)
- Clarified disallowed characters in subtype `file-path`.
- Clarified that UDF source code must contain a newline/line-break (affects `run_udf`).
- `aggregate_spatial`, `aggregate_spatial_binary`: Clarified that Features, Geometries and GeometryCollections are a single entity in computations. Only FeatureCollections are multiple entities. [#252](https://github.com/Open-EO/openeo-processes/issues/252)
- `aggregate_spatial`: Clarified that the values have no predefined order and reducers such as `first`, `last` and `median` return unpredictable results. [#260](https://github.com/Open-EO/openeo-processes/issues/260)
- `load_collection`, parameter `spatial_extent`: Clarified that all pixels that are inside the bounding box of the given polygons but do not intersect with any polygon have to be set to no-data (`null`). [#256](https://github.com/Open-EO/openeo-processes/issues/256)
- `load_collection`: Clarified that the parameters are recommended to be used in favor of `filter_*` processes.

## 1.0.0 - 2020-07-31

### Added
- `subtype-schemas.json`: A list of predefined subtypes is available as JSON Schema; Moved over from openeo-api.
- Processes:
    - `aggregate_temporal_period`
    - `anomaly`
    - `apply_neighborhood`
    - `climatological_normal`
    - `constant`
- Process graphs added to:
    - `mean`
    - `median`
- `apply_kernel`: Added parameters `border` and `replace_invalid` [#170](https://github.com/Open-EO/openeo-processes/issues/170)
- Folder with examples (`examples/`). [#136](https://github.com/Open-EO/openeo-processes/issues/136)

### Changed
- `any` and `all`: Renamed parameter `values` to `data`. [#147](https://github.com/Open-EO/openeo-processes/issues/147)
- `load_collection`: Parameter `properties` has subtype `metdata-filter`.
- Examples adapted to latest API version for `aggregate_temporal`, `array_contains`, `array_find`, `filter_labels`, `load_collection` and `rename_labels`. [#136](https://github.com/Open-EO/openeo-processes/issues/136), [API#285](https://github.com/Open-EO/openeo-api/issues/285)
- Some processes were assigned to different categories.

### Removed
- Process graph examples from `arccos`, `arcsin`, `arctan`, `arsinh`, `artanh`, `e`, `ln` and `pi`. [API#285](https://github.com/Open-EO/openeo-api/issues/285)

### Fixed
- `apply_kernel`:
    - Clarify orientation of the 2D kernel array- [#165](https://github.com/Open-EO/openeo-processes/issues/165)
    - Clarify no-data handling. [#170](https://github.com/Open-EO/openeo-processes/issues/170)
- `load_collection`: Removed outdated `require` property from `value` callback parameter in process parameter `properties`.
- `filter_bbox`, `load_collection`, `resample_spatial`: Fixed invalid EPSG code examples.
- `aggregate_temporal`: Fixed outdated message for exception `TooManyDimensions`.
- `clip`: Fixed examples.
- `linear_scale_range`: Clarify that the process implicitly clips the values. [#159](https://github.com/Open-EO/openeo-processes/issues/159)
- `mean`: Clarify behavior for arrays with `null`-values only.
- `mod`: Clarified behavior. [#168](https://github.com/Open-EO/openeo-processes/issues/168)
- `resample_*`: Clarified behavior.
- `first`, `last`, `max`, `mean`, `median`, `min`, `sd`, `variance`: Clarify behavior for arrays with `null`-values only.
- Clarified (and fixed if necessary) for all processes in the "cubes" category the descriptions for the returned data cube. [#149](https://github.com/Open-EO/openeo-processes/issues/149)

## 1.0.0-rc.1 - 2020-01-31

### Added
- Processes:
    - `add`
    - `aggregate_spatial`
    - `aggregate_spatial_binary`
    - `all`
    - `any`
    - `array_apply`
    - `array_contains`
    - `array_filter`
    - `array_find`
    - `array_labels`
    - `dimension_labels`
    - `drop_dimension`
    - `filter_labels`
    - `filter_spatial`
    - `load_uploaded_files`
    - `mask_polygon`
    - `reduce_dimension`
    - `reduce_dimension_binary`
    - `rename_labels`
- Support for labeled arrays. [API#245](https://github.com/Open-EO/openeo-api/issues/245)
- Process graphs for processes that can be implemented using other pre-defined processes. [#137](https://github.com/Open-EO/openeo-processes/issues/137)
- `context` parameters to all processes which support passing process graphs (callbacks) as parameters. [#25](https://github.com/Open-EO/openeo-processes/issues/25)
- Added further examples.

### Changed
- The JSON Schema keyword `format` has been replaced with the custom keyword `subtype`.
- Schema format/subtype `callback` has been renamed to `process-graph`.
- Default values are now specified on the parameter-level, not in the JSON schemas.
- Parameters are now required by default.
- Parameters are defined as array. `parameter_order` is therefore removed and the name is part of the parameter object. [API#239](https://github.com/Open-EO/openeo-api/issues/239)
- Callback parameters have a new, more advanced schema, allowing to define more aspects of the callback parameters. [API#239](https://github.com/Open-EO/openeo-api/issues/239)
- Processes supporting multiple data types in parameters or return values with `anyOf` are now listing the data types directly as array. `anyOf` is discouraged.
- Comparison processes `eq`, `gt`, `gte`, `lt`, `lte`, `neq` and `between` accept all data types as input for the operands.
- `add_dimension`: Parameter `value` renamed to `label`.
- `aggregate_polygon`, `aggregate_temporal`, `apply_dimension`, `array_element` and `resample_cube_temporal`: Support labeled arrays. [API#245](https://github.com/Open-EO/openeo-api/issues/245)
- `aggregate_polygon`: The data cube implicitly gets restricted to the bounds of the polygons as if `filter_polygon` would have been used beforehand. [#101](https://github.com/Open-EO/openeo-processes/issues/101)
- `aggregate_temporal`: Parameter `labels` is optional. [#19](https://github.com/Open-EO/openeo-processes/issues/19)
- `apply_dimension`: Replaced with a completely new definition. [#73](https://github.com/Open-EO/openeo-processes/issues/73)
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
- `trim`: Renamed to `trim_cube`.

### Deprecated
- `filter_bbox`, `load_collection`, `resample_spatial`: PROJ definitions are deprecated in favor of EPSG codes and WKT2. [#58](https://github.com/Open-EO/openeo-processes/issues/58)

### Removed
- The following processes don't support `ignore_nodata` any longer: `and`, `divide`, `multiply`, `or`, `subtract`, `xor`. [#85](https://github.com/Open-EO/openeo-processes/issues/85)
- The following processes don't support `binary` any longer: `aggregate_temporal`, `merge_cubes`, `resample_cube_temporal`. [#94](https://github.com/Open-EO/openeo-processes/issues/94)
- Support for vector data cubes, except for the processes `aggregate_poylgon` and `save_result`. [#68](https://github.com/Open-EO/openeo-processes/issues/68)
- `filter_temporal` and `load_collection`: Temporal extents don't support time-only intervals any longer. [#88](https://github.com/Open-EO/openeo-processes/issues/88)
- `mask`: The mask parameter doesn't accept vectors (polygons) any longer. Use process `mask_polygon` instead. [#110](https://github.com/Open-EO/openeo-processes/issues/110)
- Processes:
    - `aggregate_polygon`. Use `aggregate_spatial` or `aggregate_spatial_binary` instead. [#62](https://github.com/Open-EO/openeo-processes/issues/62)
    - `find_collections`: Use `load_collection` and manual data discovery through the clients. [API#52](https://github.com/Open-EO/openeo-api/issues/52)
    - `filter`: Use `filter_labels` instead.
    - `filter_polygon`. Use `filter_spatial` instead. [#37](https://github.com/Open-EO/openeo-processes/issues/37)
    - `output`: Use `debug` instead.
    - `property` [#84](https://github.com/Open-EO/openeo-processes/issues/84)
    - `reduce`: Use `reduce_dimension` or `drop_dimension` instead.
    - `run_process_graph`: Use user-defined processes directly in the process graph instead.

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
