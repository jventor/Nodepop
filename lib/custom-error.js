'use strict';

module.exports = function CustomError (res, message, status){
	const err = new Error (res.__(message));
	err.status = status;
	return err;
};