import React, { useState } from 'react';
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
		<div>
			<h4>Create Mural</h4>
			<form className="form" onSubmit={handleSubmit}>
				<label>
					Title:
					<input 
						type="text" 
						name="title"
						value={form.title}
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						value={form.artist}
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						value={form.description}
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
						value={form.year}
						onChange={handleChange}
					/>
				</label>
				<br/>
				<button>Create Mural</button>
			</form>
		</div>
	)
}

export default CreateMural;