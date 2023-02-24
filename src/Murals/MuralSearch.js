import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MuralSearch({ setMural }){
	const [search, setSearch] = useState('')

	const navigate = useNavigate()

	const updateSearch =(event) => {
		setSearch(event.target.value)
	}

	const searchMurals = async (event) => {
		event.preventDefault()
		try{
			const foundMurals = await 
			fetch(`${process.env.REACT_APP_BACKEND_URL}/murals/${search}`, {
				credentials: 'include',
				method: 'GET'
			})
			if(foundMurals.status !== 200){
				throw Error(foundMurals.statusText)
			}
			const muralsParsed = await foundMurals.json()
			setMural(muralsParsed.mural)
			navigate('/mural')

		}
		catch(error){
			console.log(error);
			return error
		}
  	}


	return(
		<div>
			<form className="search" onSubmit={searchMurals}>
				<label>
					<input
						type="text"
						name="search"
						onChange={updateSearch}
					/>
				</label>
				<button>Search</button>
			</form>
		</div>
	)
}

export default MuralSearch