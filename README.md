# openEO Processes

openEO develops interoperable processes for big Earth observation cloud processing. This repository contains the process specifications. Each process is specified in a separate JSON file, which conforms to the corresponding API process schema.

* **[Latest Version of the Specification](https://processes.openeo.org)**

## Versions / Branches

The [master branch](https://github.com/Open-EO/openeo-processes/tree/master) is the 'stable' version of the openEO processes specification. An exception is the [`proposals`](proposals/) folder, which provides experimental new processes currently under discussion. They may still change, but everyone is encouraged to implement them and give feedback.

The latest release is version **1.2.0**. The [draft branch](https://github.com/Open-EO/openeo-processes/tree/draft) is where active development takes place. PRs should be made against the draft branch.

| Version / Branch                                             | Status                    | openEO API versions |
| ------------------------------------------------------------ | ------------------------- | ------------------- |
| [unreleased / draft](https://processes.openeo.org/draft)     | in development            | 1.x.x               |
| [**1.2.0** / master](https://processes.openeo.org/1.2.0/)    | **latest stable version** | 1.x.x               |
| [1.1.0](https://processes.openeo.org/1.1.0/)                 | legacy version            | 1.x.x               |
| [1.0.0](https://processes.openeo.org/1.0.0/)                 | legacy version            | 1.x.x               |
| [1.0.0 RC1](https://processes.openeo.org/1.0.0-rc.1/)        | legacy version            | 1.x.x               |
| [0.4.2](https://processes.openeo.org/0.4.2/)                 | legacy version            | 0.4.x               |
| [0.4.1](https://processes.openeo.org/0.4.1/)                 | legacy version            | 0.4.x               |
| [0.4.0](https://processes.openeo.org/0.4.0/)                 | legacy version            | 0.4.x               |

**Note:** [https://processes.openeo.org](https://processes.openeo.org) always points to the latest released version.

See also the [changelog](CHANGELOG.md) for the changes between versions and the [milestones](https://github.com/Open-EO/openeo-processes/milestones) for a rough roadmap based on GitHub issues.

## Repository

This repository contains a set of files formally describing the openEO Processes:

* The `*.json` files provide stable process specifications as defined by openEO. Stable processes need at least two implementations and a use-case example added to the [`examples`](examples/) folder *or* consensus from the openEO PSC.
* The `*.json` files in the [`proposals`](proposals/) folder provide proposed new process specifications that are still experimental and subject to change, including breaking changes. Everyone is encouraged to base their work on the proposals and give feedback so that eventually the processes evolve into stable process specifications.
* [implementation.md](meta/implementation.md) in the `meta` folder provide some additional implementation details for back-ends. For back-end implementors, it's highly recommended to read them.
* [subtype-schemas.json](meta/subtype-schemas.json) in the `meta` folder defines common data types (`subtype`s) for JSON Schema used in openEO processes.
* The [`examples`](examples/) folder contains some useful examples that the processes link to. All of these are non-binding additions.
* The [`tests`](tests/) folder can be used to test the process specification for validity and consistent "style". It also allows rendering the processes in a web browser. Check the [tests documentation](tests/README.md) for details.

## Process

* All new processes must be added to the [`proposals`](proposals/) folder.
* Processes will only be moved from proposals to the stable process specifications once there are at least two implementations and an example process in the [`examples`](examples/) folder showing it in a use case. This doesn't require a PSC vote individually as it's not a breaking change, just an addition.
* The [`proposals`](proposals/) folder allows breaking changes without a PSC vote and without increasing the major version number (i.e. a breaking change in the proposals doesn't require us to make the next version number 2.0.0).
* The proposals are released as experimental processes with the other processes.
* Each release and all breaking changes in the stable process specifications must go through PSC vote.