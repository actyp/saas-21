import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link} from "react-router-dom";

/*
 * props: setIsSignedIn, username, setUsername
 */
export default function NavBarSignedIn(props) {
  return(
    <NavBar brand="AskMeAnything">
      <div className="mx-auto">
        <Link to="/personal/qna">
          <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-myqna">My Questions / Answers</Tooltip>}>
            <Button
              variant="outline-primary"
              className="shadow-none border-0 hover-to-show"
            >
              <i className="fas fa-newspaper"> </i>
            </Button>
          </OverlayTrigger>
        </Link>
        <Link to="/personal/contributions">
          <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-mycont">My daily contributions</Tooltip>}>
            <Button
              variant="outline-primary"
              className="shadow-none border-0"
            >
              <i className="fas fa-chart-area"> </i>
            </Button>
          </OverlayTrigger>
        </Link>
        <Link to="/ask">
          <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-ask">Ask a question</Tooltip>}>
            <Button
              variant="outline-primary"
              className="shadow-none border-0"
            >
              <i className="fas fa-question"> </i>
            </Button>
          </OverlayTrigger>
        </Link>
        <Link to="/browse">
          <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-answer">Browse & Answer a question</Tooltip>}>
            <Button
              variant="outline-primary"
              className="shadow-none border-0"
            >
              <i className="fas fa-pen"> </i>
            </Button>
          </OverlayTrigger>
        </Link>
      </div>
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
      <Link to="/personal">
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-personal">{props.username}</Tooltip>}>
          <Button
            variant="outline-primary"
            className="shadow-none border-0"
          >
            <i className="fas fa-user"> </i>
          </Button>
        </OverlayTrigger>
      </Link>
      <Link to="/">
        <OverlayTrigger placement='bottom' overlay={<Tooltip id="tooltip-sign-out">Sign out</Tooltip>}>
          <Button
            variant="outline-danger"
            className="shadow-none border-0"
            onClick={() => {
              props.setIsSignedIn(false);
              props.setUsername("");
            }}
          >
            <i className="fas fa-sign-out-alt"> </i>
          </Button>
        </OverlayTrigger>
      </Link>
    </NavBar>
  );
}
