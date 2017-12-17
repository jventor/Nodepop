'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const CustomError = require('../../lib/custom-error');
/**
 * POST /
 */
router.post('/', async (req,res,next)=>{
	const email = req.body.email;
	const password = req.body.password;

	await Usuario.usuarioPorEmail(email)
		.then((usuario) => {
			if (usuario == null) return next(CustomError(res,'USER_NOT_FOUND', 404));
			usuario.comparePassword(password,function(err, isMatch){
				if (err) return console.log('Error al autentificarse');
				if (!isMatch) return next(CustomError(res, 'INVALID_CREDENTIALS',401));	
				jwt.sign({user_id: usuario._id}, process.env.JWT_SECRET,{
					expiresIn: process.env.JWT_EXPIRES_IN
				}, (err, token) => {
					if (err) return next(err);
					res.json({ success: true, token: token });
				});
			});
		});
});

/**
 * POST /new
 */
router.post('/new', (req,res,next) => {
	// creamos un agente en memoria
	const usuario = new Usuario(req.body);
	// lo persistimos en la colección de agentes
	usuario.save((err, usuarioGuardado)=>{
		if (err) return next(err);
		res.json({success: true, result: usuarioGuardado});
	});
});

module.exports = router;