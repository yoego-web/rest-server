
/*

	Middleware para validar campos

	* validationResult > metodo de express-validator que revisara
		checkeara cada validacion seteadas en los archivos "Route" 
		si es valida ira a la sgte con "next()"
*/
const { validationResult } = require('express-validator');

const validateFields = (req, res, next)=> {
		
	const errors = validationResult(req);
	// si hay errores
	if( !errors.isEmpty() ){
		return res.status(400).json(errors);
	}
	// funcion del middleware, q dice a la sgte validacion  
	next();
}

module.exports = {
	validateFields
}
