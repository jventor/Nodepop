'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/', (req,res,next)=>{
	const email = req.body.email;
	const password = req.body.password;

	// Buscamos el la base e datos el usuario
	//simulamos que buscamos
	if (email !== 'user@example.com' || password !== '1234'){
		res.status = 401;
		res.json ({error: 'Credenciales incorrectas'});
		return;
	}
	const user = { _id: '457yt3849two4uto'};
	//si el usuario existe y la password coincide
	// No firmar con objetos de Mongoose, usar mejor un nuevo objeto solo con lo minimo
    
	jwt.sign({user_id: user._id}, process.env.JWT_SECRET,{
		expiresIn: process.env.JWT_EXPIRES_IN
	}, (err, token) => {
		if (err){
			next(err);
			return;
		}
		res.json({ success: true, token: token});
	});
});

module.exports = router;