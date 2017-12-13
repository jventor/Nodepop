'use strict';

//Cargamos variables de entorno
require('dotenv').config();

//Establecemos conexión con la BBDD
const conn = require('../lib/connectionMongoose');

//Cargamos los modelos
const Anuncio = require('../models/Anuncio');
const Usuario = require('../models/Usuario');

//Cargamos el fichero de usuario
function getData(fileName, type) {
    return new Promise(function(resolve, reject){
        const fs = require('fs');
        fs.readFile(fileName, type, (err, data) => { 
                                        err ? reject(err) : resolve(JSON.parse(data)); 
                                    });
    });
  }

function initCollection(collectionName){
    return new Promise(function(resolve, reject){
        conn.collection(collectionName).drop(function(err, result){
                if (err) {
                    console.log(`Error borrando colleccion (${collectionName}) : ` + err);
                }                
                console.log(`   -> Borrado de (${collectionName}) correcto? ` + result);
                resolve(result);
            });
    });
}

function saveDato(model, val){
    return new Promise(function(resolve, reject){
        let retornado = new model(val).save((err, item) => { 
                                                err ? reject(err) : resolve(item); 
                                            });
    });
}

async function cargarData(collectionName, model, fileName){
        await initCollection(collectionName);
        let datosJSON = await getData(fileName,'utf8');         
        for (let i = 0; i < datosJSON.length; i++){
             let retorno = await saveDato(model,datosJSON[i]);
        }
        console.log(`   -> Datos cargados de ${collectionName} desde ${fileName}`);
}

cargarData('anuncios',Anuncio,'./init/initialdata/anuncios.json')
.then( () => cargarData('usuarios',Usuario,'./init/initialdata/usuarios.json'))
.then( () => conn.close(function(err){
    if (err) {
        console.log(`Error cerrando la BBDD: ` + err);
    }                
    console.log(`   -> Conexion con BBDD cerrada\n`);
}))
.catch(err =>{
    // este catch se activa si falla cualuiera de las promesas anteriores
    console.log('   !!! -> Hubo un fallo: ', err);
});






