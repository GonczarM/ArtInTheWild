import { useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

function Popup({ properties, handleClick }) {

  const [imgLoading, setImgLoading] = useState(true)

  return (
    <Card>
      {properties.image && <Card.Img 
        src={properties.image} 
        onLoad={() => setImgLoading(false)}
        style={{ display: imgLoading ? 'none' : 'block'}}
      />}
      {properties.image && imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}}/>}
      <Card.Body>
        <Card.Title>{properties.title}</Card.Title>
        <Card.Subtitle>by {properties.artist}</Card.Subtitle>
        <Button onClick={() => handleClick(properties.id)}>Show Mural</Button>
      </Card.Body>
    </Card>
  );
}

export default Popup;