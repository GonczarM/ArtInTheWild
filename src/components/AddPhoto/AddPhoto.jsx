import { useState } from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import * as muralsAPI from '../../utils/murals-api'

function AddPhoto({ handleClose, show, mural, updateMural, updateMurals}) {

  const [file, setFile] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData()
    data.append('photo', file)
    const updatedMural = await muralsAPI.addPhoto(data, mural._id)
    updateMurals(updatedMural.mural)
    updateMural(updatedMural.mural)
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Mural Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="file">
              <Form.Label>Mural Photo</Form.Label>
              <Form.Control 
                type="file"
                name="file"
                onChange={(event) => setFile(event.target.files[0])}
                required
              />
            </Form.Group>
            <Button type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddPhoto