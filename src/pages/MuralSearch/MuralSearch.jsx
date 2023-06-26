import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';

import * as muralsAPI from '../../utils/murals-api'
import MuralList from '../../components/MuralList/MuralList'
import Map from '../../components/Map/Map'

const initialSearch = {type: 'artist', term: '', hasSearched: false}

function MuralSearch(){

	const [search, setSearch] = useState(initialSearch)
	const [murals, setMurals] = useState(null)
	const [searchList, setSearchList] = useState(null)
	const [showMap, setShowMap] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if(!murals){
			getMurals()
		}
		return () => {
      setSearch(initialSearch)
    };
	}, [])

	const resetSearch = () => {
		getMurals()
		setShowMap(true)
		setSearch({...search, term:'', hasSearched: false})
	}

	const getMurals = async () => {
		try{
			const muralsRes = await muralsAPI.getMurals()
			const filteredMurals = muralsRes.murals.filter(mural => {
				if(mural.longitude && mural.latitude && mural.title){
					return mural
				}
			})
			setMurals(filteredMurals)
		}catch{
			setError('Could not get Murals. Please try again.')
		}
  }

	const updateSearch = async (event) => {
		setSearch({...search, term:event.target.value})
		if(event.target.value){
			try{
				const foundSearchList = await muralsAPI.searchMuralsByType({...search, term:event.target.value})
				setSearchList(foundSearchList.searchList)
			}catch{
				setError('Could not search Murals. Please try again.')
			}
		}else{
			setSearchList(null)
			getMurals()
			setSearch(prevSearch => {return {...prevSearch, hasSearched: false}})
		}
	}

	const searchMurals = async (event, term) => {
		if(event){
				event.preventDefault()
			}
		setIsLoading(true)
		setSearchList(null)
		let foundMurals
		const target = event.target
		try{
			if(target.innerText === 'Artist' || target.innerText === 'Title' || target.innerText === 'Zipcode'){
				foundMurals = await muralsAPI.searchMurals({...search, type: target.innerText.toLowerCase()})
			}else if(target.tagName === 'FORM'){
				foundMurals = await muralsAPI.searchMurals({...search})
			}else{
				foundMurals = await muralsAPI.searchMurals({...search, term: target.innerText})
			}
			setMurals(foundMurals.murals)
			setSearch((prevSearch) => {return {...prevSearch, term: term ? term : prevSearch.term, hasSearched: true}})
		}catch{
			setError('Could not search Murals. Please try again.')
		}finally{
			setIsLoading(prevIsLoading => !prevIsLoading)
		}
  }

	const updateSearchTerm = (e, type) => {
		setSearch({...search, type})
		if(search.term){
			searchMurals(e)
		}
	}

	return(
		<Container className='text-center'>
			<h1>Search Murals by...</h1>
			<Button 
				variant={search.type === 'artist' ? "outline-dark active" : 'primary'} 
				onClick={(e) => updateSearchTerm(e, 'artist')}
			>Artist</Button>
			<Button 
				variant={search.type === 'title' ? "outline-dark active" : 'primary'} 
				onClick={(e) => updateSearchTerm(e, 'title')}
			>Title</Button>
			<Button 
				variant={search.type === 'zipcode' ? "outline-dark active" : 'primary'} 
				onClick={(e) => updateSearchTerm(e, 'zipcode')}
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
					{searchList && <ListGroup>
						{searchList.map((term, i) => <ListGroupItem 
							key={i} 
							onClick={(e) => {
								searchMurals(e, term)
							}}
							>{term}</ListGroupItem>)}
					</ListGroup>}
					{search.hasSearched && <Button onClick={resetSearch}>Reset Search</Button>}
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Search</Button>}
				{error && <p>{error}</p>}
			</Form>
			{murals && !murals.length && <h2>No Murals Found from that {search.type}</h2>}
			{murals && murals.length > 0 && search.hasSearched && <>
				{search.type === 'artist' && <h1 className='text-center'>{murals[0].artist}'s murals</h1>}
				{search.type === 'title' && <h1 className='text-center'>Mural {murals[0].title}</h1>}
				{search.type === 'zipcode' && <h1 className='text-center'>Murals in {murals[0].zipcode}</h1>}
				<Button onClick={() => setShowMap(!showMap)}>
					{showMap ? 'View List' : 'View Map'}
				</Button>
			</>}
			{showMap && murals && murals.length > 0
			? <Map 
					murals={murals} 
					geometry={!search.hasSearched ? 
						{longitude: -87.64, latitude: 41.88, zoom: 11.5} : 
						{longitude: murals[0].longitude, latitude: murals[0].latitude, zoom: 11.5}
					}
					search 
				/>
			: <MuralList 
					murals={murals} 
					updatedBy={'search'}
				/>}
		</Container>
	)
}

export default MuralSearch