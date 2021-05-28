
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

	app = null;
	port = null;

	constructor(){
		this.port = process.env.PORT;
		this.app = express();
		// API de gestion de users
		this.usersPath = '/api/users';
		// API de login, autenticacion
		this.authPath = '/api/auth';

		// Conectar con la DataBase
		this.connectDB();

		// Middlewares 
		this.middlewares();

		// Routes
		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	routes(){

		this.app.use(this.usersPath, require('../routes/user.route'));
		this.app.use(this.authPath, require('../routes/auth.route'));
	}

	listen(){
		this.app.listen(this.port, ()=> {
			console.log(`Server escuchando en el "localhost:${ this.port }"`);
		});
	}

	middlewares(){
		// CORS
		this.app.use( cors() );
		// Lectura y parseo del body JSON ( conf ), cualquier peticion lo leera y serializara como json
		this.app.use( express.json() );
		// Uso del directorio publico, buscara el "index.html" y lo renderizara
		this.app.use( express.static('public'));
	}

}

module.exports = Server;