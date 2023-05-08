import { useContext, useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Container, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import * as muralsAPI from '../../utils/murals-api'
import AddPhoto from '../../components/AddPhoto/AddPhoto'
import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts'
import PhotoList from '../../components/PhotoList/PhotoList'

function ShowMural({ updateMurals }){

	const [addPhoto, setAddPhoto] = useState(false);
	const [imgLoading, setImgLoading] = useState(true)
	const { muralId, updatedBy } = useParams()
	const user = useContext(UserContext)
	const mural = useContext(MuralContext)
	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			getMural()
		}
	}, [])

	const getMural = async () => {
		const mural = await muralsAPI.getMural(muralId)
		dispatch({
			type: 'changed',
			mural: {...mural.mural, updatedBy}
		})
	}

  const handleDelete = () => {
    muralsAPI.deleteMural(mural._id)
    navigate(`/user/${user.username}`)
  }

	let updatedByURL
	if(updatedBy === 'home' || !user) {
		updatedByURL = '/'
	} 
	else if(user && updatedBy === user.username){
		updatedByURL = `/user/${user.username}`
	}
	else{
		updatedByURL = `/${updatedBy}`
	}

	const photos = mural ? mural.photos.slice(1, mural.photos.length) : null

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
						src={mural.photos[0]} 
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
						{user && mural.user === user._id &&
						<>
							<Button 
								onClick={() => navigate(`/mural/edit/${updatedBy}/${mural._id}`)}
							>
								Edit Mural
							</Button><br></br>
							<Button onClick={handleDelete}>Delete Mural</Button><br></br>
						</>}
						{user && <Button onClick={() => setAddPhoto(true)}>Add Photo</Button>}
					</Card.Body>
				</Card>
				{addPhoto && <AddPhoto 
					handleClose={() => setAddPhoto(false)} 
					addPhoto={addPhoto} 
					updateMurals={updateMurals} 
				/>}
				{mural.photos && mural.photos.length > 1 && 
					<>
					<h1 className='text-center'>{mural.title} Photos</h1>
					<PhotoList photos={photos} />
					</>
				}
			</Container>}
		</>
	)
}

export default ShowMural;