import React, { useState } from 'react';

const EditMural = ({mural, updateMural}) => {

	const [editedMural, setEditedMural] = useState(mural)

	const handleChange = (event) => {
		setEditedMural({...editedMural, [event.target.name]: event.target.value})
	}

	const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      const editResponse = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals/mural/' + mural._id, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(editedMural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(editResponse.status !== 200){
        throw Error(editResponse.statusText)
      }
      const parsedResponse = await editResponse.json()
			updateMural(parsedResponse.mural)
    }
    catch(error){
      console.log(error);
      return error
    }
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
						value={editedMural.title}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						onChange={handleChange}
						value={editedMural.artist}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={handleChange}
						value={editedMural.description}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
						onChange={handleChange}
						value={editedMural.year}
					/>
				</label>
				<br/>
				<button>Update Mural</button>
			</form>
		</div>
	)
}

export default EditMural