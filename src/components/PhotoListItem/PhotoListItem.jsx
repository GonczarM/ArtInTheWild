import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Spinner } from 'react-bootstrap';

import * as usersAPI from '../../utils/users-api'
import { UserContext, MuralDispatchContext } from '../../utils/contexts'

function PhotoListItem({ photo }) {

  const [imgLoading, setImgLoading] = useState(true)
  const { updatedBy } = useParams()
  const user = useContext(UserContext)
	const dispatch = useContext(MuralDispatchContext)
  
  const favoritePhoto = async () => {
    const mural = await usersAPI.favoritePhoto(photo._id)
    dispatch({
			type: 'changed',
			mural: {...mural.mural, updatedBy}
		})
  }

  return (
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
  );
}

export default PhotoListItem;