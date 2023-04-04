const express = require('express')
const router = express.Router();

router.get('/', async (req, res, next) => {
	try{
		const foundMurals = await superagent
		.get(`https://data.cityofchicago.org/resource/we8h-apcf.json`)
		const arrOfMurals = await JSON.parse(foundMurals.text)
		const filteredArr = arrOfMurals.map(mural => {
			return {
				title: mural.artwork_title,
				artist: mural.artist_credit,
				description: mural.description_of_artwork,
				locationDescription: mural.location_description,
				year: mural.year_installed,
				affiliation: mural.affiliated_or_commissioning, 
				address: mural.street_address,
				lat: mural.latitude,
				lng: mural.longitude,
				zipcode: mural.zip
			}
		})
		res.status(200).json({ 
      status: 200,
      murals: createdMurals
    });
	}
	catch(error){
		res.status(400).json({
      status: 400,
      error: next(error)
    })
	}		
})

router.get('/:prop/:value', async (req, res, next) => {
	try{
		const foundMurals = await superagent
		.get(`https://data.cityofchicago.org/resource/we8h-apcf.json?${req.params.prop}=${req.params.value}`)
		const arrOfMurals = await JSON.parse(foundMurals.text)
		const filteredArr = arrOfMurals.map(mural => {
			return {
				title: mural.artwork_title,
				artist: mural.artist_credit,
				locationDescription: mural.location_description,
				address: mural.street_address,
				zipcode: mural.zip
			}
		})
		res.status(200).json({ 
      		status: 200,
      		murals: filteredArr
    	});
	}
	catch(error){
		res.status(400).json({
      		status: 400,
      		error: error
    	})
	}		
})

module.exports = router;