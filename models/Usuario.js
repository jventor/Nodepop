'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
/**
 * Modelo Usuario
 */
const usuarioSchema = mongoose.Schema({
	name: { type: String, index: true },
	email : { type: String, require: true, unique: true, index: true},
	password: { type: String, require: true }
});

/**
 * 
 */
usuarioSchema.pre('save', function(next){
	const usuario = this;
	
	if (!usuario.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if (err) return next(err);
		bcrypt.hash(usuario.password, salt, function(err, hash){
			if (err) return next(err);
			usuario.password = hash;
			next();
		});
	});

});

/**
 * 
 */
usuarioSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		const error = new Error('There was a duplicate key error');
		error.status = 409;
		next(error);
	} else {
		next(error);
	}
});

/**
 * 
 */
usuarioSchema.methods.comparePassword = function (candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) return cb(err);
		cb(null, isMatch);		
	});
};

/**
 * 
 */
usuarioSchema.statics.usuarioPorEmail = function(_email){
	return Usuario.findOne({ email: _email}).exec();
};

//Creamos el modelo
const Usuario = mongoose.model('Usuario',usuarioSchema);

//Exportamos modelo
module.exports = Usuario;