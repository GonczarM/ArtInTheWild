'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Form, Button, Container, Breadcrumb, Spinner } from 'react-bootstrap';
import Link from 'next/link';

import { MuralContext, MuralDispatchContext, UserContext } from '../../../../../utils/contexts';
import * as muralsAPI from '../../../../../utils/murals-api'
import * as mapboxAPI from '../../../../../utils/mapbox-api'
import ErrorMessage from '../../../../../components/ErrorMessage/ErrorMessage';

const AddressAutofill = dynamic(
  () => import('@mapbox/search-js-react').then(mod => mod.AddressAutofill),
  { ssr: false }
)

function muralToFormValues(mural) {
	if(!mural) return mural
	return {
		...mural,
		artist: mural.artist ?? '',
		year: mural.year ?? '',
		description: mural.description ?? '',
		address: mural.address ?? '',
		zipcode: mural.zipcode ?? '',
	}
}

const EditMural = () => {

	const mural = useContext(MuralContext)
	const [form, setForm] = useState(() => muralToFormValues(mural))
	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingLocation, setIsLoadingLocation] = useState(false)
	const [error, setError] = useState('')
	const user = useContext(UserContext)
	const { updatedBy, muralId } = useParams()

	const dispatch = useContext(MuralDispatchContext)

	const router = useRouter()

	useEffect(() => {
		if(!mural){
			router.push(`/mural/${updatedBy}/${muralId}`)
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
		if(error.code === 1){
			setError('Please allow location access and try again.')
		}else{
			setError('Can not get location. Please try again.')
		}
		setIsLoadingLocation(false)
  };

	const handleChange = (event) => {
		setForm({...form, [event.target.id]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		setIsLoading(true)
		const address = `${form.address} ${form.zipcode}`
		let longitude, latitude
		try{
			const coordinates = await mapboxAPI.geocode(address)
			longitude = coordinates[0]
			latitude = coordinates[1]
		}catch{
			setError('Could not get coordinates. Please try again.')
			setIsLoading(prevIsLoading => !prevIsLoading)
			return
		}
		const data = {
			title: form.title,
			artist: form.artist,
			description: form.description,
			address: form.address,
			zipcode: form.zipcode,
			year: form.year ? Number(form.year) : undefined,
			latitude,
			longitude,
		}
		try{
			const updatedMural = await muralsAPI.editMural(data, muralId)
			dispatch({
				type: 'changed',
				mural: {...updatedMural.mural, updatedBy: user.username}
			})
			router.push(`/mural/${user.username}/${updatedMural.mural.documentId}`)
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
			{error && <ErrorMessage error={error} setError={setError} />}
			{form && <Container>
				<Breadcrumb>
					<Breadcrumb.Item linkAs={Link} href={`/user/${updatedBy}`}>{updatedBy}</Breadcrumb.Item>
					<Breadcrumb.Item linkAs={Link} href={`/mural/${updatedBy}/${mural.documentId}`}>{mural.title}</Breadcrumb.Item>
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
							placeholder='Mural Description'
							as="textarea"
							name="description"
							value={form.description}
							onChange={handleChange}
							style={{ height: '7rem' }}
						/>
					</Form.Group>
					{isLoadingLocation ? <Button disabled><Spinner size="sm"/></Button>
					: <Button onClick={handleGetLocation}>Get Location</Button>}
					<Form.Group controlId='address'>
						<Form.Label>Address</Form.Label>
						<AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}>
							<Form.Control
								placeholder='Street Address'
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
						<AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}>
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
			{error && <ErrorMessage error={error} setError={setError} />}
		</>
	)
}

export default EditMural
