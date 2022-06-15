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

function copyDirContent(sourceDirectory, targetDirectory, ignoreExtensions = []) {

    if (!fs.statSync(sourceDirectory).isDirectory()) {
        throw new Error(`${sourceDirectory} não corresponde a um caminho de diretório`)
    }

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true })
    }

    fs.readdirSync(sourceDirectory).forEach(fileOrDir => {
        const filePath = path.resolve(sourceDirectory, fileOrDir)
        const fsStats = fs.statSync(filePath)

        const isFile = fsStats.isFile()
        const isDir = fsStats.isDirectory()
        const isIgnoredExtension = ignoreExtensions.includes(path.extname(fileOrDir))

        if (isFile && !isIgnoredExtension) {
            console.info(
                'copy ' +
                chalk.green(fileOrDirector) +
                ` to ${targetDirectory.substr(targetDirectory.lastIndexOf('/') + 1)} directory`)
            fs.copyFileSync(filePath, path.resolve(targetDirectory, fileOrDir))
        }

        if (isDir) {
            const newSourceDir = path.resolve(sourceDirectory, fileOrDir)
            const newTargetDir = path.resolve(targetDirectory, fileOrDir)
            fs.mkdirSync(newTargetDir)
            copyDirContent(newSourceDir, newTargetDir)
        }
    })
}

function copyDir(sourceDirectory, targetDirectory, ignoreExtensions = []) {
    if (!fs.statSync(sourceDirectory).isDirectory()) {
        throw new Error(`${sourceDirectory} não é o caminho de um diretório`)
    }

    const dirname = path.basename(sourceDirectory)
    const target = path.resolve(targetDirectory, dirname)

    copyDirContent(sourceDirectory, target, ignoreExtensions)
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