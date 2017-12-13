'use strict';

const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String
});

//Creamos el modelo
const Usuario = mongoose.model('Usuario',usuarioSchema);

//Exportamos modelo
module.exports = Usuario;