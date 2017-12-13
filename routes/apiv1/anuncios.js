'use strict';

// Creamos el router
const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');

/**
 * GET /anuncios
 * Lista todos los anuncios
 */
router.get('/', async (req, res, next) =>{
    const anuncios = await Anuncio.find({}).exec();
    res.json({ result: anuncios });
});

/**
 * GET /anuncios:id
 * Lista el anuncio con identificado id
 */
router.get('/:id', async (req, res, next) =>{
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
            return
        }
        res.json({ result: anuncioGuardado });
    });
});
// Exportamos router
module.exports = router;