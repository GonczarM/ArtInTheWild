import { Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import * as muralsAPI from '../../utils/murals-api'

function ShowMural({ mural, user }){

	const navigate = useNavigate()

  const handleDelete = async () => {
    muralsAPI.deleteMural(mural._id)
    navigate('/')
  }

  
	return(
		<>
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
					{user && mural.user === user._id &&
					<>
					<Button onClick={() => navigate('/editMural')}>Edit Mural</Button><br></br>
					<Button onClick={handleDelete}>Delete Mural</Button>
					</>
					}
				</Card.Body>
			</Card>
		</>
	)
}

export default ShowMural;