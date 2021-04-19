import {useState} from "react";
import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import AnswerStack from "../../../components/answer-stack/AnswerStack";
import "./AnswerPage.css";

function answerFeed(qId) {
  const answers = [
    {
      text: "Answer text for id: " + qId,
      username: "username",
      date: "date"
    },
    {
      text: "Answer text for id: " + qId,
      username: "username",
      date: "date"
    },
    {
      text: "Answer text for id: " + qId,
      username: "username",
      date: "date"
    }
  ];
  return answers;
}

function submitAnswer(data) {
  return data.text === "true";
}

function AnswerForm(props) {
  const [error, setError] = useState({});

  const formValid = () => {
    let valid = true;
    let errors = {};

    if(props.text === "") {
      errors['text'] = "Blank is not a valid answer.";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  return (
    <Form>
      <Form.Row className="mx-0 mb-2">
        <Form.Group>
          <h3 className="text-info"> Know the Answer ?</h3>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text><i className="fas fa-pencil-alt"> </i></InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              as="textarea" rows={3} cols={120}
              disabled={!props.isSignedIn}
              placeholder="Write your answer here..."
              onChange={e => props.setText(e.target.value)}
            />
          </InputGroup>
          <Form.Text className="text-danger ml-5">{error['text']}</Form.Text>
        </Form.Group>
      </Form.Row>
      <Form.Row className="justify-content-center mx-0">
        <Form.Group>
          <Button
            variant="success"
            disabled={!props.isSignedIn}
            onClick={() => formValid() && props.onSubmit()}
          >
            {props.isSignedIn ? "Submit Answer" : "Sign in to submit your answer"}
          </Button>
        </Form.Group>
        <Alert
          className="mb-0 ml-4"
          id="alert-box"
          variant="danger"
          dismissible
          show={props.failedSubmit}
          onClose={() => props.setFailedSubmit(false)}
        >
          <h5> Submit Failed </h5>
          <p className="m-0"> Please try again. </p>
        </Alert>
      </Form.Row>
    </Form>
  );
}

export default function AnswerPage(props) {
  const answers = answerFeed(props.questionId);
  const [answerList, setAnswerList] = useState(answers);
  const [text, setText] = useState("");
  const [failedSubmit, setFailedSubmit] = useState(false);

  const onSubmit = () => {
    const newAnswer = {
      text:text,
      username: props.username,
      date:Date().slice(3,21)
    };

    if(!submitAnswer(newAnswer)) {
      setFailedSubmit(true);
    } else {
      setAnswerList([...answerList, newAnswer]);
      setFailedSubmit(false);
    }
  };

  return (
    <>
      <h4 className="mt-3 text-info">
        {answerList.length + " " + (answerList.length === 1 ? "Answer" : "Answers")}
      </h4>
      <hr />
      <AnswerStack answerList={answerList} />
      <hr />
      <AnswerForm
        isSignedIn={props.isSignedIn}
        text={text}
        setText={setText}
        failedSubmit={failedSubmit}
        setFailedSubmit={setFailedSubmit}
        onSubmit={onSubmit}
      />
    </>
  );
}