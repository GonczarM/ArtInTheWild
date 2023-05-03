import { useState } from "react";
import { Card, Spinner } from "react-bootstrap";

function MuralListItem({ mural }) {

  const [imgLoading, setImgLoading] = useState(true)

  return (
      <Card bg='secondary' text='white' className='text-center'>
        {mural.photos && mural.photos.length > 0 && <Card.Img 
          src={mural.photos[0]} 
          onLoad={() => setImgLoading(false)}
          style={{ display: imgLoading ? 'none' : 'block'}}
        />}
        {mural.photos && mural.photos.length > 0 && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
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
        </Card.Body>
      </Card>
  );
}

export default MuralListItem;