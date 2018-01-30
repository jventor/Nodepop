'use strict';

const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.Promise = global.Promise;

conn.on('error', err=>{
	console.log('Error! ', err);
	process.exit(1);
});

conn.once('open',()=>{
	console.log(`   -> Conectado a mongodb en ${mongoose.connection.name}`);
});

mongoose.connect(`mongodb://${process.env.MONGODB_AUTH}${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE_NAME}`, {
	useMongoClient: true    
});

module.exports = conn;