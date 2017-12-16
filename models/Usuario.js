'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const usuarioSchema = mongoose.Schema({
	name: { type: String, index: true },
	email : { type: String, require: true, unique: true, index: true},
	password: { type: String, require: true }
});

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


usuarioSchema.post('save', function(error, doc, next) {
	if (error.name === 'MongoError' && error.code === 11000) {
		next(new Error('There was a duplicate key error'));
	} else {
		next(error);
	}
});

usuarioSchema.methods.comparePassword = function (candidatePassword, cb){
	console.log('passrecibida:',candidatePassword +' '+ this.password);
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) return cb(err);
		console.log('Match: ', isMatch);
		cb(null, isMatch);		
	});
};

// Creamos un metodo estatico
usuarioSchema.statics.usuarioPorEmail = function(_email){
	//obtenemos la query sin ejecutarla

	return Usuario.findOne({ email: _email}).exec();

};

//Creamos el modelo
const Usuario = mongoose.model('Usuario',usuarioSchema);

//Exportamos modelo
module.exports = Usuario;