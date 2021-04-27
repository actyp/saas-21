import {Alert, Spinner} from "react-bootstrap";

function Waiting(props) {
  return (
    <div className="mt-3 text-center">
      <Spinner animation="border"/>
      <h6>{props.text}</h6>
    </div>
  );
}

function EmptyResp() {
  return(
    <Alert variant="info" className="mx-auto mt-5 w-50">
      <Alert.Heading>Nothing found...</Alert.Heading>
    </Alert>
  );
}

function NullResp() {
  return(
    <Alert variant="danger" className="mx-auto mt-5 w-50">
      <Alert.Heading>Something Went Wrong...</Alert.Heading>
      <p>Please try again later.</p>
    </Alert>
  );
}

export default function LoadingHandler(props) {
  const handleCase = (data) => {
    if (data === null)
      return  <NullResp />;
    else if (data.length === 0)
      return <EmptyResp />;
    else return props.children;
  };

  return (
    props.loading ? <Waiting text={props.text} /> : handleCase(props.data)
  );
}