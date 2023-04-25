import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
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
		<Container className='text-center'>
			<h1>Search Murals by Artist</h1>
			<Form onSubmit={searchMurals}>
				<Form.Group controlId='search'>
					<Form.Control
						placeholder='search a mural'
						type="text"
						name="search"
						value={search}
						onChange={updateSearch}
						required
					/>
				</Form.Group>
				<Button type='submit'>Search</Button>
			</Form>
			{murals && <MuralList murals={murals} updateMural={updateMural} listHeader={search} />}
		</Container>
	)
}

export default MuralSearch