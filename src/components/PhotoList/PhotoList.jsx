import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PhotoListItem from '../PhotoListItem/PhotoListItem';

function PhotoList({ mural }) {
  return (
    <Container>
      <Row xs={1} lg={2}>
        {mural.photos.map((photo, i) => (
          <Col key={i}>
            <PhotoListItem photo={photo} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PhotoList;