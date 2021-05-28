
/*
	ROUTE : athenticacion de un Usuario

	> Router : nos servira para configurar las rutas 

	> check : libreria para validar campos q se se ejecutan como "middlewares"

	> POST : solo usaremos esta peticion ya que se enviara una autenticcacion a trves de 
		de un formulario 

	Libreria VALIDATOR "express-validator"

	check > fn que como argumento recibe la propiedad a validar o el parametro de la url
		ej: url/someDirection/:miVaraibleEnLaUrl 

	* validateFields > nombramos a esta funcion para que sea la encargada de revisar
		q cada validacion se cumpla sino envia un o varios error de validacion

*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { login } = require('../controllers/auth.ctrl');

const router = Router();

// POST -------
router.post('/login', [
	check('email', 'El email no es valido').isEmail(),
	check('password', 'La contraseña es obligatoria').not().isEmpty(),
	validateFields
], login );

module.exports = router;