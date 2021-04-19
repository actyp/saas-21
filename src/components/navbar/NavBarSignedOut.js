import {useState} from "react";
import {Alert, Button, Form, Modal, OverlayTrigger, ToggleButton, ToggleButtonGroup, Tooltip} from "react-bootstrap";
import isEmail from "validator/es/lib/isEmail";

import NavBar from "./NavBar";

function modalSubmit({type, email, p1, p2}) {
  console.log(type, email, p1, p2);
  if(type === "Sign in") {
    return {username: "actyp@home.gr", token: "token"};
  }
  if (type === "Sign up") {
    return null;
  }
  return null;
}

/*
 * Modal props: show, backdrop, keyboard
 * Form  props: onHide, onSubmit, failedSubmit
 * Validation through formValidation(), which
 * validates email using browser built-in function
 * and passwords manually
 */
function ModalForm(props){
  const [type, setType] = useState("Sign in");
  const [email, setEmail] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [error, setError] = useState({});

  const reset = () => {
    setType("Sign in");
    setEmail("");
    setP1("");
    setP2("");
    setError({});
  };

  const formValid = () => {
    let valid = true;
    let errors = {};

    if(!isEmail(email)) {
      errors['email'] = email === "" ? "Email is required." : "Please enter a valid email.";
      valid = false;
    }

    if(p1 === "") {
      errors['p1'] = "Password is required.";
      valid = false;
    }

    if(type === "Sign up") {
      if (p2 === "") {
        errors['p2'] = "Confirm password is required.";
        valid = false;
      }

      if (p1 !== "" && p2 !== "" && p2 !== p1) {
        errors['p2'] = "Confirm Password should match Password.";
        valid = false;
      }
    }
    setError(errors);
    return valid;
  }

  const modalProps = {...props};
  delete modalProps.onSubmit;
  delete modalProps.failedSubmit;

  return (
    <Modal {...modalProps} size="md">
      <Modal.Header className="p-0 pt-2 bg-light">
        <ToggleButtonGroup type="radio" name='modalSign' defaultValue={"in"} className="btn-block">
          <ToggleButton
            variant="light" className="shadow-none"
            value={"in"} onClick={() => { setType("Sign in"); setP2("")}}
          >
            Sign in
          </ToggleButton>
          <ToggleButton
            variant="light" className="shadow-none"
            value={"up"} onClick={() => setType("Sign up")}
          >
            Sign up
          </ToggleButton>
        </ToggleButtonGroup>
      </Modal.Header>
      <Modal.Body>
        <Form id="modalForm">
          <Form.Group controlId="modalEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="shadow-none"
              type="email" placeholder="askme@anything.com" title="" required
              onChange={e => {
                if(e.target.value !== ""){
                  setError({...error, email:""});
                }
                setEmail(e.target.value);
              }}
            />
            <Form.Text className="text-danger">{error['email']}</Form.Text>
          </Form.Group>
          <Form.Group controlId="modalP1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="shadow-none"
              type="password" placeholder="Type Password"
              onChange={e => {
                if(e.target.value !== ""){
                  setError({...error, p1:""});
                }
                setP1(e.target.value);
              }}
            />
            <Form.Text className="text-danger">{error['p1']}</Form.Text>
          </Form.Group>
          {type === "Sign up" &&
          <Form.Group controlId="modalP2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              className="shadow-none"
              type="password" placeholder="Repeat Password"
              onFocus={e => {
                if(e.target.value !== "") {
                  e.target.style.borderLeftWidth = 'thick';
                  e.target.style.borderLeftColor = p1 !== e.target.value ? '#ea8791' : '#28a745';
              }
              }}
              onChange={e => {
                if(e.target.value !== "") {
                  setError({...error, p2:""});
                  e.target.style.borderLeftWidth = 'thick';
                  e.target.style.borderLeftColor = p1 !== e.target.value ? '#ea8791' : '#28a745';
                } else {
                  e.target.style.borderLeft = '1px solid #ced4da';
                }
                setP2(e.target.value);
              }}
              onBlur={e => e.target.style.borderLeft = '1px solid #ced4da'}
            />
            <Form.Text className="text-danger">{error['p2']}</Form.Text>
          </Form.Group>
          }
          <div className="d-flex justify-content-center">
            <Button
              variant="info" className="mx-1 shadow-none"
              onClick={() => formValid() && props.onSubmit({type: type, email: email, p1: p1, p2: p2})}
            >
              {type}
            </Button>
            <Button
              variant="light" className="mx-1 shadow-none"
              onClick={() => {reset() ; props.onHide()}}
            >
              Cancel
            </Button>
          </div>
        </Form>
        <Alert variant="danger" className="mb-0 mt-3" show={props.failedSubmit.value}>
          <h5>{props.failedSubmit.type} Failed</h5>
          <p className="m-0">Please try again.</p>
        </Alert>
      </Modal.Body>
    </Modal>
  );
}

/*
 * props: modalShow, setModalShow, onSubmit, failedSubmit
 */
export default function NavBarSignedOut(props) {
  const [modalShow, setModalShow] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState({type:"", value:false});

  const onSubmit = (formInfo) => {
    const resp = modalSubmit(formInfo);
    if (resp !== null) {
      props.setUsername(resp.username);
      setModalShow(false);
      setFailedSubmit({type:"", value:false});
      props.setIsSignedIn(true);
    } else {
      props.setUsername("");
      setFailedSubmit({type: formInfo.type, value:true});
      setTimeout(() => setFailedSubmit({type:formInfo.type, value:false}), 1500);
    }
  };

  return (
    <NavBar brand="AskMeAnything">
      <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-sign-in">Sign in / Sign up</Tooltip>}>
        <Button
          variant="outline-success"
          className="ml-auto shadow-none border-0"
          onClick={() => setModalShow(true)}
        >
          <i className="fas fa-sign-in-alt"> </i>
        </Button>
      </OverlayTrigger>
      <ModalForm
        show={modalShow}
        backdrop="static"
        keyboard={false}
        onHide={() => setModalShow(false)}
        onSubmit={onSubmit}
        failedSubmit={failedSubmit}
      />
    </NavBar>
  );
}
