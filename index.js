//declarando constantes e importando los modulos de node
const fs = require('fs');
const pathModule = require('path');
const EXTENSION_MD = '.md';
const regularExpresionUrl = /\]\((http[^)]+)\)/g
const fetchUrl = require("fetch").fetchUrl;

//creo funcion para luego en la funcion principal pueda ser llamada
//esta funcion verifica si es un directorio
const isDirectory = (path) => {
  //usamos el modulo fs e invoco el metodo lstatSync
  const value = fs.lstatSync(path).isDirectory();
  return value;
}
//esta funcion se encarga de leer directorios
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
//esta funcion se encarga de leer un archivo y tomar links
const takeLinks = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        let cleanLinks = []
        const dataAsString = data.toString();
        const allLinks = dataAsString.match(regularExpresionUrl)
        allLinks.forEach(e => {
          cleanLinks.push(e.replace(/[\[\(\)\]]/g, ''))
        })
        resolve(cleanLinks)
      }
    })
  })
};
const isValidLinks = (url) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, (error, response ) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
};

//funcion principal md link que lee los archivos 
const mdLinks = (path) => {
  if (isDirectory(path)) {
    readFolder(path).then(files => {
      files.forEach(file => {
        if (pathModule.extname(file) === EXTENSION_MD) {
          takeLinks(file).then(links => {
            links.map(url => {
              isValidLinks(url).then(checkedLink => {
                if (checkedLink.status === 200) {
                  console.log(file, url.split(0, 51), ' OK ', checkedLink.status);
                } else {
                  console.log(file, url.split(0, 51), ' Fail ', checkedLink.status);
                }
              });
            });
          }).catch(err => console.log(err))
        }
      })
    }).catch(err => console.log(err))
  }
}

// PASO 1 : Lectura de parametro process.argv[2]
// Declarando variable parameterType y asignamos lo que envia la terminal
const parameterType = process.argv[2];
module.exports.mdLinks = mdLinks(parameterType)

