'use client';

import { useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";

import { getFavoritePhoto } from '../../utils/mural-helpers';

function MuralListItem({ mural }) {

  const [imgLoading, setImgLoading] = useState(true)
  const favoritePhoto = getFavoritePhoto(mural)

  return (
      <Card bg='secondary' text='white' className='text-center'>
        {favoritePhoto && <Card.Img
          src={favoritePhoto.photo?.url}
          onLoad={() => setImgLoading(false)}
          style={{ display: imgLoading ? 'none' : 'block'}}
        />}
        {favoritePhoto && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
        <Card.Body>
          <Card.Title>{mural.title}</Card.Title>
          {mural.artist && <Card.Subtitle>by {mural.artist}</Card.Subtitle>}
          {mural.year && <Card.Text>{mural.year}</Card.Text>}
          <Card.Subtitle>Description</Card.Subtitle>
          <Card.Text>
            {mural.description && mural.description.length > 300
            ? mural.description.substring(0, 300).concat('...')
            : mural.description}
          </Card.Text>
          {mural.favoritedBy.length > 0 &&
          <>
            <span>{mural.favoritedBy.length}</span>
            <Button variant='outline' className='bi bi-suit-heart-fill'></Button>
          </>
          }
        </Card.Body>
      </Card>
  );
}

export default MuralListItem;
