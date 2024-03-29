# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased / Draft

## [2.0.0-rc.1] - 2023-05-25

### Added

- New processes in proposal state:
    - `date_between`
    - `date_difference`
    - `filter_vector`
    - `flatten_dimensions`
    - `load_geojson`
    - `load_url`
    - `unflatten_dimension`
    - `vector_buffer`
    - `vector_reproject`
    - `vector_to_random_points`
    - `vector_to_regular_points`
- `add_dimension`: Added new dimension type `geometry`. [#68](https://github.com/Open-EO/openeo-processes/issues/68)

### Changed

- Moved from proposals to stable processes:
    - `array_append`
    - `array_concat`
    - `array_create`
    - `array_interpolate_linear`
    - `resample_cube_temporal`
- Added better support for labeled arrays. Labels are not discarded in all cases anymore. Affected processes:
    - `array_append`
    - `array_concat`
    - `array_modify`
- `array_modify`: Change the default value for `length` from `1` to `0`. [#312](https://github.com/Open-EO/openeo-processes/issues/312)
- Renamed `text_merge` to `text_concat` for better alignment with `array_concat` and existing implementations.
- `apply_neighborhood`:
    - Allow `null` as default value for units.
    - Input and Output for the `process` can either be data cubes or arrays (if one-dimensional). [#387](https://github.com/Open-EO/openeo-processes/issues/387)
- `run_udf`: Allow all data types instead of just objects in the `context` parameter. [#376](https://github.com/Open-EO/openeo-processes/issues/376)
- `load_collection` and `load_result`/`load_stac`:
    - Require at least one band if not set to `null`. [#372](https://github.com/Open-EO/openeo-processes/issues/372)
    - Added a `NoDataAvailable` exception
- `aggregate_temporal`, `filter_temporal`, `load_collection` and `load_result`/`load_stac`:
    - The temporal intervals must always be non-empty, i.e. the second instance in time must be after the first instance in time. [#331](https://github.com/Open-EO/openeo-processes/issues/331)
    - `24` as the hour is not allowed anymore. [#331](https://github.com/Open-EO/openeo-processes/issues/331)
- `inspect`: The parameter `message` has been moved to be the second argument. [#369](https://github.com/Open-EO/openeo-processes/issues/369)
- `mask` and `merge_cubes`: The spatial dimensions `x` and `y` can now be resampled implicitly instead of throwing an error. [#402](https://github.com/Open-EO/openeo-processes/issues/402)
- `save_result`: Added a more concrete `DataCubeEmpty` exception.
- New definition for `aggregate_spatial`:
    - Allows more than 3 input dimensions [#126](https://github.com/Open-EO/openeo-processes/issues/126)
    - Allow to not export statistics by changing the parameter `target_dimension` [#366](https://github.com/Open-EO/openeo-processes/issues/366)
    - Clarify how the resulting vector data cube looks like  [#356](https://github.com/Open-EO/openeo-processes/issues/356)
- Renamed `create_raster_cube` to `create_data_cube`. [#68](https://github.com/Open-EO/openeo-processes/issues/68)
- Updated the processes based on the subtypes `raster-cube` or `vector-cube` to work with the subtype `datacube` instead. [#68](https://github.com/Open-EO/openeo-processes/issues/68)
- `sort` and `order`: The ordering of ties is not defined anymore. [#409](https://github.com/Open-EO/openeo-processes/issues/409)
- `quantiles`: Parameter `probabilities` provided as array must be in ascending order. [#297](https://github.com/Open-EO/openeo-processes/pull/297)
- `fit_curve` and `predict_curve`: Heavily modified specifications. `fit_curve` works on arrays instead of data cubes, `predict_curve` doesn't support gap filling anymore, clarify no-data handling, ... [#425](https://github.com/Open-EO/openeo-processes/issues/425)
- `climatological_normal`: The `climatology_period` parameter accepts an array of integers instead of strings. [#331](https://github.com/Open-EO/openeo-processes/issues/331)

### Deprecated

- `aggregate_spatial`, `filter_spatial`, `load_collection`, `mask_polygon`: GeoJSON input is deprecated in favor of `load_geojson`. [#346](https://github.com/Open-EO/openeo-processes/issues/346)

### Removed

- The `examples` folder has been migrated to the [openEO Community Examples](https://github.com/Open-EO/openeo-community-examples/tree/main/processes) repository.
- `between`: Support for temporal comparison. Use `date_between` instead. [#331](https://github.com/Open-EO/openeo-processes/issues/331)
- Deprecated `GeometryCollections` are not supported any longer. [#389](https://github.com/Open-EO/openeo-processes/issues/389)
- Deprecated PROJ definitions for the CRS are not supported any longer.
- `load_result`:
    - Renamed to `load_stac`
    - The subtype `job-id` was removed in favor of providing a URL. [#322](https://github.com/Open-EO/openeo-processes/issues/322), [#377](https://github.com/Open-EO/openeo-processes/issues/377), [#384](https://github.com/Open-EO/openeo-processes/issues/384)
    - GeoJSON input is not supported any longer. Use `load_geojson` instead. [#346](https://github.com/Open-EO/openeo-processes/issues/346)
- The comparison processes `eq`, `neq`, `lt`, `lte`, `gt`, `gte` and `array_contains`:
    - Removed support for temporal comparison. Instead explicitly use `date_difference`.
    - Removed support for the input data types array and object. [#208](https://github.com/Open-EO/openeo-processes/issues/208)
- `sort` and `order`: Removed support for time-only values. [#331](https://github.com/Open-EO/openeo-processes/issues/331)

### Fixed

- `aggregate_spatial`:
    - Clarified that feature properties are preserved for vector data cubes and all GeoJSON Features. [#270](https://github.com/Open-EO/openeo-processes/issues/270)
    - Clarified that a `TargetDimensionExists` exception is thrown if the target dimension exists.
- `apply` and `array_apply`: Fixed broken references to the `absolute` process
- `apply_dimension`: Clarify the behavior for when a dimension gets 'dropped'.  [#357](https://github.com/Open-EO/openeo-processes/issues/357)
- `apply_neighborhood`:
    - Parameter `overlap` was optional but had no default value and no schema for the default value defined.
    - Clarified that the overlap must be included in the returned data cube but value changes are ignored. [#386](https://github.com/Open-EO/openeo-processes/issues/386)
    - Removed a conflicting statement that dimension labels can be changed. [#385](https://github.com/Open-EO/openeo-processes/issues/385)
- `array_contains` and `array_find`: Clarify that giving `null` as `value` always returns `false` or `null` respectively, also fixed the incorrect examples. [#348](https://github.com/Open-EO/openeo-processes/issues/348)
- `array_interpolate_linear`: Return value was incorrectly specified as `number` or `null`. It must return an array instead. [#333](https://github.com/Open-EO/openeo-processes/issues/333)
- `is_nan`: Fixed a wrong description of the return value and simplified/clarified the process descriptions overall. [#360](https://github.com/Open-EO/openeo-processes/issues/360)
- `is_nodata`: Clarified that `NaN` can be considered as a no-data value only if it is explicitly specified as no-data value. [#361](https://github.com/Open-EO/openeo-processes/issues/361)
- `merge_cubes`: Clarified descriptions to better describe when a merge is possible. [#379](https://github.com/Open-EO/openeo-processes/issues/379)
- `rename_labels`: Clarified that the `LabelsNotEnumerated` exception is thrown if `source` is empty instead of if `target` is empty. [#321](https://github.com/Open-EO/openeo-processes/issues/321)
- `round`: Clarify that the rounding for ties applies not only for integers. [#326](https://github.com/Open-EO/openeo-processes/issues/326)
- `save_result`: Clarified that the process always returns `true` (and otherwise throws). [#334](https://github.com/Open-EO/openeo-processes/issues/334)
- Handling of empty geometries is clarified throughout the processes. [#404](https://github.com/Open-EO/openeo-processes/issues/404)

## [1.2.0] - 2021-12-13

### Added

- New processes in proposal state
    - `apply_polygon`
    - `fit_curve`
    - `predict_curve`
- `ard_normalized_radar_backscatter` and `sar_backscatter`: Added `options` parameter
- `array_find`: Added parameter `reverse`. [#269](https://github.com/Open-EO/openeo-processes/issues/269)
- `load_result`:
    - Added ability to load by (signed) URL (supported since openEO API v1.1.0).
    - Added parameters `spatial_extent`, `temporal_extent` and `bands`. [#220](https://github.com/Open-EO/openeo-processes/issues/220)
- `run_udf`: Exception `InvalidRuntime` added. [#273](https://github.com/Open-EO/openeo-processes/issues/273)
- A new category "math > statistics" has been added [#277](https://github.com/Open-EO/openeo-processes/issues/277)

### Changed

- `array_labels`: Allow normal arrays to be passed for which the process returns the indices. [#243](https://github.com/Open-EO/openeo-processes/issues/243)
- `debug`:
    - Renamed to `inspect`.
    - The log level `error` does not need to stop execution.
    - Added proposals for logging several data types to the implementation guide.
- `quantiles`: The parameter `probabilities` also accepts an integer value to compute q-quantiles. [#293](https://github.com/Open-EO/openeo-processes/issues/293)

### Deprecated

- `quantiles`: The parameter `q` has been deprecated in favor of the extended parameter `probabilities`. [#293](https://github.com/Open-EO/openeo-processes/issues/293)

### Removed

- Removed the explicit schema for `raster-cube` in the `data` parameters and return values of `run_udf` and `run_udf_externally`. It's still possible to pass raster-cubes via the "any" data type, but it's discouraged due to scalability issues. [#285](https://github.com/Open-EO/openeo-processes/issues/285)

### Fixed

- `aggregate_temporal_period`: Clarified which dimension labels are present in the returned data cube. [#274](https://github.com/Open-EO/openeo-processes/issues/274)
- `ard_surface_reflectance`: The process has been categorized as "optical" instead of "sar".
- `array_modify`: Clarified behavior.
- `save_result`: Clarify how the process works in the different contexts it is used in (e.g. synchronous processing, secondary web service). [#288](https://github.com/Open-EO/openeo-processes/issues/288)
- `quantiles`:
  - The default algorithm for sample quantiles has been clarified (type 7). [#296](https://github.com/Open-EO/openeo-processes/issues/296)
  - Improved documentation in general. [#278](https://github.com/Open-EO/openeo-processes/issues/278)

## [1.1.0] - 2021-06-29

### Added

- New processes in proposal state
    - `ard_normalized_radar_backscatter`
    - `ard_surface_relectance`
    - `array_append`
    - `array_concat`
    - `array_create`
    - `array_create_labeled`
    - `array_find_label`
    - `array_interpolate_linear` [#173](https://github.com/Open-EO/openeo-processes/issues/173)
    - `array_modify`
    - `atmospheric_correction`
    - `cloud_detection`
    - `date_shift`
    - `is_infinite`
    - `nan`
    - `reduce_spatial`
- Added return value details (property `returns`) for the schemas with the subtype `process-graph`. [API#350](https://github.com/Open-EO/openeo-api/issues/350)
- `apply_neighborhood`: Clarify behavior for data cubes returned by the child processes and for that add the exception `DataCubePropertiesImmutable`.
- Added a guide for implementors that describes numerours implementation details for processes that could not be covered in the specifications itself, for example a recommended implementation for the `if` process. [#246](https://github.com/Open-EO/openeo-processes/issues/246)

### Changed
- Added `proposals` folder for experimental processes. Experimental processes are not covered by the CHANGELOG and MAY include breaking changes! [#196](https://github.com/Open-EO/openeo-processes/issues/196), [#207](https://github.com/Open-EO/openeo-processes/issues/207), [PSC#8](https://github.com/Open-EO/PSC/issues/8)
    - Moved the experimental process `run_udf_externally` to the proposals.
    - Moved the rarely used and implemented processes `cummax`, `cummin`, `cumproduct`, `cumsum`, `debug`, `filter_labels`, `load_result`, `load_uploaded_files`, `resample_cube_temporal` to the proposals.
- Exception messages have been aligned always use ` instead of '. Tooling could render it with CommonMark.
- `load_collection` and `mask_polygon`: Also support multi polygons instead of just polygons. [#237](https://github.com/Open-EO/openeo-processes/issues/237)
- `run_udf` and `run_udf_externally`: Specify specific (extensible) protocols for UDF URIs.
- `resample_cube_spatial` and `resample_spatial`: Aligned with GDAL and added `rms` and `sum` options to methods. Also added better descriptions.
- `resample_cube_temporal`: Process has been simplified and only offers the nearest neighbor method now. The `process` parameter has been removed, the `dimension` parameter was made less restrictive, the parameter `valid_within` was added. [#194](https://github.com/Open-EO/openeo-processes/issues/194)

### Deprecated
- `GeometryCollection`s are discouraged in all relevant processes.

### Removed

- Removed the experimental processes `aggregate_spatial_binary` and `reduce_dimension_binary`. [#258](https://github.com/Open-EO/openeo-processes/issues/258)

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
- `merge_cubes`: Clarified the fourth example. [#266](https://github.com/Open-EO/openeo-processes/issues/266)
- Fixed typos, grammar issues and other spelling-related issues in many of the processes.
- Fixed the examples `array_contains_nodata` and `array_find_nodata`.
- Fixed links to openEO glossary and added links to data cube introduction. [#216](https://github.com/Open-EO/openeo-processes/issues/216)
- Fixed description of `apply_dimension` with regards to reference systems. Made description easier to understand, too. [#234](https://github.com/Open-EO/openeo-processes/issues/234)
- Clarified disallowed characters in subtype `file-path`.
- Clarified that UDF source code must contain a newline/line-break (affects `run_udf`).
- `aggregate_spatial`, `aggregate_spatial_binary`: Clarified that Features, Geometries and GeometryCollections are a single entity in computations. Only FeatureCollections are multiple entities. [#252](https://github.com/Open-EO/openeo-processes/issues/252)
- `aggregate_spatial`: Clarified that the values have no predefined order and reducers such as `first` and `last` return unpredictable results. [#260](https://github.com/Open-EO/openeo-processes/issues/260)
- `load_collection`, parameter `spatial_extent`: Clarified that all pixels that are inside the bounding box of the given polygons but do not intersect with any polygon have to be set to no-data (`null`). [#256](https://github.com/Open-EO/openeo-processes/issues/256)
- `load_collection`: Clarified that the parameters are recommended to be used in favor of `filter_*` processes.
- `aggregate_temporal` and `aggregate_temporal_period`: Clarified that reducers are also executed for intervals/periods with no data. [#263](https://github.com/Open-EO/openeo-processes/issues/263)
- `dimension_labels`: Clarified that the process fails with a `DimensionNotAvailable` exception, if a dimension with the specified name does not exist.

## [1.0.0] - 2020-07-31

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
- `load_collection`: Parameter `properties` has subtype `metadata-filter`.
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

## [1.0.0-rc.1] - 2020-01-31

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


[Unreleased]: <https://github.com/Open-EO/openeo-processes/compare/2.0.0-rc.1...HEAD>
[2.0.0-rc.1]: <https://github.com/Open-EO/openeo-processes/compare/1.2.0...2.0.0-rc.1>
[1.2.0]: <https://github.com/Open-EO/openeo-processes/compare/1.1.0...1.2.0>
[1.1.0]: <https://github.com/Open-EO/openeo-processes/compare/1.0.0...1.1.0>
[1.0.0]: <https://github.com/Open-EO/openeo-processes/compare/1.0.0-rc.1...1.0.0>
[1.0.0-rc.1]: <https://github.com/Open-EO/openeo-processes/compare/0.4.2...1.0.0-rc.1>
[0.4.2]: <https://github.com/Open-EO/openeo-processes/compare/0.4.1...0.4.2>
[0.4.1]: <https://github.com/Open-EO/openeo-processes/compare/0.4.0...0.4.1>
[0.4.0]: <https://github.com/Open-EO/openeo-processes/tree/0.4.0>

