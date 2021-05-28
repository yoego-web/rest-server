// requerimos "mongoose"
const mongoose = require('mongoose');

const dbConnection = async()=> {

	try{
		// conf recomendado por mongoose ver la pag en la documentacion
		await mongoose.connect( process.env.MONGO_ATLAS_CONNECT, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})

		console.log('Connect SUCCESS!!!');

	} catch(err){
		console.log(err);
		throw new Error('Error de conexion con DB');
	}

}

module.exports = {
	dbConnection
}
