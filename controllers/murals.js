const express = require('express')
const router = express.Router();
const Mural = require('../models/mural')
const ensureLoggedIn = require('../config/ensureLoggedIn');

// Chicago Mural API
// https://dev.socrata.com/foundry/data.cityofchicago.org/we8h-apcf
const API_URL = 'https://data.cityofchicago.org/resource/we8h-apcf.json'

// multer and AWS S3
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
const multer  = require('multer')
const s3 = new S3Client({ region: "us-west-2" })

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})


// create mural
router.post('/', ensureLoggedIn, upload.single('photo'), async (req, res, next) => {
	try{
		if(req.file){
			req.body.photos = []
			req.body.photos.push(req.file.location)
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
		const createdMurals = await Mural.create(murals)
		console.log(createdMurals)
		res.json({
      status: 200,
      mural: createdMurals
    });
  } 
	catch(error){
		console.log(error)
		res.json({
      status: 400,
      error: next(error)
    })
  }	
})

// create mural from API
// router.post('/:id', ensureLoggedIn, upload.single('photo'), async (req, res, next) => {
// 	try{
// 		req.body.photos = []
// 		req.body.photos.push(req.file.location)
// 		console.log(req.body)
// 		// const createdMural = await Mural.create(req.body)
// 		// // createdMural.user = req.user._id
// 		// // createdMural.save()
// 		// res.json({
//     //   status: 200,
//     //   mural: createdMural
//     // });
//   } 
// 	catch(error){
// 		res.json({
//       status: 400,
//       error: next(error)
//     })
//   }	
// })

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
		res.status(400).json({
			status: 400,	
			error: error
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

//show a mural
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

// add photo to mural
router.put('/photo/:id', upload.single('photo'), async (req, res, next) => {
	try {
		const updatedMural = await Mural.findById(req.params.id)
		updatedMural.photos.push(req.file.location)
		updatedMural.save()
		res.json({
			status: 200,
			mural: updatedMural
		})
	} catch (error) {
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

module.exports = router;