const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

function copyFile(filepath, targetDirectory) {
    if (!fs.statSync(filepath).isFile()) {
        throw new Error(`${file} não corresponde a um caminho de arquivo`)
    }

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    const basename = path.basename(filepath)

    fs.copyFileSync(filepath, path.resolve(targetDirectory, basename))
}

function copyDirContent(sourceDirectory, targetDirectory) {

    if (!fs.statSync(sourceDirectory).isDirectory()) {
        throw new Error(`${sourceDirectory} não corresponde a um caminho de diretório`)
    }

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    fs.readdirSync(sourceDirectory).forEach(fileOrDirector => {
        const filePath = path.resolve(sourceDirectory, fileOrDirector)
        const fsStats = fs.statSync(filePath)

        if (fsStats.isFile()) {
            console.info(
                'copy ' +
                chalk.green(fileOrDirector) +
                ` to ${targetDirectory.substr(targetDirectory.lastIndexOf('/') + 1)} directory`)
            fs.copyFileSync(filePath, path.resolve(targetDirectory, fileOrDirector))
        }
        if (fsStats.isDirectory()) {
            const newSourceDir = path.resolve(sourceDirectory, fileOrDirector)
            const newTargetDir = path.resolve(targetDirectory, fileOrDirector)
            fs.mkdirSync(newTargetDir)
            copyDirContent(newSourceDir, newTargetDir)
        }
    })
}

function copyDir(sourceDirectory, targetDirectory) {
    if (!fs.statSync(sourceDirectory).isDirectory()) {
        throw new Error(`${sourceDirectory} não é o caminho de um diretório`)
    }

    const dirname = path.basename(sourceDirectory)
    const target = path.resolve(targetDirectory, dirname)

    copyDirContent(sourceDirectory, target)
}

const copyDirAsync = (function () {
    let fileCount = 0
    let copyCount = 0

    return function copyAsync(sourceDirectory, targetDirectory, callBack) {
        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory, { recursive: true })
        }
        fs.readdir(sourceDirectory, (error, files) => {
            if (error) {
                console.log(error);
                return
            }

            fileCount += files.length
            files.forEach(fileOrDirectory => {
                const filePath = path.resolve(sourceDirectory, fileOrDirectory)

                fs.stat(filePath, (error, stats) => {
                    if (stats.isFile()) {
                        console.info(
                            'copy ' +
                            chalk.green(fileOrDirectory) +
                            ` to ${targetDirectory.substr(targetDirectory.lastIndexOf('/') + 1)} directory`
                        )

                        fs.copyFile(filePath, path.resolve(targetDirectory, fileOrDirectory), (error) => {
                            if (error) {
                                if (typeof callBack == 'function') {
                                    callBack(error)
                                }
                                process.exit()
                            }
                            copyCount++
                            if (copyCount >= fileCount) {
                                if (typeof callBack == 'function') {
                                    callBack(error)
                                }
                            }
                        })
                    }

                    if (stats.isDirectory()) {
                        const newSourceDir = path.resolve(sourceDirectory, fileOrDirectory)
                        const newTargetDir = path.resolve(targetDirectory, fileOrDirectory)

                        fs.mkdir(newTargetDir, (error) => {
                            if (error) {
                                return console.log(error)
                            }
                            copyCount++
                            copyAsync(newSourceDir, newTargetDir, callBack)
                        })
                    }
                })
            })
        })
    }
})()

module.exports = { copyDirContent, copyFile, copyDir, copyDirAsync }