import {Spinner} from "react-bootstrap";

export default function Loading(props) {
  return (
    props.loading
      ? <div className="mt-3 text-center">
          <Spinner animation="border"/>
          <h6>{props.text}</h6>
        </div>
      : props.children
  );
}