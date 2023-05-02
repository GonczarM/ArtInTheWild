import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'

function MuralSearch(){

	const [search, setSearch] = useState('')
	const [murals, setMurals] = useState(null)

	const updateSearch =(event) => {
		setSearch(event.target.value)
	}

	const searchMurals = async (event) => {
		event.preventDefault()
		const foundMurals = await muralsAPI.searchMurals(search)
		setMurals(foundMurals.murals)
		setSearch('')
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
			{murals && murals.length > 0 && <MuralList 
				murals={murals} 
				muralArtist={murals[0].artist} 
				updatedBy={'search'} 
			/>}
			{murals && !murals.length && <h2>No Murals Found for That Artist</h2>}
		</Container>
	)
}

export default MuralSearch