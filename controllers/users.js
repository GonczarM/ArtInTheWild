const express = require('express')
const router = express.Router();
const User = require('../models/user')
const Mural = require('../models/mural')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res, next) => {
	const password = req.body.password
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
	const userDbEntry = {}
	userDbEntry.username = req.body.username
	userDbEntry.password = passwordHash
	try{
		const foundUsername = await User.findOne({'username': req.body.username})
		if(foundUsername){
			res.json({
				status: 401,
				user: foundUsername,
			})
		}
		else{
			const createdUser = await User.create(userDbEntry)
			req.session.loggedIn = true
			req.session.UserId = createdUser._id
			req.session.username = req.body.username
			res.json({
				status: 200,
				session: req.session,
				user: createdUser
			})
		}
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: error
		})
	}
})

router.get('/user/:id', async (req, res, next) => {
		try{
			const foundUser = await User.findOne({'murals': req.params.id})
			.populate('murals');
			console.log(foundUser);
			res.json({
				stauts: 200,
				user: foundUser
			})
		}
		catch(error){
			console.log(error);
			res.status(400).json({
				status: 400,
				error: error
			})
	  }
})

// not needed just for testing
// router.get('/', async (req, res, next) => {
// 	try{
// 		const allUsers = await User.find({})
// 		res.json({
// 			status: 200,
// 			users: allUsers
// 		})
// 	}
// 	catch(error){
// 		res.status(400).json({
// 			status: 400,
// 			error: error
// 		})
// 	}
// })

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		if(err){
			res.status(400).json({
				status: 400,
				error: error
			})
		}
		else{
			res.json({
				status: 200
			})
		}
	})
})

router.post('/login', async (req, res, next) => {
	try{
		const foundUser = await User.findOne({'username': req.body.username})
		.populate('murals')
		if(foundUser){
			if(bcrypt.compareSync(req.body.password, foundUser.password) === true){
				req.session.loggedIn = true;
				req.session.userId = foundUser._id;
				req.session.username = req.body.username;
				res.json({
					status: 200,
					session: req.session,
					user: foundUser
				})
			}
			else{
				res.json({
					status: 401,
					pass: req.body.password
				})
			}
		}
		else{
			res.json({
				status: 402,
				user: req.body.username
			})
		}
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: next(error)
		})
	}		
})

router.delete('/user/:id', async (req, res, next) => {
	try{
		const deletedUser = await User.findByIdAndDelete(req.params.id)
		const deletedUsersMurals = await Mural.deleteMany({
			_id: {
				$in: deletedUser.murals
			}
		})
		req.session.destroy()
		res.json({
			status: 200,
			user: deletedUser,
			murals: deletedUsersMurals
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