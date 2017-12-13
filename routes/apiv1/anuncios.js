'use strict';

// Creamos el router
const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');
const Anuncio = require('../../models/Anuncio');

router.use(jwtAuth());

/**
 * GET /anuncios
 * Lista todos los anuncios
 */
router.get('/', async(req,res,next) => {
	try{
		const nombre = req.query.nombre;
		const precio = req.query.precio;
		const venta = req.query.venta;
		const includeTotal = req.query.includeTotal;
		const tag = req.query.tag;
		const limit = parseInt(req.query.limit); //Number(str);
		const start = parseInt(req.query.start);
		const sort = req.query.sort;
		const fields = req.query.fields;
        
		//creo el filtro vacio
		const filter = {};
		if (nombre){
			filter.nombre = new RegExp('^'+nombre,'i');
		}
        
		if (precio){
			const rango = precio.split('-');
			if (rango.length === 1 ){
				filter.precio = Number(rango[0]);
			}
			else{
				if (rango[0] === ''){
					filter.precio = {'$lte': rango[1]};
				}
				else if(!rango[1]){
					filter.precio = {'$gte': rango[0]};
				}
				else{
					filter.precio = {'$gte' : rango[0], '$lte': rango[1]};
				}
			}     
		}
        
		if (venta){
			filter.venta = venta;
		}

		if (tag){
			filter.tags = { $in: tag.split(' ')};
		}


		const anuncios = await Anuncio.list(filter, limit, start, sort,fields);

		if (includeTotal === 'true'){
			const numRows = await Anuncio.find(filter).exec();
			res.json({ result: anuncios, total: numRows.length });
		}
		else{
			res.json({ result: anuncios });
		}
	}
	catch(err){
		next(err);
	}
});

/**
 * GET /anuncios:id
 * Lista el anuncio con identificado id
 */
router.get('/:id', async (req, res) =>{
	const _id = req.params.id;
	const anuncio = await Anuncio.findOne({_id}).exec();
	res.json({ result: anuncio });
});

/**
 * POST /anuncios
 * Crea un anuncio
 */
router.post('/', (req, res, next)=>{
	const anuncio = new Anuncio(req.body);
	anuncio.save((err, anuncioGuardado)=>{
		if (err){
			next(err);
			return;
		}
		res.json({ result: anuncioGuardado });
	});
});
// Exportamos router
module.exports = router;