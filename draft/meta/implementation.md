# Implementation Guide for back-ends

This file is meant to provide some additional implementation details for back-ends.

## Enums for processing methods

There are numerours processes that provide a predefined set of processing methods.
For example:
- `ard_surface_reflectance`: `atmospheric_correction_method` and `cloud_detection_method`
- `athmospheric_correction`: `method`
- `cloud_detection`: `method`
- `resample_cube_spatial`: `method`
- `resample_spatial`: `method`

Those methods are meant to provide a common naming for well-known processing methods.
Back-ends should check which methods they can implement and remove all the methods
they can't implement. Similarly, you can add new methods. We'd likely ask you to
open [a new issue](https://github.com/Open-EO/openeo-processes/issues) and provide
us your additions so that we can align implementations and eventually update the
process specifications with all methods out there. Thanks in advance!

Also make sure to update the textual descriptions accordingly.

This applies similarly to other enums specied in parameter schemas, e.g. the
`period` parameter in `aggregate_temporal_period`.

## Proprietary options in `ard_surface_reflectance`, `athmospheric_correction` and `cloud_detection`

The processes mentioned above have all at least one parameter for proprietary
options that can be passed to the corresponsing `methods`:
- `ard_surface_reflectance`: `atmospheric_correction_options` and `cloud_detection_options`
- `athmospheric_correction`: `options`
- `cloud_detection`: `options`

By default, the parameters don't allow any value except an empty opject.
Back-ends have to either remove the parameter or define schema to give user 
details about the supported parameters per supported method.

For example, if you support the methods `iCor` and `FORCE` in `atmospheric_correction`,
you may define something like the following for the parameter:

```json
{
	"description": "Proprietary options for the atmospheric correction method.",
	"name": "options",
	"optional": true,
	"default": {},
	"schema": [
		{
			"title": "FORCE options",
			"type": "object",
			"properties": {
				"force_option1": {
					"type": "number",
					"description": "Description for option 1"
				},
				"force_option2": {
					"type": "boolean",
					"description": "Description for option 1"
				}
			}
		},
		{
			"title": "iCor options",
			"type": "object",
			"properties": {
				"icor_option1": {
					"type": "string",
					"description": "Description for option 1"
				}
			}
		}

	]
}
```