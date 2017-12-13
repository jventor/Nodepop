'use strict';

const mongoose = require('mongoose');

const anuncioSchema = mongoose.Schema({
    nombre : String,
    venta : Boolean,
    precio : Number,
    foto : String,
    tags : [String]
});

//Creamos el modelo
const Anuncio = mongoose.model('Anuncio',anuncioSchema);

//Exportamos modelo
module.exports = Anuncio;