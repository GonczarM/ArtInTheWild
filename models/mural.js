const mongoose = require('mongoose');


const muralSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	artist: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	affiliation: {
		type: String
	},
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	photos: [{
		type: String
	}]
}, {
	timestamps: true
})

const Mural = mongoose.model('Mural', muralSchema);

module.exports = Mural;