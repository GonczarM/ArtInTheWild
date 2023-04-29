import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'

function MuralSearch({updateMural, searchMurals, updateSearchMurals}){

	const [search, setSearch] = useState('')

	const updateSearch =(event) => {
		setSearch(event.target.value)
	}

	const searchMuralsAPI = async (event) => {
		event.preventDefault()
		const foundMurals = await muralsAPI.searchMurals(search)
		updateSearchMurals(foundMurals.murals)
		setSearch('')
  }

	return(
		<Container className='text-center'>
			<h1>Search Murals by Artist</h1>
			<Form onSubmit={searchMuralsAPI}>
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
			{searchMurals && searchMurals.length > 0 && <MuralList 
				murals={searchMurals} 
				updateMural={updateMural} 
				muralArtist={search} 
				updatedBy={'search'} 
			/>}
			{searchMurals && !searchMurals.length && <h2>No Murals Found for That Artist</h2>}
		</Container>
	)
}

export default MuralSearch