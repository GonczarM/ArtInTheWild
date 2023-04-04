const mongoose = require('mongoose');
const Mural = require('./mural')

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	murals:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Mural'
	}]
})

const User = mongoose.model('User', userSchema);

module.exports = User;