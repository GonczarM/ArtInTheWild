import { useContext, useState } from 'react';
import {Button, Modal, Form, Spinner} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { MuralDispatchContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'

function AddPhoto({ handleClose, addPhoto, updateMurals }) {

  const [file, setFile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { updatedBy, muralId } = useParams()
  const dispatch = useContext(MuralDispatchContext)

  const handleSubmit = async (event) => {
    setIsLoading(true)
    event.preventDefault()
    const data = new FormData()
    data.append('photo', file)
    const updatedMural = await muralsAPI.addPhoto(data, muralId)
    updateMurals(updatedMural.mural)
    dispatch({
      type: 'changed',
      mural: {...updatedMural.mural, updatedBy}
    })
    handleClose()
    setIsLoading(false)
  }

  return (
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
          {isLoading ? <Button disabled><Spinner size="sm"/></Button>
          : <Button type="submit">Submit</Button>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPhoto