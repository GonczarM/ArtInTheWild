import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'
import Map from '../../components/Map/Map'

function MuralSearch(){

	const [search, setSearch] = useState('')
	const [murals, setMurals] = useState(null)
	const [artists, setArtists] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showMap, setShowMap] = useState(true)

	useEffect(() => {
		return () => {
      setSearch('')
    };
	}, [])

	const updateSearch = async (event) => {
		setSearch(event.target.value)
		if(event.target.value){
			const foundArtists = await muralsAPI.searchArtists(event.target.value)
			setArtists(foundArtists.artists)
		}else{
			console.log('hello')
			setArtists(null)
			setMurals(null)
		}
	}

	const searchMurals = async (event) => {
		event.preventDefault()
		setArtists(null)
		setIsLoading(true)
		const foundMurals = await muralsAPI.searchMurals(search)
		setMurals(foundMurals.murals)
		setIsLoading(prevIsLoading => !prevIsLoading)
  }

	const searchMuralByArtist = async (event, artist) => {
		event.preventDefault()
		setSearch(artist)
		setArtists(null)
		setIsLoading(true)
		const foundMurals = await muralsAPI.searchMurals(artist)
		setMurals(foundMurals.murals)
		setIsLoading(prevIsLoading => !prevIsLoading)
  }

	return(
		<Container className='text-center'>
			<h1>Search Murals by Artist</h1>
			<Form onSubmit={searchMurals}>
				<Form.Group controlId='search'>
					<Form.Control
						placeholder='search a mural'
						autoComplete='off'
						type="text"
						name="search"
						value={search}
						onChange={updateSearch}
						required
					/>
					<ListGroup>
						{artists && artists.map((artist, i) => <ListGroupItem 
							key={i} 
							onClick={(e) => {
								searchMuralByArtist(e, artist)
							}}
						>{artist}</ListGroupItem>)}
					</ListGroup>
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Search</Button>}
			</Form>
			{murals && !murals.length && <h2>No Murals Found for That Artist</h2>}
			{murals && murals.length > 0 && <>
				<h1 className='text-center'>{murals[0].artist}'s murals</h1>
				<Button onClick={() => setShowMap(!showMap)}>
					{showMap ? 'View List' : 'View Map'}
				</Button>
			</>}
			{showMap 
			? <Map murals={murals} />
			: <MuralList 
					murals={murals} 
					updatedBy={'search'} 
				/>}
		</Container>
	)
}

export default MuralSearch