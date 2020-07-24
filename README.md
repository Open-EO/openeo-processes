# openEO Processes

openEO develops interoperable processes for big Earth observation cloud processing. This repository contains the process specifications. Each process is specified in a separate JSON file, which conforms to the corresponding API process schema.

* **[Latest Version of the Specification](https://processes.openeo.org)**

## Versions / Branches

The [master branch](https://github.com/Open-EO/openeo-processes/tree/master) is the 'stable' version of the openEO processes specification. The latest release is version **1.0.0**. The [draft branch](https://github.com/Open-EO/openeo-processes/tree/draft) is where active development takes place.

| Version / Branch                                             | Status                    | openEO API versions |
| ------------------------------------------------------------ | ------------------------- | ------------------- |
| [unreleased / draft](https://processes.openeo.org/draft)     | in development            | 1.x.x               |
| [**1.0.0** / master](https://processes.openeo.org/1.0.0/)    | **latest stable version** | 1.x.x               |
| [1.0.0 RC1](https://processes.openeo.org/1.0.0-rc.1/)        | legacy version            | 1.x.x               |
| [0.4.2](https://processes.openeo.org/0.4.2/)                 | legacy version            | 0.4.x               |
| [0.4.1](https://processes.openeo.org/0.4.1/)                 | legacy version            | 0.4.x               |
| [0.4.0](https://processes.openeo.org/0.4.0/)                 | legacy version            | 0.4.x               |

**Note:** [https://processes.openeo.org](https://processes.openeo.org) always points to the latest released version.

See also the [changelog](CHANGELOG.md) for the changes between versions and the [milestones](https://github.com/Open-EO/openeo-processes/milestones) for a rough roadmap based on GitHub issues.

## Repository

This repository contains a set of files formally describing the openEO Processes:

* The [`*.json`](examples/) files provide the process specifications as defined by the openEO API.
* [subtype-schemas.json](meta/subtype-schemas.json) in the `meta` folder defines common data types (`subtype`s) for JSON Schema used in openEO processes.
* The [`examples`](examples/) folder contains some useful examples that the processes link to. All of these are non-binding additions.
* The [`tests`](tests/) folder can be used to test the process specification for validity and and consistent "style". It also allows to render the processes in a web browser.
