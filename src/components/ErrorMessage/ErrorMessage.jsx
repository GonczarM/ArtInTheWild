import { useState } from "react";
import { Modal } from "react-bootstrap";

const ErrorMessage = ({ error, setError }) => {

  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setError('')
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>{error}</Modal.Body>
    </Modal>
  );
}

export default ErrorMessage;