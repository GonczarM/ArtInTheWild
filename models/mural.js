const mongoose = require('mongoose');

const photosSchema = new mongoose.Schema({
	photo: String,
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
})

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
	address: {
		type: String
	},
	zipcode: {
		type: String
	},
	latitude: {
		type: Number
	},
	longitude: {
		type: Number
	},
	favorite: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	photos: [photosSchema],
	favoritePhoto: {
		type: String
	}
}, {
	timestamps: true
})

const Mural = mongoose.model('Mural', muralSchema);

module.exports = Mural;