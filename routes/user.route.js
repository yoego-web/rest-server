/*
	> Router : nos servira para configurar las rutas 

	> check : libreria para validar campos q se se ejecutan como "middlewares"

*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT } = require('../helpers/validate-jwt');
const { isAdminRole, userHasRole } = require('../middlewares/validate-role');
const { validateFields } = require('../middlewares/validate-fields');
const { 
	findAndValidateRoleInDB, 
	checkUniqueEmail, 
	searchIdUserInDB 
} = require('../helpers/db-validator');

const { 
	userGetCtrl,
	userDeleteCtrl,
	userPostCtrl,
	userPutCtrl
} = require('../controllers/user.controller');

const router = Router();

/*
	NOTAS ---
	*1 > verificaos que es un ID valido de Mongo
	*2 > Buscamos q dicho ID exista en la BD
*/

// GET --------------
router.get('/', userGetCtrl );

// PUT -----------
router.put('/:id', [
	check('id', 'No es un ID valido').isMongoId(), // NOTA *1
	check('id').custom( searchIdUserInDB ), // NOTA *2
	check('role').custom( findAndValidateRoleInDB ),
	validateFields
], userPutCtrl );

// POST ---------------------
// Enviamos un middleware "check" que es parecido a un "hook" la diferencia 
// es que los middleware como "check" ocurren antes de cualquier codigo 
router.post('/', [
	check('name', 'El "nombre" es obligatorio').not().isEmpty(),
	check('password', 'el "Password" es obligatorio y debe contener mas de 5 caracteres').isLength({ min: 5 }),
	check('email', 'El campo "email" no es mail valido').isEmail(),
	check('email').custom( checkUniqueEmail ),
	// check('password', 'el "Password" es obligatorio y debe contener mas de 5 caracteres').matches(/^[a-zA-Z0-9]{5}$/, "i"),
	// check('role', 'Elija un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
	check('role').custom( (role)=> findAndValidateRoleInDB(role) ),
	validateFields
], userPostCtrl );

// DELETE ----------------------
// A diferencia de los otros controladores para borrar / desactivar un user
// se requerira la autenticacion de un token y que el usuario este logado y sea role "super"
router.delete('/:id', [
	validateJWT, // validar JsonWebToken,
	// userHasRole('ADMIN_ROLE', 'SELL_ROLE', 'OTHER_ROLE'), si quermos validar un ROLE en especifico
	isAdminRole,
	check('id', 'No es un ID valido').isMongoId(),
	check('id').custom( searchIdUserInDB ),
	validateFields
], userDeleteCtrl );

module.exports = router;