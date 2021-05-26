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
					"description": "Description for option 1",
					"default": 0
				},
				"force_option2": {
					"type": "boolean",
					"description": "Description for option 1",
					"default": true
				}
			}
		},
		{
			"title": "iCor options",
			"type": "object",
			"properties": {
				"icor_option1": {
					"type": "string",
					"description": "Description for option 1",
					"default": "example"
				}
			}
		}

	]
}
```

Default values should be specified for each of the additional options given in `properties`.
The top-level default value should always be an empty object `{}`. The default values for the empty object will be provided by the schema.
None of the additional options should be required for better interoperability.

## Date and Time manipulation

Working with dates is a lot more complex than it seems to be at first sight. Issues arise especially with daylight saving times (DST), time zones, leap years and leap seconds.

The date/time functions in openEO don't have any effect on time zones right now as only dates and times in UTC (with potential numerical time zone modifier) are supported.

Month overflows, including the specific case of leap years, are implemented in a way that computations handle them gracefully. For example:

- If you add a month to January, 31th, it will result in February 29th (leap year) or 28th (other years). This means for invalid dates due to month overflow we round down (or "snap") to the last valid date of the month.
- If you add a month to February, 29th, it will result in March, 29. So the "snap" behavior doesn't work the other way round.

Leap seconds are basically ignored in manipulations as they don't follow a regular pattern. So leap seconds may be passed into the processes, but will never be returned by date manipulation processes in openEO. See the examples for the leap second `2016-12-31T23:59:60Z`:

- If you add a minute to `2016-12-31T23:59:60Z`, it will result in `2017-01-01T00:00:59Z`. This means for invalid times we round down (or "snap") to the next valid time.
- If you add a seconds to `2016-12-31T23:59:59Z`, it will result in `2017-01-01T00:00:00Z`.

### Language support

To make `date_shift` easier to implement, we have found some libraries that follow this specification and can be used for implementations:

- Java: [java.time](https://docs.oracle.com/javase/8/docs/api/java/time/package-summary.html)
- JavaScript: [Moment.js](https://momentjs.com/)
- Python: [dateutil](https://dateutil.readthedocs.io/en/stable/index.html)
- R: [lubridate](https://lubridate.tidyverse.org/) ([Cheatsheet](https://rawgit.com/rstudio/cheatsheets/master/lubridate.pdf))
