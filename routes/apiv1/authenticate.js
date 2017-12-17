'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/Usuario');
const CustomError = require('../../lib/custom-error');

const { check, validationResult } = require('express-validator/check');
/**
 * POST /
 */
router.post('/', 
	[
		check('email')
			.exists().withMessage('EMAIL_NOT_EXIST')
			.isEmail().withMessage('EMAIL_WRONG_FORMAT'),
		check('password')
			.exists().withMessage('PASSWORD_NOT_EXIST')
	],
	async (req,res,next)=>{
		const errors = validationResult(req);
		if (!errors.isEmpty()) return next(errors);

		const email = req.body.email;
		const password = req.body.password;

		await Usuario.usuarioPorEmail(email)
			.then((usuario) => {
				if (usuario == null) return next(CustomError(res.__('USER_NOT_FOUND'), 404));
				usuario.comparePassword(password,function(err, isMatch){
					if (err) return console.log('Error al autentificarse');
					if (!isMatch) return next(CustomError(res.__('INVALID_CREDENTIALS'),401));	
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
router.post('/new', 
	[
		check('name')
			.exists().withMessage('NAME_NOT_EXIST'),
		check('email')
			.exists().withMessage('EMAIL_NOT_EXIST')
			.isEmail().withMessage('EMAIL_WRONG_FORMAT'),
		check('password')
			.exists().withMessage('PASSWORD_NOT_EXIST')
	],
	(req,res,next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return next(errors);
		// creamos un agente en memoria
		const usuario = new Usuario(req.body);
		// lo persistimos en la colección de agentes
		usuario.save((err, usuarioGuardado)=>{
			if (err) return next(err);
			res.json({success: true, result: usuarioGuardado});
		});
	});

module.exports = router;