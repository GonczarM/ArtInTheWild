const express = require('express')
const router = express.Router();
const Mural = require('../models/mural')
const ensureLoggedIn = require('../config/ensureLoggedIn');
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
		console.log(error)
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

module.exports = router;