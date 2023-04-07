import React, { useState } from 'react';
import * as muralsAPI from '../../utils/murals-api'

const EditMural = ({mural, updateMural}) => {

	const [form, setForm] = useState(mural)

	const handleChange = (event) => {
		setForm({...form, [event.target.name]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
		const updatedMural = await muralsAPI.editMural(form, mural._id)
		updateMural(updatedMural.mural)
  }

	return(
		<div>
			<h4>Edit Mural</h4>
			<form className="form" onSubmit={handleSubmit}>
				<label>
					Title:
					<input 
						type="text" 
						name="title"
						onChange={handleChange}
						value={form.title}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						onChange={handleChange}
						value={form.artist}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={handleChange}
						value={form.description}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
						onChange={handleChange}
						value={form.year}
					/>
				</label>
				<br/>
				<button>Update Mural</button>
			</form>
		</div>
	)
}

export default EditMural