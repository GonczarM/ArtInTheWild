import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { AddressAutofill } from '@mapbox/search-js-react';

import { MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'
import * as mapboxAPI from '../../utils/mapbox-api'


const initialForm = {
	title: '',
	artist: '',
	description: '',
	year: '',
	photo: '',
	latitude: '',
	longitude: '',
	address: '',
	zipcode: ''
}

function CreateMural(){

	const [form, setForm] = useState(initialForm)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingLocation, setIsLoadingLocation] = useState(false)
	const user = useContext(UserContext)
	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	const handleGetLocation = () => {
		setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      console.log('not supported')
			setIsLoadingLocation(false)
    }
  };

  const handleSuccess = async (position) => {
    const placeName = await mapboxAPI.reverseGeocode(position.coords)
		const words = placeName.split(', ')
		const address = words[0]
		const zipcode = words[2].split(' ')[1]
		setForm({...form, address, zipcode})
		setIsLoadingLocation(false)
  };

  const handleError = (error) => {
		console.log(error)
		setIsLoadingLocation(false)
  };

	const handleChange = (event) => {
		setForm({ ...form, [event.target.id]: event.target.value})
	}

	const handleFile = (event) => {
		setForm({...form, [event.target.name]: event.target.files[0]})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		if(form.address && form.zipcode){
			const address = `${form.address} ${form.zipcode}`
			const coordinates = await mapboxAPI.geocode(address)
			form.longitude = coordinates[0]
			form.latitude = coordinates[1]
		}
		const data = new FormData()
		for(const prop in form){
			data.append(prop, form[prop])
		}
		const createdMural = await muralsAPI.createMural(data)
		dispatch({
			type: 'changed',
			mural: {...createdMural.mural, updatedBy: user.username}
		})
		setForm(initialForm)
		setIsLoading(prevIsLoading => !prevIsLoading)
		navigate(`/mural/${user.username}/${createdMural.mural._id}`)
  }

	return(
		<Container>
			<h1 className='text-center'>Create Mural</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId='title'>
					<Form.Label>Title</Form.Label>
					<Form.Control
						placeholder='Title of Mural'
						type="text" 
						name="title"
						value={form.title}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group controlId='artist'>
					<Form.Label>Artist</Form.Label>
					<Form.Control
						placeholder='Mural Artist'
						type="text"
						name="artist"
						value={form.artist}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group controlId='year'>
					<Form.Label>Year Installed</Form.Label>
					<Form.Control
						placeholder='Year Mural was Installed'
						type="number"
						name="year"
						value={form.year}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group controlId='description'>
					<Form.Label>Description</Form.Label>
					<Form.Control
						placeholder='Description of Mural'
						as="textarea"
						name="description"
						value={form.description}
						onChange={handleChange}
						style={{ height: '7rem' }}
						required
					/>
				</Form.Group>
				<h2 className='text-center'>Optional</h2>
				<Form.Group controlId='photo'>
					<Form.Label>Photo</Form.Label>
					<Form.Control
						type="file"
						name="photo"
						onChange={handleFile}
					/>
				</Form.Group>
				{isLoadingLocation ? <Button disabled><Spinner size="sm"/></Button>
				: <Button onClick={handleGetLocation}>Get Location</Button>}
				<Form.Group controlId='address'>
					<Form.Label>Address</Form.Label>
					<AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_TOKEN}>
						<Form.Control
							placeholder='Street Address of Mural' 
							type='text'
							name='address'
							value={form.address}
							onChange={handleChange}
							autoComplete='address-line1'
						/>
					</AddressAutofill>
				</Form.Group>
				<Form.Group controlId='zipcode'>
					<Form.Label>Zipcode</Form.Label>
						<Form.Control 
							placeholder='Zipcode of Mural'
							type='text'
							name='zipcode'
							value={form.zipcode}
							onChange={handleChange}
							autoComplete='postal-code'
						/>
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Create Mural</Button>}
			</Form>
		</Container>
	)
}

export default CreateMural;