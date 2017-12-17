'use strict';

// Creamos el router
const express = require('express');
const router = express.Router();
const jwtAuth = require('../../lib/jwtAuth');
const Anuncio = require('../../models/Anuncio');


router.use(jwtAuth());

/**
 * GET /anuncios
 * Lista los anuncios
 * Filtros:
 * Si se deja vacio -> muestras todos
 * ?nombre=NOMBRE -> muestras los anuncios que coincidan con nombre o empiecen con ese texto
 * ?venta=true / false -> muestras los anuncios que se venden / los que se buscan
 * ?tag=TAGNAME -> muestra los anuncios que contienen TAGNAME entre sus tags
 * 
 * Opciones:
 * ?includeTotal=true -> se añadirá al resultado el numero total de elementos que coincidan 
 * 						con la busqueda independientemente del valor de skip y limit
 * ?limit=X -> los resultados obtenimos serán como máximo X elementos
 * ?skip=X -> numero de elementos que se saltan (skip y limit se combinan para paginación)
 * ?sort=FIELD -> campo por el que se ordenaran los resultados
 * ?fields= campos (sepadaos por espacio) -> solo se obtendrán esos campos en los resultados
 */
router.get('/', async(req,res,next) => {
	try{
		// Obtener los parametros de la query
		const nombre = req.query.nombre;
		const precio = req.query.precio;
		const venta = req.query.venta;
		const includeTotal = req.query.includeTotal;
		const tag = req.query.tag;
		const limit = parseInt(req.query.limit);
		const start = parseInt(req.query.start);
		const sort = req.query.sort;
		const fields = req.query.fields;
        
		//creo el filtro vacio
		const filter = {};

		// Añadimos filtro por nombre a la busqueda si estaba en la query
		if (nombre) filter.nombre = new RegExp('^'+nombre,'i');
		
		//Añadimos filtro por precio a la busqueda si estaba en la query
		if (precio){ 
			const rango = precio.split('-');
			if (rango.length === 1 ){	//precio=X -> precio exacto a X
				filter.precio = Number(rango[0]);
			}
			else{
				if (rango[0] === ''){ 	// precio=-X -> precios menores a X
					filter.precio = {'$lte': rango[1]};
				}
				else if(!rango[1]){		//precio=X- -> precios menores a X
					filter.precio = {'$gte': rango[0]};
				}
				else{					// precio=X-Y -> precios entre X e Y
					filter.precio = {'$gte' : rango[0], '$lte': rango[1]};
				}
			}     
		}
		// Añadimos filtro por venta (true si es venta, false si se busca para comprar)
		if (venta) filter.venta = venta;

		// Añadiños filtro por tag
		if (tag) filter.tags = { $in: tag.split(' ')};

		// Se ejecuta la busqueda
		const anuncios = await Anuncio.list(filter, limit, start, sort,fields);

		// Si se encuentra en la query includeTotal=true entonces se añade el número total de elementos
		// en la busqueda, independientemente del limit y el skip, util para paginado
		if (includeTotal === 'true'){
			const numRows = await Anuncio.find(filter).exec();
			res.json({ success: 'true', result: anuncios, total: numRows.length });
		}
		else{
			res.json({ success: 'true', result: anuncios });
		}
	}
	catch(err){
		next(err);
	}
});

/**
 * GET /tags
 * Lista las etiquetas existentes
 */
router.get('/tags', async (req, res, next) =>{
	try{
		const query = Anuncio.find().distinct('tags');
		const tags = await query.exec();
		res.json({ success: 'true', result: tags });
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
	res.json({ success: 'true', result: anuncio });
});

/**
 * POST /anuncios
 * Crea un anuncio
 */
router.post('/', (req, res, next)=>{
	const anuncio = new Anuncio(req.body);
	anuncio.save((err, anuncioGuardado)=>{
		if (err) return next(err);
		res.json({ success: 'true', result: anuncioGuardado });
	});
});

// Exportamos router
module.exports = router;