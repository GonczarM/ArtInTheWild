import { useState } from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as muralsAPI from '../../utils/murals-api'

function AddPhoto({ handleClose, addPhoto, mural, updateMural, updateMurals}) {

  const [file, setFile] = useState('')

  const { updatedBy } = useParams()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData()
    data.append('photo', file)
    const updatedMural = await muralsAPI.addPhoto(data, mural._id)
    updateMurals(updatedMural.mural)
    updateMural({...mural.mural, updatedBy})
    handleClose()
  }

  return (
    <>
      <Modal show={addPhoto} onHide={handleClose} centered>
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