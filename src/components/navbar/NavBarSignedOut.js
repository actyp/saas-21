import {Alert, Button, Form, Modal, OverlayTrigger, ToggleButton, ToggleButtonGroup, Tooltip} from "react-bootstrap";
import isEmail from "validator/es/lib/isEmail";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import NavBar from "./NavBar";
import {useAuth} from "../../services/auth";

/*
 * Modal props: show, backdrop, keyboard, onExited
 * Form  props: onHide, onSubmit, failedSubmit
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

  const modalProps = {
    show: props.show,
    backdrop: props.backdrop,
    keyboard: props.keyboard,
    onExited: reset
  };

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
              onClick={() => formValid() && props.onSubmit({type: type, email: email, password: p1})}
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
        <Alert variant="success" className="mb-0 mt-3" show={props.successSignUp}>
          <h5>Sign up successful</h5>
          <p className="m-0">You can now sign in.</p>
        </Alert>
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
export default function NavBarSignedOut() {
  const [modalShow, setModalShow] = useState(false);
  const [successSignUp, setSuccessSignUp] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState({type: "", value:false});
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  // set mounted to true on mount and false on unmount
  // state update under mounted condition prevents
  // state update on unmounted component
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // state update under mounted condition
  const onSubmit = ({type, email, password}) => {
    const command = {
      "Sign in": auth.signin,
      "Sign up": auth.signup
    };

    const toggle_delayed = (f1, f2) => {
      f1() ; setTimeout(() => f2(), 1500)
    }
    
    command[type](email, password).then(resp => {
      if (mounted && resp === null) {
        toggle_delayed(
          () => setFailedSubmit({type: type, value: true}),
          () => setFailedSubmit({type: type, value: false})
        );
      }
      else if (mounted && type === "Sign up") {
        toggle_delayed(
          () => setSuccessSignUp(true),
          () => {setSuccessSignUp(false) ; setModalShow(false)}
        );
      }
    });
  };

  return (
    <NavBar brand="AskMeAnything">
      <div className="ml-auto">
        <Link to="/">
          <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-home">Home</Tooltip>}>
            <Button
              variant="outline-info"
              className="shadow-none border-0 hover-to-show"
            >
              <i className="fas fa-home"> </i>
            </Button>
          </OverlayTrigger>
        </Link>
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-sign-in">Sign in / Sign up</Tooltip>}>
        <Button
          variant="outline-success"
          className="shadow-none border-0"
          onClick={() => setModalShow(true)}
        >
          <i className="fas fa-sign-in-alt"> </i>
        </Button>
      </OverlayTrigger>
      </div>
      <ModalForm
        show={modalShow}
        backdrop="static"
        keyboard={false}
        onHide={() => setModalShow(false)}
        onSubmit={onSubmit}
        failedSubmit={failedSubmit}
        successSignUp={successSignUp}
      />
    </NavBar>
  );
}
