import React, { useState } from 'react';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'

function MuralSearch({updateMural}){
	const [search, setSearch] = useState('')
	const [murals, setMurals] = useState(null)

	const updateSearch =(event) => {
		setSearch(event.target.value)
	}

	const searchMurals = async (event) => {
		event.preventDefault()
		const foundMurals = await muralsAPI.searchMurals(search)
		setMurals(foundMurals.murals)
  }


	return(
		<div>
			<form className="search" onSubmit={searchMurals}>
				<label>
					<input
						type="text"
						name="search"
						value={search}
						onChange={updateSearch}
						required
					/>
				</label>
				<button>Search</button>
			</form>
			{murals && <MuralList murals={murals} updateMural={updateMural} />}
		</div>
	)
}

export default MuralSearch