# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Added examples.

### Changed
- `debug`: 

### Deprecated
- `filter_bbox`, `load_collection`, `resample_spatial`: PROJ definitions are deprecated in favor of EPSG codes, WKT2 and PROJJSON. (#58)[https://github.com/Open-EO/openeo-processes/issues/58]

### Removed
- `output`

### Fixed
- `ndvi`: Default value of parameter `name` is now `ndvi` instead of `normalized_difference`.

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