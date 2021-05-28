
/*
	Validator si esxiste el "Role" ingresado o esta registrado en la BD 

*/
const Role = require('../models/role.model');
const User = require('../models/user.model');

/*
	Buscar un rol registrado en la base de datos, 
*/ 
const findAndValidateRoleInDB = async( role )=> {
	
	const issetRole = await Role.findOne({ role });
	if( !issetRole ){
		throw new Error(`El rol : ${role} no esta registrado en la BD`);
	}
}

/*
	verificar que el email ingresado nno existe en la BD todos los email son unicos
*/
const checkUniqueEmail = async( email = '')=> {
	//   .findOne > metodo de mongoose proveniente de "Schema" busca en la DB mongo
	const searchEmail = await User.findOne({ email });

	if( searchEmail ){
		throw new Error(`El correo ${email} ya esta registrado`);
	}
}

/*
	Buscar un ID q exista en el DB en caso de q exista 
*/
const searchIdUserInDB = async( id )=> {

	// .findById > metodo de Schema mongo
	const issetIDuser = await User.findById(id);
	if( !issetIDuser ){
		throw new Error(`No existe usuario con el id: ${id}`);
	}
}

module.exports = {
	findAndValidateRoleInDB,
	checkUniqueEmail,
	searchIdUserInDB
}
