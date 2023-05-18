import { useContext, useEffect, useState } from 'react';
import { Form, Button, Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'
import { AddressAutofill } from '@mapbox/search-js-react';

const EditMural = () => {
	
	const mural = useContext(MuralContext)
	const [form, setForm] = useState(mural)
	const [isLoading, setIsLoading] = useState(false)
	const user = useContext(UserContext)
	const dispatch = useContext(MuralDispatchContext)
	const { updatedBy, muralId } = useParams()

	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			navigate(`/mural/${updatedBy}/${muralId}`)
		}
	}, [])

	const handleChange = (event) => {
		setForm({...form, [event.target.id]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		const address = `${form.address} ${form.zipcode}`
		const results = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`).then(res => res.json())
		const coordinates = results.features[0].geometry.coordinates
		form.longitude = coordinates[0]
		form.latitude = coordinates[1]
		const updatedMural = await muralsAPI.editMural(form, muralId)
		dispatch({
			type: 'changed',
			mural: {...updatedMural.mural, updatedBy: user.username}
		})
		setIsLoading(prevIsLoading => !prevIsLoading)
		navigate(`/mural/${user.username}/${updatedMural.mural._id}`)
  }

	return(
		<>
			{form && <Container>
				<Breadcrumb>
					<LinkContainer to={`/user/${updatedBy}`}>
							<Breadcrumb.Item >{updatedBy}</Breadcrumb.Item>
					</LinkContainer>
					<LinkContainer to={`/mural/${updatedBy}/${mural._id}`}>
						<Breadcrumb.Item >{mural.title}</Breadcrumb.Item>
					</LinkContainer>
					<Breadcrumb.Item active>Edit</Breadcrumb.Item>
				</Breadcrumb>
				<h1 className='text-center'>Edit Mural</h1>
				<Form onSubmit={handleSubmit}>
					<Form.Group controlId='title'>
						<Form.Label>Title</Form.Label>
						<Form.Control
							placeholder='Mural Title'
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
							placeholder='Mural Description'
							as="textarea"
							name="description"
							value={form.description}
							onChange={handleChange}
							style={{ height: '7rem' }}
							required
						/>
					</Form.Group>
					<Form.Group controlId='address'>
						<Form.Label>Address</Form.Label>
						<AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_TOKEN}>
							<Form.Control
								placeholder='Street Address' 
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
						<AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_TOKEN}>
							<Form.Control 
								placeholder='Zipcode'
								type='text'
								name='zipcode'
								value={form.zipcode}
								onChange={handleChange}
								autoComplete='postal-code'
							/>
						</AddressAutofill>
					</Form.Group>
					{isLoading ? <Button disabled><Spinner size="sm"/></Button>
					: <Button type='submit'>Edit Mural</Button>}
				</Form>
			</Container>}
		</>
	)
}

export default EditMural