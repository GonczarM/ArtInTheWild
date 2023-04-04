import React, { useState } from 'react';

const initialMural = {
	title: '',
	artist: '',
	description: '',
	locationDescription: '',
	year: '',
	lat: '',
	lng: ''
}

function CreateMural({ updateMural }){
	const [mural, setMural] = useState(initialMural)

	const handleChange = (event) => {
		setMural({ ...mural, [event.target.name]: event.target.value})
	}

	const handleSubmit = async (mural, event) => {
    event.preventDefault()
    try{
      const createdMural = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(createdMural.status !== 200){
        throw Error(createdMural.statusText)
      }
	  	else{
     		const parsedResponse = await createdMural.json()
				updateMural(parsedResponse.mural)
	  	}
    }
    catch(error){
      console.log(error);
      return error
    }
  }

	return(
		<div>
			<h4>Create Mural</h4>
			<form className="form" onSubmit={(e) => handleSubmit(mural, e)}>
				<label>
					Title:
					<input 
						type="text" 
						name="title"
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={handleChange}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
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