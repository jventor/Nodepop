'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');

router.post('/', async (req,res,next)=>{
	const email = req.body.email;
	const password = req.body.password;

	// Buscamos el la base e datos el usuario
	//simulamos que buscamos
    

	await Usuario.usuarioPorEmail(email)
		.then((usuario) => {
			if (usuario == null){
				next(new Error('El usuario no existe en la BBDD'));
				return;
			}
			console.log(usuario);
			usuario.comparePassword(password,function(err, isMatch){
				if (err) return console.log('Error al autontificarse');
				if (!isMatch){
					next(new Error('Credenciales incorrectas'));
					return;
				}
				//si el usuario existe y la password coincide
				console.log('usuario: ', usuario._id + 'Match:', isMatch);
				// No firmar con objetos de Mongoose, usar mejor un nuevo objeto solo con lo minimo
            
				jwt.sign({user_id: usuario._id}, process.env.JWT_SECRET,{
					expiresIn: process.env.JWT_EXPIRES_IN
				}, (err, token) => {
					if (err){
						next(err);
						return;
					}
					res.json({ success: true, token: token });
				});
			});

		});

});


router.post('/new', (req,res,next) => {
	// creamos un agente en memoria
	const usuario = new Usuario(req.body);

	// lo persistimos en la colección de agentes
	usuario.save((err, usuarioGuardado)=>{
		if (err){
			next(err);
			return;
		}
		res.json({success: true, result: usuarioGuardado});
	});
});

module.exports = router;