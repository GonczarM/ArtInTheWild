import React, { useState } from 'react';
import MuralList from './MuralList'

function MuralSearch({updateMural}){
	const [search, setSearch] = useState('')
	const [murals, setMurals] = useState([])

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
			setMurals(muralsParsed.murals)
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
			<MuralList murals={murals} updateMural={updateMural} />
		</div>
	)
}

export default MuralSearch