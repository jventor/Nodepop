'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
	nombre : { 
		type: String, 
		index: true
	},
	venta : Boolean,
	precio : Number,
	foto : String,
	tags : [String]
});

anuncioSchema.set('autoIndex', true);

// Creamos un metodo estatico
anuncioSchema.statics.list = function(filters,limit, skip,sort,fields){
	//obtenemos la query sin ejecutarla
	const query = Anuncio.find(filters);
	query.limit(limit);
	query.skip(skip);
	query.sort(sort);
	query.select(fields);
	//ejecutammos la query y devolvemos una promesa
	//console.log('limit: '+limit+' skip: '+skip);
	return query.exec();
};


//Creamos el modelo
const Anuncio = mongoose.model('Anuncio',anuncioSchema);

//Exportamos modelo
module.exports = Anuncio;