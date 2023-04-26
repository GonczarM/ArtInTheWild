const express = require('express')
const router = express.Router();
const Mural = require('../models/mural')
const User = require('../models/user')
const ensureLoggedIn = require('../config/ensureLoggedIn');

// create mural
router.post('/', ensureLoggedIn, async (req, res, next) => {
	try{
		const createdMural = await Mural.create(req.body)
		createdMural.user = req.user._id
		createdMural.save()
		res.json({
      status: 200,
      mural: createdMural
    });
  } 
	catch(error){
		res.json({
      status: 400,
      error: next(error)
    })
  }	
})

// search mural by artist
router.get('/search/:search', async (req, res, next) => {
	try{
		const searchedMurals = await Mural.find({'artist': req.params.search})
		res.json({
			status: 200,
			murals: searchedMurals
		})
	}
	catch(error){
		next(error)
		res.status(400).json({
			status: 400,	
			error: error
		})
	}
})

// edit mural
router.put('/:id', ensureLoggedIn, async (req, res, next) => {
	try{
		const foundMural = await Mural.findById(req.params.id)
		if(req.user._id === foundMural.user.toString()){
			const updatedMural = await Mural.findByIdAndUpdate(req.params.id, req.body, {new: true});
			res.json({
				status: 200,
				mural: updatedMural
			})
		}else{
			res.json({
				status: 401
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

// delete mural
router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
	try{
		const foundMural = await Mural.findById(req.params.id)
		if(req.user._id === foundMural.user.toString()){
			const deletedMural = await Mural.findByIdAndDelete(req.params.id)
			res.json({
				status: 200,
				mural: deletedMural
			})
		}else{
			res.json({
				status: 401
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

router.get('/:id', async (req, res, next) => {
	try {
		const foundMural = await Mural.findById(req.params.id)
		res.json({
			status: 200,
			mural: foundMural
		})
	} catch (error) {
		res.status(400).json({
			status: 400,
			error: next(error)
		})
	}
})

module.exports = router;