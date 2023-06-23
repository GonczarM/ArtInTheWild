import { useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import * as usersAPI from '../../utils/users-api'
import * as muralsAPI from '../../utils/murals-api'
import Map from '../../components/Map/Map'

function MuralCard({ mural, user, handleOpen }) {

  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')
  const { muralId, updatedBy } = useParams()

  const navigate = useNavigate()

  const favoriteMural = async () => {
    try{
		  const mural = await usersAPI.favoriteMural(muralId)
		  if(updatedBy === 'home'){
			  updateMurals(mural.mural)
		  }
		  dispatch({
			  type: 'changed',
			  mural: {...mural.mural, updatedBy}
		  })
    }catch({message}){
			if(message === 'Unauthorized' || message === 'Forbidden'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not favorite Mural. Please try again.')
      }
    }
	}

	const hasUserFavorited = (favoriteUser) => {
		return favoriteUser === user._id || favoriteUser._id === user._id
	}

  const handleDelete = () => {
    try{
      muralsAPI.deleteMural(mural._id)
      navigate(`/user/${user.username}`)
    }catch({message}){
			if(message === 'Unauthorized'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not delete Mural. Please try again.')
      }
    }
  }

  const handleAddPhotoClick = () => {
    if(user){
      handleOpen()
    }else{
      navigate('/login')
    }
  }

  return (
    <Card className='text-center'>
      {error && <p>{error}</p>}
      {mural.favoritePhoto && <Card.Img 
        src={mural.favoritePhoto} 
        onLoad={() => setImgLoading(false)}
        style={{ display: imgLoading ? 'none' : 'block'}}
      />}
      {mural.favoritePhoto && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
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
        <Button onClick={handleAddPhotoClick}>Add Photo</Button><br></br>
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
        {mural.address && <Map 
          murals={[mural]} 
          geometry={{longitude: mural.longitude, latitude: mural.latitude, zoom: 14}}
        />}
      </Card.Body>
    </Card>
  );
}

export default MuralCard;