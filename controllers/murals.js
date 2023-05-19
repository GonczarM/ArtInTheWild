const express = require('express')
const router = express.Router();
const Mural = require('../models/mural')
const ensureLoggedIn = require('../config/ensureLoggedIn');
const upload = require('../config/S3upload')
// Chicago Mural API
// https://dev.socrata.com/foundry/data.cityofchicago.org/we8h-apcf
const API_URL = 'https://data.cityofchicago.org/resource/we8h-apcf.json'

// create mural
router.post('/', ensureLoggedIn, upload.single('photo'), async (req, res, next) => {
	try{
		if(req.file){
			req.body.photos = []
			req.body.photos.push({photo: req.file.location})
		}
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

//seed api
router.get('/seed', async (req, res, next) => {
	try{
		const APIMurals = await fetch(API_URL).then(response => response.json());
		const murals = []
		for(const APIMural of APIMurals){
			if(
				APIMural.artwork_title &&
				APIMural.artist_credit && 
				APIMural.description_of_artwork && 
				APIMural.year_installed
			){
				const mural = {
					title: APIMural.artwork_title,
					artist: APIMural.artist_credit,
					description: APIMural.description_of_artwork,
					year: APIMural.year_installed,
					affiliation: APIMural.affiliated_or_commissioning,
					address: APIMural.street_address,
					zipcode: APIMural.zip,
					latitude: APIMural.latitude,
					longitude: APIMural.longitude
				}
				murals.push(mural)
			}
		}
		const outputArr = murals.reduce((acc, curr) => {
			const isDuplicate = acc.some(mural => mural.title === curr.title);
			if (!isDuplicate) {
				acc.push(curr);
			}
			return acc;
		}, []);
		const createdMurals = await Mural.create(outputArr)
		res.json({
      status: 200,
      mural: createdMurals
    });
  } 
	catch(error){
		res.json({
      status: 400,
      error: next(error)
    })
  }	
})

// get all murals
router.get('/', async (req, res, next) => {
	try{
		const murals = await Mural.find({})
		res.json({
			status: 200,
			murals: murals
		})
	}
	catch(error){
		next(error)
		res.json({
			status: 400,	
			error: error
		})
	}
})

// search murals by type with term
router.get('/search/:type/:term', async (req, res, next) => {
	try{
		const searchedMurals = await Mural.find({[req.params.type]: req.params.term})
		res.json({
			status: 200,
			murals: searchedMurals
		})
	}
	catch(error){
		next(error)
		res.json({
			status: 400,	
			error: error
		})
	}
})

// show list of types by term 
router.get('/list/:type/:term', async (req, res, next) => {
	try {
		const searchedMurals = await Mural.find({
			[req.params.type]: { $regex: new RegExp(req.params.term, 'i') }
		});
		const searchList = []
		searchedMurals.forEach(mural => {
			if(searchList.length >= 10){
				return
			}else if(!searchList.includes(mural[req.params.type])){
				searchList.push(mural[req.params.type])
			}
		})
		res.json({
			status: 200,
			searchList
		})
	} catch (error) {
		console.log(error)
		next(error)
		res.json({
			status: 400,	
			error: error
		})
	}
})

//get murals that have photos
router.get('/photo', async (req, res, next) => {
	try {
		const foundMurals = await Mural.find({ photos: { $exists: true, $ne: [] }})
		res.json({
			status: 200,
			murals: foundMurals
		})
	} catch (error) {
		res.json({
			status: 400,
			error: next(error)
		})
	}
})

//show a mural
router.get('/:id', async (req, res, next) => {
	try {
		const foundMural = await Mural.findById(req.params.id)
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
	res.json({
      status: 400,
      error: next(error)
    })
  }			
})

// add photo to mural
router.put('/photo/:id', ensureLoggedIn, upload.single('photo'), async (req, res, next) => {
	try {
		const updatedMural = await Mural.findById(req.params.id)
		updatedMural.photos.push({photo: req.file.location})
		updatedMural.save()
		res.json({
			status: 200,
			mural: updatedMural
		})
	} catch (error) {
		res.json({
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
		res.json({
			status: 400,
			error: next(error)
		})
	}		
})

module.exports = router;