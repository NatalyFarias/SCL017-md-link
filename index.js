//declarando constantes e importando los modulos de node
const fs = require('fs');
const pathModule = require('path');
const EXTENSION_MD = '.md';
//creo funcion para luego en la funcion principal pueda ser llamada
//esta funcion verifica si es un directorio
const isDirectory = (path) => {
  //usamos el modulo fs e invoco el metodo lstatSync
  const value = fs.lstatSync(parameterType).isDirectory();
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
//esta funcion se encarga de leer un archivo e imprimir su contenido en la terminal
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
//funcion principal md link verifica si los enlaces estan buenos
const mdLinks = (path) => {
if(isDirectory(path)){
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
}
 
// PASO 1 : Lectura de parametro process.argv[2]
// Declarando variable parameterType y asignamos lo que envia la terminal
const parameterType = process.argv[2];
//usamos el modulo fs e invoco el metodo lstatSync
const valor = fs.lstatSync(parameterType).isDirectory();
console.log('Es un directorio : ' + valor);

module.exports.mdLinks = mdLinks(fileName)