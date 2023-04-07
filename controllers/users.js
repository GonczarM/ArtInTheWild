const express = require('express')
const router = express.Router();
const User = require('../models/user')
const Mural = require('../models/mural')
const jwt = require('jsonwebtoken')
const ensureLoggedIn = require('../config/ensureLoggedIn');

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
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})

// user murals
router.get('/:id', async (req, res, next) => {
		try{
			const foundMurals = await Mural.find({'user': req.params.id})
			res.json({
				stauts: 200,
				murals: foundMurals
			})
		}
		catch(error){
			res.status(400).json({
				status: 400,
				error: error
			})
	  }
})

// user login
router.post('/login', async (req, res, next) => {
	try{
		const foundUser = await User.findOne({'username': req.body.username})
		if(foundUser){
			const token = createJWT(foundUser);
			res.json(token)
		}else{
			res.json({
				status: 401,
			})
		}
	}
	catch(error){
		res.status(400).json({
			error: next(error)
		})
	}		
})

// user delete
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
	try{
		const deletedUser = await User.findByIdAndDelete(req.params.id)
		const deletedUsersMurals = await Mural.deleteMany({'user': req.params.id})
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

// jwt token create
function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = router;