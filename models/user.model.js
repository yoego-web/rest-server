
/*

	> Schema : es el modelo de dato para configurar cada propiedad
		el tipo, requerimiento y validacion

		unique: con esta propiedad evitamos datos duplicados como por eje un email cada uno es unico

		enum: un array de opciones que puede llevar como valor [ valor, valor2]

	> model : fn que recibe un nombre como 1er parametro de como se llamara el item en este caso "User"
		y como 2d param recibe el Schema

*/

const { Schema, model } = require('mongoose');

/*
	Modelo de datos de Cada User, configuracion 
	de propiedades y de cada valor

{
	name: '',
	email: '',
	password: '',
	image: '',
	role: '',
	state: false,
	google: false
}

*/

const userSchema = Schema({
	name: {
		type: String,
		required: [true, ' "name" es obligatorio']
	},
	email: {
		type: String,
		required: [true, ' "email" es obligatorio'],
		unique: true 
	},
	password: {
		type: String,
		required: [true, ' "password" es obligatorio']
	},
	image: {
		type: String
	},
	role: {
		type: String,
		required: true
	},
	state: {
		type: Boolean,
		default: true
	},
	google: {
		type: Boolean,
		default: false
	}
})

/*
	Aunq esto no es necesario por lo menos en la parte del desarrollo
	lo q hace es removever de la parte visible atrinbutos generados
	por MONGO como __v, _id, en cuanto al password no debe ser visible a la
	hora de enviar una respuesta, por esta azon la info sensible
	como __v, password la retiramos 

	despues renombramos solo en la parte visual el "_id" por "uid"
	osea q en la DB de mongo seguira siendo "_id" pero al retornar info
	se cambiara po "uid" unique identification
*/
userSchema.methods.toJSON = function(){
	const { __v, password, _id, ...user } = this.toObject();
	user.uid = _id; // uid por _id
	return user;
};

module.exports = model('User', userSchema);