import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialMural = {
	title: '',
	artist: '',
	description: '',
	locationDescription: '',
	year: '',
	lat: '',
	lng: ''
}

function CreateMural(props){
	const [mural, setMural] = useState(initialMural)

	const navigate = useNavigate()

	const updateMural = (event) => {
		setMural({ ...mural, [event.target.name]: event.target.value})
	}

	const addMural = async (mural, event) => {
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
      	navigate('/');
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
				<form className="form" onSubmit={(e) => addMural(mural, e)}>
					<label>
						Title:
						<input 
							type="text" 
							name="title"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Artist:
						<input
							type="text"
							name="artist"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Description:
						<input
							type="text"
							name="description"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Location Description:
						<input
							type="text"
							name="locationDescription"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Year Installed:
						<input
							type="number"
							name="year"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Latitude:
						<input
							type="number"
							name="lat"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<label>
						Longitude:
						<input
							type="number"
							name="lng"
							onChange={updateMural}
						/>
					</label>
					<br/>
					<button>Create Mural</button>
				</form>
			</div>
		)
}

export default CreateMural;