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
        if (allLinks == null) {
          resolve(cleanLinks)
        } else {
          allLinks.forEach(e => {
            cleanLinks.push(e.replace(/[\[\(\)\]]/g, ''))
          })
          resolve(cleanLinks)
        }
      }
    })
  })
};
//esta funcion valida si los links estan buenos
const isValidLinks = (url) => {
  return new Promise((resolve, reject) => {
    fetchUrl(url, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
};

//funcion principal md link que lee los archivos 
const mdLinks = (path, validate) => {
  if (isDirectory(path)) {
    readFolder(path).then(files => {
      files.forEach(file => {
        if (pathModule.extname(file) === EXTENSION_MD) {
          takeLinks(pathModule.join(path, file)).then(links => {
            links.map(url => {
              if (validate) {
                isValidLinks(url).then(checkedLink => {
                  if (checkedLink.status === 200) {
                    console.log(file, url, ' OK ', checkedLink.status);
                  } else {
                    console.log(file, url, ' Fail ', checkedLink.status);
                  }
                });
              } else {
                console.log(file, url);
              }
            });
          }).catch(err => console.log(err))
        }
      })
    }).catch(err => console.log(err))
  }
}

// PASO 1 : Lectura de parametro process.argv[2]
// Declarando variable parameterType y asignamos lo que envia la terminal
if (module.parent === null) {
  const parameterType = process.argv[2];
  let validate = false;
  if (process.argv[3] && process.argv[3] == '--validate') {
    validate = true;
  }
  mdLinks(parameterType, validate)
}

module.exports.mdLinks = mdLinks


