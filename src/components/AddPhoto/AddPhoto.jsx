import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Button, Modal, Form, Spinner, Image} from 'react-bootstrap';

import { MuralDispatchContext } from '../../utils/contexts';
import * as muralsAPI from '../../utils/murals-api'

function AddPhoto({ handleClose, addPhoto, updateMurals }) {

  const [file, setFile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { updatedBy, muralId } = useParams()
  
  const dispatch = useContext(MuralDispatchContext)

  const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      setIsLoading(true)
      const data = new FormData()
      data.append('photo', file)  
      const updatedMural = await muralsAPI.addPhoto(data, muralId)
      updateMurals(updatedMural.mural)
      dispatch({
        type: 'changed',
        mural: {...updatedMural.mural, updatedBy}
      })
      handleClose()
    }catch({message}){
			if(message === 'Unauthorized'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Add Photo Failed. Please try Again.')
      }
    }finally{
      setIsLoading(false)
    }
  }

  const handleChange = async (event) => {
    setFile(event.target.files[0])
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
              onChange={handleChange}
              required
            />
          </Form.Group>
          {file && <Image fluid src={URL.createObjectURL(file)} />}
          {error && <p>{error}</p>}
          {isLoading ? <Button disabled><Spinner size="sm"/></Button>
          : <Button type="submit">Submit</Button>}
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddPhoto