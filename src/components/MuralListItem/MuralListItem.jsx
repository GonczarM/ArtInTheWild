import { useState } from "react";
import { Card, Spinner, Button } from "react-bootstrap";

function MuralListItem({ mural }) {

  const [imgLoading, setImgLoading] = useState(true)

  return (
      <Card bg='secondary' text='white' className='text-center'>
        {mural.favoritePhoto && <Card.Img 
          src={mural.favoritePhoto} 
          onLoad={() => setImgLoading(false)}
          style={{ display: imgLoading ? 'none' : 'block'}}
        />}
        {mural.favoritePhoto && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
        <Card.Body>
          <Card.Title>{mural.title}</Card.Title>
          <Card.Subtitle>By {mural.artist}</Card.Subtitle>
          <Card.Text>{mural.year}</Card.Text>
          <Card.Subtitle>Description</Card.Subtitle>
          <Card.Text>
            {mural.description.length > 300 
            ? mural.description.substring(0, 300).concat('...') 
            : mural.description}
          </Card.Text>
          {mural.favorite.length > 0 &&
          <>
            <span>{mural.favorite.length}</span>
            <Button variant='outline' className='bi bi-suit-heart-fill'></Button>
          </>
          }
        </Card.Body>
      </Card>
  );
}

export default MuralListItem;