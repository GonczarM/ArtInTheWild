import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'
import Map from '../../components/Map/Map'

const initialSearch = {type: 'artist', term: ''}

function MuralSearch(){

	const [search, setSearch] = useState(initialSearch)
	const [murals, setMurals] = useState(null)
	const [searchList, setSearchList] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showMap, setShowMap] = useState(true)

	useEffect(() => {
		return () => {
      setSearch(initialSearch)
    };
	}, [])

	const updateSearch = async (event) => {
		setSearch({...search, term:event.target.value})
		if(event.target.value){
			const foundSearchList = await muralsAPI.searchMuralsByType({...search, term:event.target.value})
			setSearchList(foundSearchList.searchList)
		}else{
			setSearchList(null)
			setMurals(null)
		}
	}

	const searchMurals = async (event, term) => {
		event.preventDefault()
		setIsLoading(true)
		setSearchList(null)
		let foundMurals
		if(!term){
			foundMurals = await muralsAPI.searchMurals(search)
		}else{
			foundMurals = await muralsAPI.searchMurals({...search, term})
		}
		setMurals(foundMurals.murals)
		setSearch({...search, term:''})
		setIsLoading(prevIsLoading => !prevIsLoading)
  }

	return(
		<Container className='text-center'>
			<h1>Search Murals by...</h1>
			<Button 
				variant={search.type === 'artist' ? "outline-dark active" : 'primary'} 
				onClick={() => setSearch({...search, type:'artist'})}
			>Artist</Button>
			<Button 
				variant={search.type === 'title' ? "outline-dark active" : 'primary'} 
				onClick={() => setSearch({...search, type:'title'})}
			>Title</Button>
			<Button 
				variant={search.type === 'zipcode' ? "outline-dark active" : 'primary'} 
				onClick={() => setSearch({...search, type:'zipcode'})}
			>Zipcode</Button>
			<Form onSubmit={searchMurals}>
				<Form.Group controlId='search'>
					<Form.Control
						placeholder='search a mural'
						autoComplete='off'
						type="text"
						name="search"
						value={search.term}
						onChange={updateSearch}
						required
					/>
					<ListGroup>
						{searchList && searchList.map((term, i) => <ListGroupItem 
							key={i} 
							onClick={(e) => {
								searchMurals(e, term)
							}}
						>{term}</ListGroupItem>)}
					</ListGroup>
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Search</Button>}
			</Form>
			{murals && !murals.length && <h2>No Murals Found from that {search.type}</h2>}
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