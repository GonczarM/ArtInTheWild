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
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

// user create
router.post('/register', async (req, res, next) => {
	try{
		const foundUsername = await User.findOne({'username': req.body.username})
		if(foundUsername){
			res.json({
				status: 401,
				user: foundUsername,
			})
		}
		else{
			const createdUser = await User.create(req.body)
			const token = createJWT(createdUser);
			res.json(token)
		}
	}
	catch(error){
		res.json({
			status: 400,
			error: error
		})
	}
})

// user login
router.post('/login', async (req, res, next) => {
	try{
		const foundUser = await User.findOne({'username': req.body.username})
		if (!foundUser) throw new Error();
		const match = await bcrypt.compare(req.body.password, foundUser.password);
		if (!match) throw new Error();
		const token = createJWT(foundUser);
		res.json(token)
	}
	catch(error){
		res.json({
			status: 400,
			error: error
		})
	}		
})

// user murals
router.get('/murals', async (req, res, next) => {
		try{
			const foundMurals = await Mural.find({'user': req.user._id})
			res.json({
				status: 200,
				murals: foundMurals
			})
		}
		catch(error){
			res.json({
				status: 400,
				error: error
			})
	  }
})

// user favorited murals
router.get('/favorites', async (req, res, next) => {
	try {
		const foundMurals = await Mural.find({'favorite': req.user._id})
		res.json({
			status: 200,
			murals: foundMurals
		})
	}
	catch(error){
		res.json({
			status: 400,
			error: error
		})
	}
})

// favorite a mural
router.put('/favorite/:id', ensureLoggedIn, async (req, res, next) => {
	try {
		const foundMural = await Mural.findById(req.params.id)
		foundMural.favorite.push(req.user._id)
		foundMural.save()
		res.json({
			status: 200,
			mural: foundMural
		})
	} catch (error) {
		res.json({
			status: 400,
			error: next(error)
		})
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
	}
	catch(error){
		res.json({
			status: 400,
			error: next(error)
		})
	}
})

module.exports = router;