const fs = require("fs")

let showMemoryError = () => {
    console.log("Insufficient Memory")
    console.log("Please Increase Max File Size")
}

let removeFilesWithBaseName = (folderName, baseName) => {
    let folderPath = "./" + folderName + "/"
    let files = fs.readdirSync(folderPath)
    files = files.filter((filename) => {
        return filename.startsWith(baseName)
    })
    files.forEach(file => {
        fs.unlinkSync(folderPath + file)
    })
}

let merge = (inputFolderName, inputFileBaseName, outputFolderName, outputFileBaseName, maxFileSize) => {
    removeFilesWithBaseName(outputFolderName, outputFileBaseName)   //remove already existing output files if any
    let inputFolderPath = "./" + inputFolderName + "/"
    let files = fs.readdirSync(inputFolderPath)
    files = files.filter((filename) => {     //read and filter input files
        return filename.startsWith(inputFileBaseName)
    })
    files = files.sort()
    let suffix = 1
    let result = {}  // create empty JSON to store merged values
    let backupResult = {}
    for (let i=0; i<files.length; i++){      //iterate through each file
        let file = files[i]
        let data = fs.readFileSync(inputFolderPath + file)
        let inputjson = JSON.parse(data)
        
        for (let key in inputjson) {    //iterate through each key
            if (inputjson.hasOwnProperty(key)) {
                backupResult = JSON.parse(JSON.stringify(result))   //store a backup in case memory limit exceeds
                if (result.hasOwnProperty(key)) {
                    result[key].push.apply(result[key], inputjson[key])  //append to value if key already present
                } else {
                    result[key] = inputjson[key]  //create new key if key not already present
                }
                let outputData = JSON.stringify(result, null, 2)
                if (outputData.length > maxFileSize) {    //check resulting file size
                    outputData = JSON.stringify(backupResult, null, 2)
                    fs.writeFileSync("./" + outputFolderName + "/" + outputFileBaseName + suffix + ".json", outputData) //write the backup to a file
                    suffix += 1  //increment file number
                    result = {}  // empty JSON to store new merged values
                    result[key] = inputjson[key]
                    outputData = JSON.stringify(result, null, 2)
                    if (outputData.length > maxFileSize) {  // ERROR - a size of single key-value pair exceeds specified memory limit 
                        removeFilesWithBaseName(outputFolderName, outputFileBaseName)
                        showMemoryError()
                        return
                    }
                }
            }
        }
        let outputData = JSON.stringify(result, null, 2) 
        fs.writeFileSync("./output/" + outputFileBaseName + suffix + ".json", outputData) //write the last merged JSON to file
    }
}


merge("input", "data", "output", "data", 300)

//merge(INPUT_FOLDER_NAME, INPUT_FILE_BASENAME, OUTPUT_FOLDER_NAME, OUTPUT_FILE_BASENAME, MAX_FILE_LIMIT_IN_BYTES)