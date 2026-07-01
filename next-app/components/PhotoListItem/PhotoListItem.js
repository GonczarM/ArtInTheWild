'use client';

import { useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Button, Card, Spinner } from 'react-bootstrap';

import * as likesAPI from '../../utils/likes-api'
import * as muralsAPI from '../../utils/murals-api'
import { UserContext, MuralDispatchContext } from '../../utils/contexts'
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function PhotoListItem({ photo }) {

  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')
  const { updatedBy, muralId } = useParams()
  const user = useContext(UserContext)

	const dispatch = useContext(MuralDispatchContext)

  const favoritePhoto = async () => {
    try{
      await likesAPI.likePhoto(photo.documentId)
      // Liking a photo only creates a Like record, not the whole mural tree
      // the way the old PUT /api/users/photo/:id did - re-fetch to pick up
      // the new like count/relations everywhere the mural is shown.
      const updated = await muralsAPI.getMural(muralId)
      dispatch({
			  type: 'changed',
			  mural: {...updated.mural, updatedBy}
		  })
    }catch({message}){
			if(message === 'Unauthorized'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not favorite photo. Please try again.')
      }
    }
  }

  const hasUserLiked = user && photo.likes.some((like) => like.user?.id === user.id)

  return (
    <>
    {error && <ErrorMessage error={error} setError={setError} />}
    <Card bg='secondary' className='text-center'>
      <Card.Img
        src={photo.photo?.url}
        onLoad={() => setImgLoading(false)}
        style={{ display: imgLoading ? 'none' : 'block'}}
      />
      {imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
      {user && !hasUserLiked &&
      <Card.Body>
        <Button onClick={favoritePhoto}>Favorite Picture</Button>
      </Card.Body>
      }
    </Card>
    </>
  );
}

export default PhotoListItem;
