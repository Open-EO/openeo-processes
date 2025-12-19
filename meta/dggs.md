# DGGS in openEO

## Introduction

**DGGS** (Discrete Global Grid System) is a way to divide the Earth into a set of fixed, regular, and hierarchical **grid of cells** (often hexagons or squares). Each cell has a unique ID and can be refined into smaller cells for higher resolution. The grid covers the whole Earth - no gaps, no overlaps. Instead of continuous coordinates, space is divided into **cells**. Each cell represents an area and different DGGS implementations use different shapes, e.g. Hexagons or Squares. Every point on Earth belongs to exactly one cell (at a given resolution). Well-known DGGS implementations are H3, S2 and rHEALPix.

## DGGS as a dimension

openEO could integrate DGGS in the following ways:

1. **Mapping to raster grids (x and y)**: Expose the traditional spatial dimensions with axes x and y to the user, hiding DGGS while mapping DGGS cells to raster pixels.
   -  This feels most natural to users that are unaware of DGGS and familiar with raster data. The datacube would be a **raster data cube**.
   -  It would allow for use of all existing openEO processes, including neighborhood operations such as `aggregate_spatial_window` and `apply_kernel`, provided that backends implement the necessary logic.
   -  Hiding the specifics of DGGS also hides its advantages (e.g. global consistency, hierarchical aggregation, cell-based indexing). Operations based on the DGGS cells can't be applied.
   -  This implementation is complex and potentially inefficient for backends, as it requires solving all challenges internally. This may include conversion between DGGS and raster grids for operations that are problematic/undefined in DGGS (e.g., Gaussian blur vs. Distance-weighted k-ring).
2. **Geometry dimension**: Expose DGGS as a geometry dimension to the user.
   -  Each grid cell could be represented as a geometry (e.g. polygon or multi-polygon) with an associated DGGS cell ID.  The datacube would be a **vector data cube**.
   -  Backends would need to keep track that the geometry dimension is based on a DGGS to efficiently apply operations that required knowledge of DGGS relationships such as adjacency and parent–child relation. Otherwise, this would need to be retrieved from the geometries itself, which is likely to be less efficient.
   -  Processes don't distinguish between "normal" geometry dimensions and DGGS-based geometry dimensions, which means that special DGGS processes that would require knowledge of DGGS can't be defined unambiguously. Users may pass in any geometry dimension accidentally.
   -  Raster-based such as `apply_kernel`, `aggregate_spatial`, or `resample_spatial` processes can't be applied. Operations based on DGGS cells can be applied, e.g. `apply_dimension` and `reduce_dimension` along the geometry dimension.
3. **New dimension type**: Specify a new dimension type within openEO that specifically handles DGGS grid cells.
   -  This approach would be DGGS-native and provide all benefits of DGGS, but it will require the addition of processes that can handle the DGGS specific operations.
   -  It would allow the definition of new processes that directly operate on DGGS concepts, such as parent/child aggregation, k-ring neighborhood operations, or resolution changes without reprojection. It also allows that processes directly require the DGGS dimension type in process parameters and return values, which otherwise is impossible.
   -  Requires a new version of the openEO API and STAC datacube extension that adds the new dimension type. 
   -  A set of new and adapted processes that explicitly support DGGS semantics must be specified.

## Processes

### Loading the datacube

It could make sense for backends to offer multiple ways (e.g. 1 and 2) to load a DGGS dataset, giving all options to a user:

-  `load_collection` in general should load a data cube how it's defined by the collection metadata. 
   -  If the collection metadata for a DGGS dataset exposes the dimensions *x, y, t, bands* for example, `load_collection` must return a raster datacube with exactly those dimensions.

   -  If a backend decides to expose a DGGS dataset as *geometry, t, bands*, `load_collection` must return a vector datacube with exactly those dimensions.

-  An alternative process could be defined that allows to load the dataset with different dimension types.

Note that both `load_collection` and `load_dggs` would have to define cell inclusion rules, e.g. which cells to include and how to handle partial cells.

### Other processes

The following list discusses processes and their handling of DGGS.

#### Raster data cubes

The following processes require a datacube with x and y dimensions as input:

- `apply_kernel` / `apply_neighborhood` / `aggregate_spatial_window`: **Problematic.** Can't be implemented for DGGS.
- `ard_...`, `atmospheric_correction`, `cloud_detection`, `sar_backscatter`, etc.: **Problematic.** These typically rely on established raster-based algorithms and libraries. Supporting DGGS would require either conversion to raster data cubes or re-implementation of the algorithms for DGGS, which may not be supported by the underlying software at all.
- `resample_spatial`: **Partially problematic.** The process is designed for raster data cubes and could be used to convert from DGGS to raster data cubes, but not vice-versa. A new process based on DGGS semantics is required if the datacube should keep the DGGS dimension.
- `resample_cube_spatial`: **Partially problematic.** Can be used for DGGS, but the `method` parameter is raster-centric.
- `aggregate_spatial`: Unproblematic. Must compute the values for the given geometries, which is unproblematic given the cell inclusion and weighting rules are well-defined.
- `filter_bbox` / `filter_spatial` / `mask_polygon`: Unproblematic. Processes have to define cell inclusion rules, e.g. which cells to include and how to handle partial cells.
- `mask`: Unproblematic when both data and mask are compatible (i.e. both have a DGGS-based dimension). If one of the parameters has a DGGS and the other parameter has raster dimensions, the mask needs to be converted.
- `ndvi`: Unproblematic as it's a per-pixel operation.
- `reduce_spatial`: Unproblematic. Process is not needed for DGGS, `reduce_dimension` along the DGGS dimension can be used instead.

The process specifications may need to change to remove the restriction of raster data cubes as input and specific DGGS wording may need to be added.

#### Vector data cubes

The following processes require a datacube with geometry dimension as input:

- `vector_buffer`: **Problematic.** Buffers can be computed around DGGS cell geometries, but the result is no longer a DGGS cell and breaks the discrete grid semantics.
- `vector_reproject`: **Problematic.** Reprojection of DGGS cell geometries is possible, but it may distort the original DGGS grid and invalidate cell IDs or hierarchical relationships.
- `filter_bbox` / `filter_spatial` / `filter_vector`: Unproblematic, but there's no filter process specific to filter based on DGGS cells ids or other discrete grid semantics.
- `vector_to_random_points` / `vector_to_regular_points`: Unproblematic. These can generate points inside DGGS cell geometries.

## Conclusion

- The new DGGS dimension type is a clean approach, but requires significant changes in the specification.
- For the time being, DGGS can be handled using the two alternative methods, but each has their clear downsides.
- ...