# Tests for openEO Processes

To run the tests follow these steps:

1. Install [node and npm](https://nodejs.org) - should run with any recent version
2. Run `npm install` in this folder to install the dependencies
3. Run the tests with `npm test`. This will also lint the files and verify it follows best practices.
4. To show the files nicely formatted in a web browser, run `npm run render`. It starts a server and opens the corresponding page in a web browser.

## Development processes

All new processes must be added to the `proposals` folder. Each process must be declared to be `experimental`.
Processes must comply to best practices, which ensure a certain degree of consistency.
`npm test` will validate and lint the processes and also ensure the best practices are applied. 

The linting checks that the files are named correctly, that the content is correctly formatted and indented (JSON and embedded CommonMark).
The best practices ensure that for examples the fields are not too short and also not too long for example.

A spell check is also checking the texts. It may report names and rarely used technical words as errors. 
If you are sure that these are correct, you can add them to the `.words` file to exclude the word from being reported as an error.
The file must contain one word per line.

New processes should be added via GitHub Pull Requests.

## Subtype schemas

Sometimes it is useful to define a new "data type" on top of the JSON types (number, string, array, object, ...).
For example, a client could make a select box with all collections available by adding a subtype `collection-id` to the JSON type `string`.
If you think a new subype should be added, you need to add it to the `meta/subtype-schemas.json` file.
It must be a valid JSON Schema. The tests mentioned above will also verify to a certain degree that the subtypes are defined correctly.

## Examples

To get out of proposal state, at least two examples must be provided.
The examples are located in the `examples` folder and will also be validated to some extent in the tests.