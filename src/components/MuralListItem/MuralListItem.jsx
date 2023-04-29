import { Card } from "react-bootstrap";

function MuralListItem({ mural }) {

  return (
      <Card bg='secondary' text='white' className='text-center'>
        {mural.photos && mural.photos.length > 0 && <Card.Img src={mural.photos[0]} />}
        <Card.Body>
          <Card.Title>{mural.title}</Card.Title>
          <Card.Subtitle>By {mural.artist}</Card.Subtitle>
          <Card.Text>{ mural.year}</Card.Text>
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