const express = require('express')
const router = express.Router();
const User = require('../models/user')
const Mural = require('../models/mural')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ensureLoggedIn = require('../config/ensureLoggedIn');

// jwt token create
function createJWT(user) {
  return jwt.sign(
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

// user create
router.post('/register', async (req, res, next) => {
	try{
		const createdUser = await User.create(req.body)
		const token = createJWT(createdUser);
		res.json(token)
	}
	catch(error){
		next(error)
	}
})

// user login
router.post('/login', async (req, res, next) => {
	try{
		const foundUser = await User.findOne({'username': req.body.username})
		if (!foundUser){
			const error = {status:409}
			next(error)
		}
		const match = await bcrypt.compare(req.body.password, foundUser.password);
		if (!match) {
			const error = {status:409}
			next(error)
		}
		const token = createJWT(foundUser);
		res.json(token)
	}catch(error){
		next(error)
	}	
})

// user murals
router.get('/murals', async (req, res, next) => {
	try{
		const foundMurals = await Mural.find({'user': req.user._id})
		res.json({
			murals: foundMurals
		})
	}catch(error){
		next(error)
	}
})

// user favorited murals
router.get('/favorites', async (req, res, next) => {
	try {
		const foundMurals = await Mural.find({'favorite': req.user._id})
		res.json({
			murals: foundMurals
		})
	}catch(error){
		next(error)
	}
})

// favorite a mural
router.put('/favorite/:id', ensureLoggedIn, async (req, res, next) => {
	try {
		const foundMural = await Mural.findById(req.params.id)
		foundMural.favorite.push(req.user._id)
		foundMural.save()
		res.json({
			mural: foundMural
		})
	}catch(error){
		next(error)
	}
})

//favorite a mural photo
router.put('/photo/:id', ensureLoggedIn, async (req, res, next) => {
	try {
		const foundMural = await Mural.findOne({'photos._id': req.params.id})
		const photo = foundMural.photos.id(req.params.id)
		photo.likes.push(req.user._id)
		const photoToFind = (photo) => {
			if(photo.photo === foundMural.favoritePhoto){
				return photo
			}
		}
		let favPhoto = foundMural.photos.find(photoToFind)
		for (let i = 0; i < foundMural.photos.length; i++) {
			if(foundMural.photos[i].likes.length > favPhoto.likes.length){
				favPhoto = foundMural.photos[i]
			}
		}
		foundMural.favoritePhoto = favPhoto.photo
		foundMural.save()
		res.json({
			mural: foundMural
		})
	}catch(error){
		next(error)
	}
})

// user delete
router.delete('/', ensureLoggedIn, async (req, res, next) => {
	try{
		const deletedUser = await User.findByIdAndDelete(req.user._id)
		const deletedUsersMurals = await Mural.deleteMany({'user': req.user._id})
		deletedUser.murals = deletedUsersMurals
		res.json({
			status: 200,
			user: deletedUser
		}) 
	}catch(error){
		next(error)
	}
})

module.exports = router;