# Tests

This folder contains test cases for the openEO processes.
To allow for more data types (e.g. infinity and nan for numbers), all the files are encoded in **JSON5**.

## Missing processes

The following processes have no test cases as the results heavily depend on the underlying implementation
or need an external services to be available for testing (e.g. loading files from the user workspace or a UDF server).
We don't expect that we can provide meaningful test cases for these processes.

- ard_normalized_radar_backscatter
- ard_surface_reflectance
- atmospheric_correction
- cloud_detection
- fit_curve
- inspect
- load_collection
- load_uploaded_files
- predict_curve
- run_udf
- run_udf_externally
- sar_backscatter
- save_result
- vector_to_random_points