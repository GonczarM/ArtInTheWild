import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import * as muralsAPI from '../../utils/murals-api'
import AddPhoto from '../../components/AddPhoto/AddPhoto'

function ShowMural(props){

	const [mural, setMural] = useState(props.mural)
	const [updatedBy, setUpdatedBy] = useState(null)
	const [updatedByURL, setUpdatedByURL] = useState(null)
	const [show, setShow] = useState(false);

	const navigate = useNavigate()

	const updateMural = (mural) => {
		setMural(mural)
	}

	useEffect(() => {
		if(props.updatedBy){
			sessionStorage.setItem('updatedBy', props.updatedBy)
			setUpdatedBy(props.updatedBy)
			if(props.updatedBy === 'home'){
				setUpdatedByURL('')
			}else{
				setUpdatedByURL(props.updatedBy)
			}
		}else if(sessionStorage.getItem('updatedBy')){
			setUpdatedBy(sessionStorage.getItem('updatedBy'))
			if(sessionStorage.getItem('updatedBy') === 'home'){
				setUpdatedByURL('')
			}else{
				setUpdatedByURL(sessionStorage.getItem('updatedBy'))
			}
		}
		if(mural){
			sessionStorage.setItem('mural', JSON.stringify(mural))
		}else{
			setMural(JSON.parse(sessionStorage.getItem('mural')))
		}
	}, [])

  const handleDelete = () => {
    muralsAPI.deleteMural(mural._id)
    navigate(`/${props.user.username}`)
  }

	return(
		<>
			{mural && <Container>
				<Breadcrumb>
					<LinkContainer to={`/${updatedByURL}`}>
						<Breadcrumb.Item >{updatedBy}</Breadcrumb.Item>
					</LinkContainer>
					<Breadcrumb.Item active>{mural.title}</Breadcrumb.Item>
				</Breadcrumb>
				<Card className='text-center'>
					{mural.photos && mural.photos.length > 0 && <Card.Img src={mural.photos[0]} />}
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
						{props.user && mural.user === props.user._id &&
						<>
							<Button 
								onClick={() => navigate(`/mural/edit/${mural._id}`)}
							>
								Edit Mural
							</Button><br></br>
							<Button onClick={handleDelete}>Delete Mural</Button><br></br>
						</>}
						{props.user && <Button onClick={() => setShow(true)}>Add Photo</Button>}
					</Card.Body>
				</Card>
				{show && <AddPhoto 
					handleClose={() => setShow(false)} 
					show={show} 
					mural={mural} 
					updateMural={updateMural} 
				/>}
			</Container>}
		</>
	)
}

export default ShowMural;