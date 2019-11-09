# merge_json
A node.js program to merge multiple JSON files into JSON files of specific size.

## Algorithmic Complexity
    
    the runtime of the merge-json algorithm is O(FKB)

    where,

    F --> no of input files
    K --> average no of keys in each input files
    B --> b is the specified max file limit because of the line JSON.parse(JSON.stringify(obj))

## Project Structure

    input  - folder that contains input files
    output - folder that contains output files

    merge_json.js - script to perform merging

    parameters can be change inside the program as specified below,

    merge(INPUT_FOLDER_NAME, INPUT_FILE_BASENAME, OUTPUT_FOLDER_NAME, OUTPUT_FILE_BASENAME, MAX_FILE_LIMIT_IN_BYTES)

    run the code using node merge_json.js

>submitted by Elamaran A E (SASTRA Deemed to be University)
