import { useEffect, useState } from 'react';
import { Button, Container, Form, ListGroup, ListGroupItem, Spinner } from 'react-bootstrap';

import * as muralsAPI from '../../utils/murals-api'
import MuralList from '../../components/MuralList/MuralList'
import Map from '../../components/Map/Map'

const initialSearch = {type: 'artist', term: ''}

function MuralSearch(){

	const [search, setSearch] = useState(initialSearch)
	const [murals, setMurals] = useState(null)
	const [searchList, setSearchList] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showMap, setShowMap] = useState(true)
	const [searched, setSearched] = useState(false)
	const [address, setAddress] = useState({})
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
		setSearch({...search, term:''})
		setSearched(false)
		setAddress({})
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
			setMurals(null)
			setSearched(false)
		}
	}

	const searchMurals = async (event, term) => {
		event.preventDefault()
		setIsLoading(true)
		setSearchList(null)
		let foundMurals
		try{
			if(!term){
				foundMurals = await muralsAPI.searchMurals(search)
			}else{
				foundMurals = await muralsAPI.searchMurals({...search, term})
			}
			const foundAddress = foundMurals.murals.find(checkAddress)
			setAddress(foundAddress)
			setMurals(foundMurals.murals)
			setSearched(true)
		}catch{
			setError('Could not search Murals. Please try again.')
		}finally{
			setIsLoading(prevIsLoading => !prevIsLoading)
		}
  }

	const checkAddress = (mural) => {
		if(mural.address){
			return mural
		}
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
					{murals && murals.length > 0 && searched && <Button onClick={resetSearch}>Reset Search</Button>}
					{searchList && <ListGroup>
						{searchList.map((term, i) => <ListGroupItem 
							key={i} 
							onClick={(e) => {
								searchMurals(e, term)
							}}
						>{term}</ListGroupItem>)}
					</ListGroup>}
				</Form.Group>
				{isLoading ? <Button disabled><Spinner size="sm"/></Button>
				: <Button type='submit'>Search</Button>}
				{error && <p>{error}</p>}
			</Form>
			{murals && !murals.length && <h2>No Murals Found from that {search.type}</h2>}
			{murals && murals.length > 0 && searched && <>
				<h1 className='text-center'>{murals[0].artist}'s murals</h1>
				{address && <Button onClick={() => setShowMap(!showMap)}>
					{showMap ? 'View List' : 'View Map'}
				</Button>}
			</>}
			{showMap && address
			? <Map 
					murals={murals} 
					geometry={!searched ? 
						{longitude: -87.64, latitude: 41.88, zoom: 11.5} : 
						{longitude: address.longitude, latitude: address.latitude, zoom: 11.5}
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