const mongoose = require('mongoose');

const muralSchema = new mongoose.Schema({
	title: {
		type: String
	},
	artist: {
		type: String
	},
	image: {
		Type: String
	},
	description: {
		type: String
	},
	locationDescription: {
		type: String
	},
	year: {
		type: Number
	},
	affiliation: {
		type: String
	},
	address: {
		type: String
	},
	zipcode: {
		type: Number
	},
	lat: {
		type: Number
	},
	lng: {
		type: Number
	}
})

const Mural = mongoose.model('Mural', muralSchema);

module.exports = Mural;