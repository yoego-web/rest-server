
// Requerimos las varaibles de entorno personalizadas
require('dotenv').config();
const Server = require('./models/server');

const server = new Server();
server.listen();

