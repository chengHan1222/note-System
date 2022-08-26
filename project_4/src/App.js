import React from 'react'
import Button from 'react-bootstrap/Button';
import MyModal from './Component/MyModal'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Record
      </Button>

      <MyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default App;