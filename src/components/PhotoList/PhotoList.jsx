import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

function PhotoList({ photos }) {
  return (
    <Container>
      <Row xs={1} lg={2}>
        {photos.map((photo, i) => (
          <Col key={i}>
            <Image fluid rounded src={photo} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PhotoList;