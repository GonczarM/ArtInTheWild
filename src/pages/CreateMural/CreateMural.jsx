import { useContext, useState } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'

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
	const user = useContext(UserContext)
	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleFile = (event) => {
		setForm({...form, [event.target.name]: event.target.files[0]})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		const address = `${form.address} ${form.zipcode}`
		const results = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`).then(res => res.json())
		const coordinates = results.features[0].geometry.coordinates
		form.longitude = coordinates[0]
		form.latitude = coordinates[1]
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
				<h2>Optional</h2>
				<Form.Group controlId='photo'>
					<Form.Label>Photo</Form.Label>
					<Form.Control
						type="file"
						name="photo"
						onChange={handleFile}
					/>
				</Form.Group>
				<Form.Group controlId='address'>
					<Form.Label>Address</Form.Label>
					<Form.Control
						placeholder='Street Address' 
						type='text'
						name='address'
						value={form.address}
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group controlId='zipcode'>
					<Form.Label>Zipcode</Form.Label>
					<Form.Control 
						placeholder='Zipcode'
						type='text'
						name='zipcode'
						value={form.zipcode}
						onChange={handleChange}
					/>
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Create Mural</Button>}
			</Form>
		</Container>
	)
}

export default CreateMural;