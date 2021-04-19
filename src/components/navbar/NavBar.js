import {Navbar} from "react-bootstrap";

export default function NavBar(props) {
  return (
    <Navbar bg="light" expand="sm" className="fixed-top pb-0">
      <Navbar.Brand href="/">{props.brand}</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar"/>
      <Navbar.Collapse id="navbar">
        {props.children}
      </Navbar.Collapse>
    </Navbar>
  );
}
