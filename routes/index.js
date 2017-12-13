var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
/* GET home page. */
router.get('/', function(req, res, next) {
  const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
  fetch(baseUrl + '/apiv1/anuncios/',{
    method: 'GET'
  })
  .then(result => result.json())
  .then(data => res.render('index', { title: 'Nodepop', anuncios: data.result }));
  
});

module.exports = router;
