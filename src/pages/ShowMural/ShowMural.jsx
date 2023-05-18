import { useContext, useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Container, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import * as muralsAPI from '../../utils/murals-api'
import * as usersAPI from '../../utils/users-api'
import AddPhoto from '../../components/AddPhoto/AddPhoto'
import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts'
import PhotoList from '../../components/PhotoList/PhotoList'
import Map2 from '../../components/Map2/Map2'

function ShowMural({ updateMurals }){

	const [addPhoto, setAddPhoto] = useState(false);
	const [favoritePhoto, setFavoritePhoto] = useState(null)
	const [imgLoading, setImgLoading] = useState(true)
	const { muralId, updatedBy } = useParams()
	const user = useContext(UserContext)
	const mural = useContext(MuralContext)
	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			getMural()
		}else{
			comparePhotos()
		}
	}, [mural])

	const getMural = async () => {
		const mural = await muralsAPI.getMural(muralId)
		dispatch({
			type: 'changed',
			mural: {...mural.mural, updatedBy}
		})
	}
	
	const comparePhotos = () => {
		let favPhoto = {likes: []}
		for (let i = 0; i < mural.photos.length; i++) {
			if(mural.photos[i].likes.length >= favPhoto.likes.length){
				favPhoto = mural.photos[i]
			}
		}
		setFavoritePhoto(favPhoto.photo)
	}

  const handleDelete = () => {
    muralsAPI.deleteMural(mural._id)
    navigate(`/user/${user.username}`)
  }

	const favoriteMural = async () => {
		const mural = await usersAPI.favoriteMural(muralId)
		if(updatedBy === 'home'){
			updateMurals(mural.mural)
		}
		dispatch({
			type: 'changed',
			mural: {...mural.mural, updatedBy}
		})
	}
	
	const hasUserFavorited = (favoriteUser) => {
		return favoriteUser === user._id || favoriteUser._id === user._id
	}

	let updatedByURL
	if(updatedBy === 'home') {
		updatedByURL = '/'
	} 
	else if(user && updatedBy === user.username){
		updatedByURL = `/user/${user.username}`
	}
	else{
		updatedByURL = `/${updatedBy}`
	}

	return(
		<>
			{mural && <Container>
				<Breadcrumb>
					<LinkContainer to={updatedByURL}>
						<Breadcrumb.Item >{updatedBy}</Breadcrumb.Item>
					</LinkContainer>
					<Breadcrumb.Item active>{mural.title}</Breadcrumb.Item>
				</Breadcrumb>
				<Card className='text-center'>
					{mural.photos && mural.photos.length > 0 && <Card.Img 
						src={favoritePhoto} 
						onLoad={() => setImgLoading(false)}
						style={{ display: imgLoading ? 'none' : 'block'}}
					/>}
					{mural.photos && mural.photos.length > 0 && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
					<Card.Body>
						<Card.Title >{mural.title}</Card.Title>
						<Card.Subtitle>by {mural.artist}</Card.Subtitle>
						<Card.Text>{mural.year}</Card.Text>
						<Card.Subtitle>Description</Card.Subtitle>
						<Card.Text>{mural.description}</Card.Text>
						{mural.affiliation && 
						<>
							<Card.Subtitle>Affiliation</Card.Subtitle>
							<Card.Text>{mural.affiliation}</Card.Text>
						</>}
						{mural.address && 
						<>
							<Card.Subtitle>Address</Card.Subtitle>
							<Card.Text>{mural.address}</Card.Text>
						</>}
						{mural.zipcode && 
						<>
							<Card.Subtitle>ZIP Code</Card.Subtitle>
							<Card.Text>{mural.zipcode}</Card.Text>
						</>}
						{user && !mural.favorite.some(hasUserFavorited) && mural.user !== user._id ? 
						<>
							<Button onClick={favoriteMural}>Favorite Mural</Button><br></br>
						</>
						:
						<>
							<span>{mural.favorite.length}</span>
							<Button variant='outline' className='bi bi-suit-heart-fill'></Button><br></br>
						</>
						}
						{user && <><Button onClick={() => setAddPhoto(true)}>Add Photo</Button><br></br></>}
						{user && mural.user === user._id &&
						<>
							<Button
								variant='secondary' 
								onClick={() => navigate(`/mural/edit/${updatedBy}/${mural._id}`)}
							>
								Edit Mural
							</Button><br></br>
							<Button variant='danger' onClick={handleDelete}>Delete Mural</Button>
						</>}
						<Map2 mural={mural} />
					</Card.Body>
				</Card>
				{addPhoto && <AddPhoto 
					handleClose={() => setAddPhoto(false)} 
					addPhoto={addPhoto} 
					updateMurals={updateMurals} 
				/>}
				{mural.photos && mural.photos.length > 0 && 
					<>
					<h1 className='text-center'>{mural.title} Photos</h1>
					<PhotoList mural={mural} />
					</>
				}
			</Container>}
		</>
	)
}

export default ShowMural;