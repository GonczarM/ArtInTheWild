import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import * as muralsAPI from '../../utils/murals-api'

const initialForm = {
	title: '',
	artist: '',
	description: '',
	locationDescription: '',
	year: '',
	lat: '',
	lng: ''
}

function CreateMural({ updateMural }){
	const [form, setForm] = useState(initialForm)

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		const createdMural = await muralsAPI.createMural(form)
		updateMural(createdMural.mural)
  }

	return(
		<>
			<h1>Create Mural</h1>
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
				<Button type='submit'>Create Mural</Button>
			</Form>
		</>
	)
}

export default CreateMural;