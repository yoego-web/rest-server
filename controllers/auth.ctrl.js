
/*
	URL : AUTH Controller

	JSONWEBTOKEN > es un libreria q genera un token de sesion 'npm i jsonwebtoken'

*/
const User = require('../models/user.model');
const bcryptjs  = require('bcryptjs');
const { generateJWT } = require('../helpers/generate-jwt');

const login = async(req, res )=> {
	try{

		const { email, password } = req.body;

		const user = await User.findOne({ email });
		//  verfificar si el mail recibido existe
		if( !user ){
			return res.status(500).json({
				msg: "Usuario / Password no son correctos"
			})
		}

		// Si el usuario no esta activo osea q se dio de baja en la cuenta
		if( user.state === false ){
			return res.status(500).json({
				msg: "Login | Esta cuenta fue dada de baja o desactivada"
			})
		}

		// Verificar si la Password recibida existe en la BD
		const validatePass = bcryptjs.compareSync( password, user.password );
		if( !validatePass ){
			return res.status(500).json({
				msg: "Password el password no es correcto"
			})
		}

		// Generar el JSONWEBTOKEN 'jwt'
		const token = await generateJWT( user.id );

		res.json({
			user,
			token
		})

	} catch(err) {
		console.log(err);

		return res.status(500).json({
			msg: 'Hable con el Administrador'
		})
	}

	res.json({
		msg: 'Login OK'
	})
}

module.exports = {
	login
}
