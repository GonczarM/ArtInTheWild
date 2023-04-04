const express = require('express')
const router = express.Router();
const Mural = require('../models/mural')
const User = require('../models/user')


// router.post('/image-upload', (req, res) => {
// 	console.log(req.files);
// 	const values = Object.values(req.files)
// 	console.log(values);
//   const promises = values.map(image => cloudinary.uploader.upload(image.path))
//   console.log(promises);
//   Promise
//     .all(promises)
//     .then(results => res.json(results))
// })

// const path = Object.values(Object.values(req.files)[0])[0].path
//   cloudinary.uploader.upload(path)
//     .then(image => res.json([image]))

router.post('/', async (req, res, next) => {
	try{
		console.log(req.session)
		const foundUser = await User.findById(req.session.userId)
		console.log(foundUser)
		const createdMural = await Mural.create(req.body)
		console.log(createdMural)
		foundUser.murals.push(createdMural)
		foundUser.save()
		res.json({
      		status: 200,
      		mural: createdMural,
      		user: foundUser
    	});
  	} 
	catch(error){
		res.json({
      		status: 400,
      		error: next(error)
    	})
  	}	
})


router.get('/:search', async (req, res, next) => {
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

router.get('/home', async (req, res, next) => {
	try{
		const allMurals = await Mural.find()
		res.json({
			status: 200,
			murals: allMurals
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: next(error)
		})
	}
})

router.put('/mural/:id', async (req, res, next) => {
	try{
		const updatedMural = await Mural.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.json({
			status: 200,
			mural: updatedMural
		})
	}
	catch(error){
	res.status(400).json({
      status: 400,
      error: next(error)
    })
  }			
})

router.delete('/mural/:id', async (req, res, next) => {
	try{
		const deletedMural = await Mural.findByIdAndDelete(req.params.id)
		res.json({
			status: 200,
			mural: deletedMural
		})
	}
	catch(error){
		res.status(400).json({
			status: 400,
			error: next(error)
		})
	}		
})

module.exports = router;