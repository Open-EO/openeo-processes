# Zonal Statistics (POC Use Case 3)

This example computes time series of zonal (regional) statistics of Sentinel 2 imagery over user-specified polygons.

This process graph is meant to be used as batch job or can be lazy evaluated. It returns a JSON file with the computed results.

This process graph assumes the dataset is called `Sentinel-2`. The temporal extent covered is January 2017, an arbitrary spatial extent was chosen and it uses band `B8` for the computations. Please note that we still need to remove (reduce) the spectral dimension from the data cube (see node `reduce1`) as removing all bands except one still keeps the spectral dimension for the bands.

Only a single GeoJSON polygon is specified, which fully covers the spatial extent specified in `load_collection`. We compute the mean for the values in the polygon.

## Process Graph

```json
{
  "loadco1": {
    "process_id": "load_collection",
    "arguments": {
      "id": "Sentinel-2",
      "spatial_extent": {
        "west": 16.1,
        "east": 16.6,
        "north": 48.6,
        "south": 47.2
      },
      "temporal_extent": [
        "2017-01-01",
        "2017-02-01"
      ],
      "bands": [
        "B8"
      ]
    }
  },
  "reduce1": {
    "process_id": "reduce",
    "arguments": {
      "data": {
        "from_node": "loadco1"
      },
      "dimension": "spectral"
    }
  },
  "aggreg1": {
    "process_id": "aggregate_polygon",
    "arguments": {
      "data": {
        "from_node": "reduce1"
      },
      "polygons": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              16.138916,
              48.320647
            ],
            [
              16.524124,
              48.320647
            ],
            [
              16.524124,
              48.1386
            ],
            [
              16.138916,
              48.1386
            ],
            [
              16.138916,
              48.320647
            ]
          ]
        ]
      },
      "reducer": {
        "callback": {
          "mean1": {
            "process_id": "mean",
            "arguments": {
              "data": {
                "from_argument": "data"
              }
            },
            "result": true
          }
        }
      }
    }
  },
  "savere1": {
    "process_id": "save_result",
    "arguments": {
      "data": {
        "from_node": "aggreg1"
      },
      "subtype": "JSON"
    },
    "result": true
  }
}
```

## Result

We haven't yet clearly specified the output format for this process. Therefore, the results may vary between back-ends. Executing a similar process graph on Google Earth Engine gives the following results:

```
{
  "result": 6303.442644344102,
  "result_pixel_count": null,
  "result_invalid_count: null
}
```