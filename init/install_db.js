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
	return new Promise(function(resolve){
		conn.collection(collectionName).drop(function(err, result){
			if (err) {
				console.log(`Error borrando colleccion (${collectionName}) : ` + err);
			}                
			console.log(`   -> Borrado de (${collectionName}) correcto? ` + result);
			resolve(result);
		});
	});
}

async function cargarData(collectionName, model, fileName){
	try{
		await initCollection(collectionName);
		let datosJSONFull = await getData(fileName,'utf8'); 
		const datosJSON = datosJSONFull[collectionName];
		for (let i = 0; i < datosJSON.length; i++){
			//await saveDato(model,datosJSON[i]);
			await new Promise(function(resolve, reject){
				new model(datosJSON[i]).save((err, item) => { 
					err ? reject(err) : resolve(item); 
				});
			});			
		}
		console.log(`   -> Datos cargados de ${collectionName} desde ${fileName}`);				
	}
	catch(err){
		console.log('Error cargarData(install_db.js):\n', err);
	}
}

cargarData('anuncios', Anuncio,process.env.PATH_ANUNCIOS_INICIALES)
	.then( () => cargarData('usuarios', Usuario,process.env.PATH_USUARIOS_INICIALES))
	.then( () => conn.close(function(err){
		if (err) {
			console.log('Error cerrando la BBDD: ' + err);
		}                
		console.log('   -> Conexion con BBDD cerrada\n');
	}))
	.catch(err =>{
		// este catch se activa si falla cualuiera de las promesas anteriores
		console.log('   !!! -> Hubo un fallo en la carga de datos: ', err);
	});






