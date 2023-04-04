import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditMural = ({mural, setMural}) => {

	const [ editedMural, setEditedMural] = useState(mural)

	const navigate = useNavigate()

	const updateMural = (event) => {
		setEditedMural({...editedMural, [event.target.name]: event.target.value})
	}

	const editMural = async (event) => {
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
			setMural(parsedResponse.mural)
			navigate('/mural')
    }
    catch(error){
      console.log(error);
      return error
    }
  }

	return(
		<div>
			<h4>Edit Mural</h4>
			<form className="form" onSubmit={editMural}>
				<label>
					Title:
					<input 
						type="text" 
						name="title"
						onChange={updateMural}
						value={editedMural.title}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						onChange={updateMural}
						value={editedMural.artist}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={updateMural}
						value={editedMural.description}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
						onChange={updateMural}
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