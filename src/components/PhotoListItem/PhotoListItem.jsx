import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Spinner } from 'react-bootstrap';

import * as usersAPI from '../../utils/users-api'
import { UserContext, MuralDispatchContext } from '../../utils/contexts'
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function PhotoListItem({ photo }) {

  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')
  const { updatedBy } = useParams()
  const user = useContext(UserContext)

	const dispatch = useContext(MuralDispatchContext)
  
  const favoritePhoto = async () => {
    try{
      const mural = await usersAPI.favoritePhoto(photo._id)
      dispatch({
			  type: 'changed',
			  mural: {...mural.mural, updatedBy}
		  })
    }catch({message}){
			if(message === 'Unauthorized'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not favorite photo. Please try again.')
      }
    }
  }

  return (
    <>
    {error && <ErrorMessage error={error} setError={setError} />}
    <Card bg='secondary' className='text-center'>
      <Card.Img
        src={photo.photo} 
        onLoad={() => setImgLoading(false)}
        style={{ display: imgLoading ? 'none' : 'block'}}
      />
      {imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
      {user && !photo.likes.includes(user._id) &&
      <Card.Body>
        <Button onClick={favoritePhoto}>Favorite Picture</Button>
      </Card.Body>
      } 
    </Card>
    </>
  );
}

export default PhotoListItem;