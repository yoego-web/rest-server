
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
	role: {
		type: String,
		required: [true, 'EL "Role" es obligatorio']
	}
})

module.exports = model('Role', RoleSchema);


