import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Breadcrumb, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AddressAutofill } from '@mapbox/search-js-react';

import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'
import * as mapboxAPI from '../../utils/mapbox-api'

const EditMural = () => {
	
	const mural = useContext(MuralContext)
	const [form, setForm] = useState(mural)
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingLocation, setIsLoadingLocation] = useState(false)
	const [error, setError] = useState('')
	const user = useContext(UserContext)
	const dispatch = useContext(MuralDispatchContext)
	const { updatedBy, muralId } = useParams()

	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			navigate(`/mural/${updatedBy}/${muralId}`)
		}
	}, [])

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
		setError('Can not get location. Please try again.')
		setIsLoadingLocation(false)
  };

	const handleChange = (event) => {
		setForm({...form, [event.target.id]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		if(form.address && form.zipcode){
			const address = `${form.address} ${form.zipcode}`
			try{
				const coordinates = await mapboxAPI.geocode(address)
				form.longitude = coordinates[0]
				form.latitude = coordinates[1]
			}catch{
				setError('Could not get coordinates. Please try again.')
			}
		}
		try{
			const updatedMural = await muralsAPI.editMural(form, muralId)
			dispatch({
				type: 'changed',
				mural: {...updatedMural.mural, updatedBy: user.username}
			})
			navigate(`/mural/${user.username}/${updatedMural.mural._id}`)
		}catch({message}){
			if(message === 'Unauthorized' || message === 'Forbidden'){
				setError('Unauthorized. Please login and try again.')
			}else{
				setError('Could not edit Mural. Please try again.')
			}
		}finally{
			setIsLoading(prevIsLoading => !prevIsLoading)
		}
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
					{isLoadingLocation ? <Button disabled><Spinner size="sm"/></Button>
					: <Button onClick={handleGetLocation}>Get Location</Button>}
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
					{error && <p>{error}</p>}
					{isLoading ? <Button disabled><Spinner size="sm"/></Button>
					: <Button type='submit'>Edit Mural</Button>}
				</Form>
			</Container>}
		</>
	)
}

export default EditMural