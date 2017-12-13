'use strict';

const jwt = require('jsonwebtoken');

//exportamos un creados de MD de autenticacion
module.exports = () => {
	return function(req, res, next) {
		// leer credenciales
		const token = req.body.token || req.query.token || req.get('x-access-token');
		// comprobar credenciales
		if (!token){
			const err = new Error ('No token provided');
			err.status = 401;
			next(err);
			return;
		}
		// continuar
		const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
			if (err){
				// token modificado o caducado
				console.log('Token error', err);
				const error = new Error ('Invalid token');
				error.status = 401;
				next(error);
				return;
			}
			req.userId = decoded.user_id; // lo guardamos en RQ para los sguiente MW
			next();
		});
	};
};