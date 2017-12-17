
var express = require('express');

//Importación y configuración del MW de internacionalizacion 'i18n'
const i18n = require('i18n');
i18n.configure({
	locales: ['en', 'es'],
	defaultLocale: 'en',
	directory: __dirname + '/locales'
});


var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//cargamos el conector a la BBDD
require('./lib/connectionMongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middleware
app.use(i18n.init);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas web
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// Rutas API v1
app.use('/apiv1/authenticate', require('./routes/apiv1/authenticate'));
app.use('/apiv1/anuncios', require('./routes/apiv1/anuncios'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	if (err.array){ // es un error de express-validator
		err.status = 422;
		const errInfo = err.array({ onlyFirstError: true })[0];
		err.message   = isAPI(req)? { success: 'false', message: 'Not valid', errors: err.mapped()} : // esta respuesta para APIs
			`Not valid - ${errInfo.param} ${errInfo.msg}`; // para otras peticiones
	}
	res.status(err.status || 500);
	
	if (isAPI(req)){
		res.json({ success: false, error: err.message});
		return;
	}
	
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.render('error');
});
	
function isAPI(req){
	return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;
