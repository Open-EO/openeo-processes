# ML API Specification for Earth Observation Data Cubes

Welcome to the Machine Learning (ML) API for processing Earth Observation (EO) data cubes. This API provides capabilities to perform classification, regression, smoothing, uncertainty analysis, and more on EO data. Below is a comprehensive guide to the API's operations.



## API Operations

Here's a detailed breakdown of the ML processes available in this API.

### General ML Processes

- `mlm_class_*` and `mlm_regr_*`
  - **Purpose**: Placeholder processes for classification and regression model definition.
  - **Usage**: These processes encapsulate various machine learning model .

- `ml_fit(model, training_set, target = "label")`
  - **Purpose**: Train an ML model using the specified training dataset.
  - **Parameters**:
    - `model`: The machine learning algorithm/model to be trained.
    - `training_set`: The dataset used for training.
    - `target`: The label or target variable in the dataset.

- `ml_predict(data, model)`
  - **Purpose**: Predict outcomes using a trained model on a given dataset.
  - **Parameters**:
    - `data`: The dataset for prediction.
    - `model`: The trained model to use for prediction.

- `ml_predict_probability(data, model)`
  - **Purpose**: Similar to `ml_predict`, but returns the probability of each prediction.
  - **Parameters**:
    - `data`: The dataset for probabilistic prediction.
    - `model`: The trained model to use for prediction.

- `ml_smooth_class(data, window_size, neighborhood_fraction)`
  - **Purpose**: Smooth classification results with spatial filtering.
  - **Parameters**:
    - `data`: The dataset to be smoothed.
    - `window_size`: The size of the moving window.
    - `neighborhood_fraction`: The fraction of neighbors to consider.

- `ml_uncertainty_class(data, method = "margin")`
  - **Purpose**: Analyze and assess uncertainty in classification results.
  - **Parameters**:
    - `data`: The dataset for uncertainty assessment.
    - `method`: The method for uncertainty evaluation. Default is "margin".

### Model Management

- `save_ml_model(data, name, tasks = list(), options = {})`
  - **Purpose**: Save a trained model to persistent storage.
  - **Parameters**:
    - `data`: The model data to be saved.
    - `name`: The identifier for the model.
    - `tasks`: (Optional) A list of tasks associated with the model.
    - `options`: (Optional) Additional options for saving the model.

- `load_ml_model(uri)`
  - **Purpose**: Load a previously saved model from storage.
  - **Parameters**:
    - `uri`: The location of the stored model.

- `export_model(model, name, folder)`
  - **Purpose**: Export a model to a specified folder in user workspace.
  - **Parameters**:
    - `model`: The model to export.
    - `name`: The name to save the model as.
    - `folder`: The destination folder.

- `import_model(name, folder)`
  - **Purpose**: Import a model from a specified folder in user workspace.
  - **Parameters**:
    - `name`: The name of the model to import.
    - `folder`: The source folder.

### Data Management

- `export_cube(data, name, folder)`
  - **Purpose**: Export data cubes to a specified folder in user workspace.
  - **Parameters**:
    - `data`: The data cube to export.
    - `name`: The name to save the data cube under.
    - `folder`: The destination folder.

- `import_cube(name, folder)`
  - **Purpose**: Import data cubes from a specified folder in user workspace.
  - **Parameters**:
    - `name`: The name of the data cube to import.
    - `folder`: The source folder.

### Results and Validation

- `load_result(job_id)`
  - **Purpose**: Load the result of a specified job.
  - **Parameters**:
    - `job_id`: The identifier for the job whose result is to be loaded.

- `ml_label_class`
  - **Purpose**: Label the classes in the modeling context.
  - **Notes**: Use this function to assign labels to data classes post-prediction.

- `ml_validate`
  - **Purpose**: Validate models and predictions against the dataset.
  - **Notes**: This function checks for accuracy and reliability of model outputs.

## Examples

TO DO


## Naming Convention Explanation

### `mlm_class_` and `mlm_regr_` Prefixes

- **Model Definition**:
  - The `mlm_class_` prefix is used for functions that define and initialize classification models. These functions create model structures but do not perform any training, returning untrained classification models.
  - The `mlm_regr_` prefix applies to regression models. These functions provide the framework of a regression model without training, outputting untrained models ready for fitting with data.
  - This setup allows users to configure the model architecture and parameters prior to training.

### `ml_` Prefix

- **General ML Operations**:
  - The `ml_` prefix encompasses general machine learning operations applicable across stages, such as model training, prediction, and post-processing. These processes include key tasks like fitting (`ml_fit`), predicting (`ml_predict`), and validating (`ml_validate`).

## Adopting openEO Conventions

### `load_` Prefix

- **Loading Resources**:
  - The `load_` prefix is used for functions involved in retrieving or loading resources, conforming to openEO's approach to data acquisition.
  - Examples:
    - `load_ml_model(uri)`: Loads a machine learning model from storage using its URI.
    - `load_result(job_id)`: Retrieves the result of a job given its ID.

### `export_` Prefix

- **Exporting Data/Models**:
  - The `export_` prefix denotes functions that handle exporting data or models.
  - Examples:
    - `export_cube(data, name, folder)`: Exports a data cube to a designated folder.
    - `export_model(model, name, folder)`: Exports a trained model for external use or storage.

### `import_` Prefix

- **Importing Resources**:
  - The `import_` prefix indicates functions intended to bring data or models from external resources into the application.
  - Examples:
    - `import_cube(name, folder)`: Imports a data cube from a designated folder.
    - `import_model(name, folder)`: Imports a model from a specified folder.

## Advantages of Alignment with openEO

- **Familiarity**: Leveraging openEO conventions helps users quickly understand and operate the API, especially those familiar with openEO.
- **Consistency**: This reduces confusion by maintaining a uniform interaction model for data, models, and results.
- **Integration**: Adhering to openEO standards facilitates easier integration with other tools and services within its ecosystem.

This structured approach allows users to effectively transition from defining their models to executing a comprehensive ML workflow tailored for Earth Observation data cubes.
		