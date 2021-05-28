
const bcryptjs  = require('bcryptjs');
const User = require('../models/user.model');

/**
 * Todas estas fns se pasaran como argumento al "Route" y por defecto se les pasa un 
 * como parametro 
 * 
 * @param request : es un objeto que guarda info de peticion de http
 * 		q las principales que aqui veremos son
 * 
 * 	> request.method = PUT | POST | DELETE | GET
 * 
 * 	> request.query = variables que se envia a traves de la url en forma de objeto literal
 *       ej: url..?param1=foo&param2=baz&param3=bar
 * 
 *  > request.params = variables que se envian en la url 
 * 		por ejemplo al enviar un "url/:id"  ej: url/1983u4324820 
 * 		se usa mucho para aenviar un id y actualizar al uer q coincida con el :id
 * 
 *  > request.body : se utiliza en las peticiones POST info enviada desde un formulario
 * 			y devuelve un objeto con los datos enviados
 * 
 * @param response : basicamente es la respuesta q enviaremos segun nuestro peticion
 * 
 * 	> response.status(400 | 500 | 200) : colocamos un nro segun haya sido exitoso o no
 * 
 *  > response.status().json( objectInfo ) : asi enviamos un json como respuesta 
 * 
 */

// GET ----------------
const userGetCtrl = async(req, res)=> {  
	const minUsersReturned = 16;
	// req.query > todos los parametros que vienen en la url ..?param1=foo&param2=bar&param3=baz ...
	const { limit = minUsersReturned, from = 0 } = req.query;
	// los usuarios con la propiedad "state:true", son los usuarios activos y los q queremos recuperar
	const query = { state:true };
	// const totalUsers = await User.countDocuments(query);

	// if( isNaN(limit) )

	// retornara toodos los usuarios
	// const users = await User.find(query)
	// 	.skip( Number(from) )
	// 	.limit( Number(limit) );

	/*
		await > es una sentencia bloqueante osea que hasta q no llega una respuesta
			no se pasa al codigo sgte, y como en el codig de arriba tenemos 2 "await"
			lo juntamos en un array "Promise.all", que haga al mismo timpo los 2 y el tiempo de espera 
			es menor, el codigo de arriba es ideal si una respuesta depende de la sgte
	*/
	const [ totalUsers, users ] = await Promise.all([
		User.countDocuments(query),
		User.find(query).skip( Number(from) ).limit( Number(limit) )
	])

	res.json({
		msg: "user API | <GET> Controller",
		total: totalUsers,
		users
	})
}

// POST ---------------
const userPostCtrl = async(req, res)=> {

	const { name, email, password, role } = req.body;
	const user = new User({ name, email, password, role });

	// encriptar la contraseña
	// .genSaltSync(number) : numero de vueltas encryptadas (shuffle) entre 1 - 100 
	const salt = bcryptjs.genSaltSync(2);
	user.password = bcryptjs.hashSync(password, salt);

	// guardamos el nuevo user en la db		
	await user.save();

	res.json({
		msg: "user API | <POST> User SAVED!! ",
		user
	})
}

// PUT ------------
const userPutCtrl = async(req, res)=> {
	const { id } = req.params;

	// excluimos algunas propiedades, que deberian crearse o actualizarse de manera 
	// generica o de una manera mas segura como el password 
	const { _id, password, google, email, ...rest } = req.body;

	// validar conra la base de  datos, esto se usara si 
	// el usuario envia el campo password a actualizar, y el cliente lo enviara 
	//  entonces hay q desencriptarlo de nuevo
	if( password ){
		const salt = bcryptjs.genSaltSync(2);
		rest.password = bcryptjs.hashSync(password, salt);
	}
	// actualizamos los campos q han sido modificados desde el obj que recibimos en la request
	const userToUpdate = await User.findByIdAndUpdate(id, rest);

	res.json({
		msg: "user API | <PUT> Controller, user Updated",
		user: userToUpdate
	})
}

// DELETE ------------
const userDeleteCtrl = async(req, res)=> {

	const { id } = req.params;
	// Eliminarlo totalmente "fisicamente" de la BD
	// const userToDelete = await User.findByIdAndDelete(id);

	// recuperamos "userLogged" de la request esta propiedad la seteamos en 
	// el fn middleware "validateJWT" en la carpeta helpers
	const userLogged = req.userLogged;

	// En este caso desactivamos al usuario pero no lo borramos fisicamente
	// ahora en las app se hace asi ( el usuario no tiene acceso a su perfil y no es publico ni privado esta como eliminado )
	const userDisabled = await User.findByIdAndUpdate(id, { state:false });

	res.json({
		msg: "user API | <DELETE> Controller",
		userDeleted: userDisabled,
		userLogged
	})
}

module.exports = {
	userGetCtrl,
	userDeleteCtrl,
	userPostCtrl,
	userPutCtrl
}