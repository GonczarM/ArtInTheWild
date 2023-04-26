import { useEffect, useState } from 'react'
import { Button, Card, Container } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import * as muralsAPI from '../../utils/murals-api'

function ShowMural(props){

	const [mural, setMural] = useState(props.mural)

	const { muralId } = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		if(!mural){
			getMural()
		}
	}, [])

	const getMural = async () => {
		if(muralId.length === 24){
			const APIMural = await muralsAPI.getMural(muralId)
			setMural(APIMural.mural)
		} else {
			const APIMural = await muralsAPI.getMuralAPI(muralId)
			setMural(APIMural[0])
		}
	}

  const handleDelete = async () => {
    muralsAPI.deleteMural(mural._id)
    navigate('/')
  }

  
	return(
		<>
		{mural && <Container>
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
					<Button onClick={() => navigate('/editMural')}>Edit Mural</Button><br></br>
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