const fs = require('fs');
const pathModule = require('path');
const EXTENSION_MD = '.md';

const readFolder = (location) => {
  return new Promise((resolve, reject) => {
    fs.readdir(location, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
};

const printFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        const dataAsString = data.toString();
        resolve(dataAsString)
      }
    })
  })
};

const mdLinks = (path) => {
  readFolder(path).then(files => {
    files.forEach(file => {
      if (pathModule.extname(file) === EXTENSION_MD) {
        printFile(file).then(archivo => {
          console.log(archivo);
        }).catch(err => console.log(err))
      }
    })
  }).catch(err => console.log(err))
}

const fileName = process.argv[2];

module.exports.mdLinks = mdLinks(fileName)