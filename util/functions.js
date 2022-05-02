const fs = require('fs')
const getFiles = (path, suffix) => {
    return fs.readdirSync(path).filter(f=>f.endsWith(suffix))
}

module.exports = {
    getFiles
}