import {Navbar} from "react-bootstrap";
import {loudspeaker} from "../../images";
import "./NavBar.css";

export default function NavBar(props) {
  return (
    <Navbar expand="sm" className="fixed-top">
      <Navbar.Brand>
        <img alt="" src={loudspeaker} width="30" />
        {' '}AskMeAnything
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar"/>
      <Navbar.Collapse id="navbar">
        {props.children}
      </Navbar.Collapse>
    </Navbar>
  );
}
