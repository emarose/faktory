import React, { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

function Notification({ message, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (!show) onClose();
  }, [show, onClose]);

  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={3000}
      autohide
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "slateblue",
        color: "white",
      }}
    >
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}

export default Notification;
