'use client';

import { useContext, useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

import * as muralsAPI from '../../utils/murals-api'
import { MuralDispatchContext } from '../../utils/contexts';
import { getFavoritePhoto } from '../../utils/mural-helpers';
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// mapbox-gl touches `window` at module scope, so it can't be server-rendered.
const Map = dynamic(() => import('../../components/Map/Map'), { ssr: false })

function MuralCard({ mural, user, handleOpen }) {

  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')
  const { updatedBy } = useParams()

  const dispatch = useContext(MuralDispatchContext)

  const router = useRouter()

  const favoriteMural = async () => {
    try{
		  const updated = await muralsAPI.favoriteMural(mural.documentId, user.id)
		  dispatch({
			  type: 'changed',
			  mural: {...updated.mural, updatedBy}
		  })
    }catch({message}){
			if(message === 'Unauthorized' || message === 'Forbidden'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not favorite Mural. Please try again.')
      }
    }
	}

	const hasUserFavorited = (favoriteUser) => favoriteUser.id === user.id

  const handleDelete = async () => {
    try{
      await muralsAPI.deleteMural(mural.documentId)
      router.push(`/user/${user.username}`)
    }catch({message}){
			if(message === 'Unauthorized' || message === 'Forbidden'){
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
      setError('Please login first before adding a photo.')
    }
  }

  const favoritePhoto = getFavoritePhoto(mural)
  const isOwner = user && mural.user?.id === user.id

  return (
    <>
    {error && <ErrorMessage error={error} setError={setError} />}
    <Card className='text-center'>
      {favoritePhoto && <Card.Img
        src={favoritePhoto.photo?.url}
        onLoad={() => setImgLoading(false)}
        style={{ display: imgLoading ? 'none' : 'block'}}
      />}
      {favoritePhoto && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
      <Card.Body>
        <Card.Title >{mural.title}</Card.Title>
        {mural.artist && <Card.Subtitle>by {mural.artist}</Card.Subtitle>}
        {mural.year && <Card.Text>{mural.year}</Card.Text>}
        <Card.Subtitle>Description</Card.Subtitle>
        <Card.Text>{mural.description}</Card.Text>
        {mural.affiliation &&
        <>
          <Card.Subtitle>Affiliation</Card.Subtitle>
          <Card.Text>{mural.affiliation}</Card.Text>
        </>}
          <Card.Subtitle>Address</Card.Subtitle>
          <Card.Text>{mural.address}</Card.Text>
          {mural.zipcode && <>
          <Card.Subtitle>ZIP Code</Card.Subtitle>
          <Card.Text>{mural.zipcode}</Card.Text>
          </>}
        {user && !mural.favoritedBy.some(hasUserFavorited) && !isOwner ?
        <>
          <Button onClick={favoriteMural}>Favorite Mural</Button><br></br>
        </>
        :
        <>
          <span>{mural.favoritedBy.length}</span>
          <Button variant='outline' className='bi bi-suit-heart-fill'></Button><br></br>
        </>
        }
        <Button onClick={handleAddPhotoClick}>Add Photo</Button><br></br>
        {isOwner &&
        <>
          <Button
            variant='secondary'
            onClick={() => router.push(`/mural/edit/${updatedBy}/${mural.documentId}`)}
          >
            Edit Mural
          </Button><br></br>
          <Button variant='danger' onClick={handleDelete}>Delete Mural</Button>
        </>}
        {mural.latitude != null && mural.longitude != null && <Map
          murals={[mural]}
          geometry={{longitude: mural.longitude, latitude: mural.latitude, zoom: 14}}
        />}
      </Card.Body>
    </Card>
    </>
  );
}

export default MuralCard;
