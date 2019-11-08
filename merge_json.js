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
    removeFilesWithBaseName(outputFolderName, outputFileBaseName)
    let inputFolderPath = "./" + inputFolderName + "/"
    let files = fs.readdirSync(inputFolderPath)
    files = files.filter((filename) => {
        return filename.startsWith(inputFileBaseName)
    })
    files = files.sort()
    let prefix = 1
    let result = {}
    let backupResult = {}
    for (let i=0; i<files.length; i++){
        let file = files[i]
        let data = fs.readFileSync(inputFolderPath + file)
        let inputjson = JSON.parse(data)
        
        for (let key in inputjson) {
            if (inputjson.hasOwnProperty(key)) {
                backupResult = JSON.parse(JSON.stringify(result))
                if (result.hasOwnProperty(key)) {
                    result[key].push.apply(result[key], inputjson[key])
                } else {
                    result[key] = inputjson[key]
                }
                let outputData = JSON.stringify(result, null, 2)
                if (outputData.length > maxFileSize) {
                    outputData = JSON.stringify(backupResult, null, 2)
                    fs.writeFileSync("./" + outputFolderName + "/" + outputFileBaseName + prefix + ".json", outputData)
                    prefix += 1
                    result = {}
                    result[key] = inputjson[key]
                    outputData = JSON.stringify(result, null, 2)
                    if (outputData.length > maxFileSize) {
                        removeFilesWithBaseName(outputFolderName, outputFileBaseName)
                        showMemoryError()
                        return
                    }
                }
            }
        }
        let outputData = JSON.stringify(result, null, 2)
        fs.writeFileSync("./output/" + outputFileBaseName + prefix + ".json", outputData)
    }
}


merge("input", "data", "output", "data", 300)