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
	},
	description: {
		type: String,
		required: true
	},
	year: {
		type: Number,
	},
	affiliation: {
		type: String
	},
	address: {
		type: String,
		required: true
	},
	zipcode: {
		type: String,
		required: true
	},
	latitude: {
		type: Number,
		required: true
	},
	longitude: {
		type: Number,
		required: true
	},
	favorite: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
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