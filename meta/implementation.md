# Implementation Guide for back-ends

This file is meant to provide some additional implementation details for back-ends.

## Optimizations for conditions (e.g. `if`)

None of the openEO processes per se is "special" and thus all are treated the same way by default.
Nevertheless, there are some cases where a special treatment can make a huge difference.

### Branching behavior

The `if` process (and any process that is working on some kind of condition) are usually
special control structures and not normal functions. Those conditionals usually decide between
one outcome or the other. Evaluating them in a naive way would compute both outcomes and depending
on the condition use one outcome and discard the other.
This can and should be optimized by "lazily" only computing the outcome that is actually used.
This could have a huge impact on performance as some computation doesn't need to be executed at all.

openEO doesn't require special handling for the `if` process, but it is **strongly recommended**
that back-ends treat them special and only compute the outcome that is actually needed.
In the end, this is faster and cheaper for the user and thus users may prefer back-ends
that offer this optimization. Fortunately, both ways still lead to the same results
and comparability and reproducibility of the results is still given.

### Short-circuit evaluation

Similarly, back-ends **should** ["short-circuit"](https://en.wikipedia.org/wiki/Short-circuit_evaluation)
the evaluation of conditions that use processes processes such as `and`, `or` or `xor`,
which means that once a condition has reached an unambiguous result
the evaluation should stop and provide the result directly.
This is basically the same behavior that is also described in the processes `all` and `any`.

For example, the condition `A > 0 or B > 0` should only execute `B > 0` if `A > 0` is false as
otherwise the result is already unambiguous and will be `true` regardless of the rest of the 
condition.

Implementing this behavior does not have any negative side-effects so that 
comparability and reproducibility of the results is still given.

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

## `inspect` process

The `inspect` process (previously known as `debug`) is a process to allow users to debug their workflows.
Back-ends should not execute the processes for log levels that are not matching the mininum log level that can be specified through the API (>= v1.2.0) for each data processing request.

### Data Types

The process is only useful for users if a common behavior for data types passed into the `data` parameter has been agreed on across implementations. 

The following chapters include some proposals for common data (sub) types, but it is incomplete and will be extended in the future.
Also, for some data types a JSON encoding is missing, we'll add more details once agreed upon:
<https://github.com/Open-EO/openeo-processes/issues/299>

#### Scalars
For the data types boolean, numbers, strings and null it is recommended to log them as given.

#### Arrays

It is recommended to summarize arrays with as follows:
```js
{
	"data": [3,1,6,4,8], // Return a reasonable excerpt of the data, e.g. the first 5 or 10 elements
	"length": 10, // Return the length of the array, this is important to determine whether the data above is complete or an excerpt
	"min": 0, // optional: Return additional statstics if possible, ideally use the corresponsing openEO process names as keys
	"max": 10
}
```

#### Data Cubes

It is recommended to return them summarized in a structure compliant to the [STAC data cube extension](https://github.com/stac-extensions/datacube).
If reasonsable, it gives a valuable benefit for users to provide all dimension labels (e.g. individual timestamps for the temporal dimension) instead of values ranges.
The top-level object and/or each dimension can be enhanced with additional statstics if possible, ideally use the corresponsing openEO process names as keys.

```js
{
	"cube:dimensions": {
		"x": {
			"type": "spatial",
			"axis": "x",
			"extent": [8.253, 12.975],
			"reference_system": 4326
		},
		"y": {
			"type": "spatial",
			"axis": "y",
			"extent": [51.877,55.988],
			"reference_system": 4326
		},
		"t": {
			"type": "temporal",
			"values": [
				"2015-06-21T12:56:55Z",
				"2015-06-23T09:12:14Z",
				"2015-06-25T23:44:44Z",
				"2015-06-27T21:11:34Z",
				"2015-06-30T17:33:12Z"
			],
			"step": null
		},
		"bands": {
			"type": "bands",
			"values": ["NDVI"]
		}
	},
	// optional: Return additional statstics for the data cube if possible, ideally use the corresponsing openEO process names as keys
	"min": -1,
	"max": 1
}
```

## Quantile algorithms

The `quantiles` could implement a number of different algorithms, literature usually distinguishes [9 types](https://en.wikipedia.org/wiki/Quantile#Estimating_quantiles_from_a_sample).
Right now it's not possible to choose from them, but it may be added in the future.
To improve interoperability openEO processes, version 1.2.0 added details about the algorithm that must be implemented.
A survey has shown that most libraries implement type 7 and as such this was chosen to be the default.

We have found some libraries that can be used for an implementation:
- Java: [Apache Commons Math Percentile](http://commons.apache.org/proper/commons-math/javadocs/api-3.6/org/apache/commons/math3/stat/descriptive/rank/Percentile.html), choose the [estimation type `R_7`](http://commons.apache.org/proper/commons-math/javadocs/api-3.6/org/apache/commons/math3/stat/descriptive/rank/Percentile.EstimationType.html#R_7)
- JavaScript: [d3](https://github.com/d3/d3-array/blob/v2.8.0/README.md#quantile), has only type 7 implemented.
- Julia: [Statistics.quantile](https://docs.julialang.org/en/v1/stdlib/Statistics/#Statistics.quantile!), type 7 is the default.
- Python: [numpy](https://numpy.org/doc/stable/reference/generated/numpy.quantile.html), [pandas](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.quantile.html), [xarray](http://xarray.pydata.org/en/stable/generated/xarray.DataArray.quantile.html) - type 7 (called 'linear' for the interpolation parameter) is the default for all of them. 
- R: [quantile](https://stat.ethz.ch/R-manual/R-patched/library/stats/html/quantile.html) - type 7 is the default.
