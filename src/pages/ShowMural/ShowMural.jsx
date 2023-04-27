import { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import * as muralsAPI from '../../utils/murals-api'

function ShowMural(props){

	const [mural, setMural] = useState(props.mural)
	const [updatedBy, setUpdatedBy] = useState(props.updatedBy)

	const { muralId } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			getMural()
		}
	}, [])

	useEffect(() => {
		if(props.updatedBy){
			sessionStorage.setItem('updatedBy', props.updatedBy)
		}else{
			setUpdatedBy(sessionStorage.getItem('updatedBy'))
		}
	}, [props.updatedBy])

	const getMural = async () => {
		if(muralId.length === 24){
			const APIMural = await muralsAPI.getMural(muralId)
			setMural(APIMural.mural)
		} else {
			const APIMural = await muralsAPI.getMuralAPI(muralId)
			setMural(APIMural[0])
		}
	}

  const handleDelete = () => {
    muralsAPI.deleteMural(mural._id)
    navigate(`/${props.user.username}`)
  }

	return(
		<>
			{mural && <Container>
				<Breadcrumb>
					<LinkContainer to={`/${updatedBy}`}>
						<Breadcrumb.Item >{updatedBy}</Breadcrumb.Item>
					</LinkContainer>
					<Breadcrumb.Item active>{mural.title || mural.artwork_title}</Breadcrumb.Item>
				</Breadcrumb>
				<Card className='text-center'>
					<Card.Body>
						<Card.Title >{mural.title || mural.artwork_title}</Card.Title>
						<Card.Subtitle>by {mural.artist || mural.artist_credit}</Card.Subtitle>
						<Card.Text>{mural.year || mural.year_installed}</Card.Text>
						<Card.Subtitle>Description</Card.Subtitle>
						<Card.Text>{mural.description || mural.description_of_artwork}</Card.Text>
						{mural.affiliated_or_commissioning && 
						<>
							<Card.Subtitle>Affiliation</Card.Subtitle>
							<Card.Text>{mural.affiliated_or_commissioning}</Card.Text>
						</>}
						{mural.street_address && 
						<>
							<Card.Subtitle>Address</Card.Subtitle>
							<Card.Text>{mural.street_address}</Card.Text>
						</>}
						{mural.zip && 
						<>
							<Card.Subtitle>ZIP Code</Card.Subtitle>
							<Card.Text>{mural.zip}</Card.Text>
						</>}
						{props.user && mural.user === props.user._id &&
						<>
							<Button 
								onClick={() => navigate(`/mural/edit/${mural._id || mural.mural_registration_id}`)}
							>
								Edit Mural
							</Button><br></br>
							<Button onClick={handleDelete}>Delete Mural</Button>
						</>
						}
					</Card.Body>
				</Card>
			</Container>}
		</>
	)
}

export default ShowMural;