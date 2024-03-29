import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Spinner, Image } from 'react-bootstrap';
import { AddressAutofill } from '@mapbox/search-js-react';

import { MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'
import * as mapboxAPI from '../../utils/mapbox-api'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';


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
	const [error, setError] = useState('')
	const user = useContext(UserContext)

	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	const handleGetLocation = () => {
		setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      setError('Can not get location. Not supported')
			setIsLoadingLocation(false)
    }
  };

  const handleSuccess = async (position) => {
		try{
    	const placeName = await mapboxAPI.reverseGeocode(position.coords)
			const words = placeName.split(', ')
			const address = words[0]
			const zipcode = words[2].split(' ')[1]
			setForm({...form, address, zipcode})
		}catch{
			setError('Could not get address. Please try again.')
		}finally{
			setIsLoadingLocation(false)
		}
  };

  const handleError = (error) => {
		if(error.code === 1){
			setError('Please allow location access and try again.')
		}else{
			setError('Can not get location. Please try again.')
		}
		setIsLoadingLocation(false)
  };

	const handleChange = (event) => {
		setForm({ ...form, [event.target.id]: event.target.value})
	}

	const handleFile = (event) => {
		setForm({...form, photo: event.target.files[0]})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		const address = `${form.address} ${form.zipcode}`
		const copyOfForm = {...form}
		try{
			const coordinates = await mapboxAPI.geocode(address)
			copyOfForm.longitude = coordinates[0]
			copyOfForm.latitude = coordinates[1]
		}catch{
			setError('Could not get coordinates. Please try again.')
			setIsLoading(prevIsLoading => !prevIsLoading)
			return
		}
		const data = new FormData()
		for(const prop in copyOfForm){
			data.append(prop, copyOfForm[prop])
		}
		try{
			const createdMural = await muralsAPI.createMural(data)
			dispatch({
				type: 'changed',
				mural: {...createdMural.mural, updatedBy: user ? user.username : 'user'}
			})
			navigate(`/mural/${user ? user.username : 'user'}/${createdMural.mural._id}`)
		}catch{
			setError('Could not create Mural. Please try again.')
		}finally{
			setIsLoading(prevIsLoading => !prevIsLoading)
		}
  }

	return(
		<Container>
			{error && <ErrorMessage error={error} setError={setError} />}
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
				{user && <>
				<Form.Group controlId='photo'>
					<Form.Label>Photo</Form.Label>
					<Form.Control
						type="file"
						name="photo"
						accept="image/*"
						onChange={handleFile}
					/>
				</Form.Group>
				{form.photo && <Image fluid src={URL.createObjectURL(form.photo)} />}
				</>}
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
							required
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
							required
						/>
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Create Mural</Button>}
			</Form>
		</Container>
	)
}

export default CreateMural;