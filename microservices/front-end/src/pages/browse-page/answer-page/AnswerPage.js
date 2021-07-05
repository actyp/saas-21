import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {AnswerStack, LoadingHandler} from "../../../components";
import {answersPerQuestionId, submitAnswer, useFetchDataOnMount} from "../../../services/api";
import {useAuth} from "../../../services/auth";
import {useState} from "react";
import "./AnswerPage.css";

function AnswerForm(props) {
  const [error, setError] = useState({});
  const auth = useAuth();

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
              disabled={!auth.user}
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
            disabled={!auth.user}
            onClick={() => formValid() && props.onSubmit()}
          >
            {auth.user ? "Submit Answer" : "Sign in to submit your answer"}
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

function AnswerCount(props) {
  return (
    <h4 className="mt-3 text-info">
      {props.answerList.length + " " + (props.answerList.length === 1 ? "Answer" : "Answers")}
    </h4>
  );
}

export default function AnswerPage(props) {
  const [answerList, setAnswerList] = useState([]);
  const [text, setText] = useState("");
  const [failedSubmit, setFailedSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: () => answersPerQuestionId(props.questionId),
      mounted: mounted,
      setMounted: setMounted,
      dataState: answerList,
      setDataState: setAnswerList,
      setLoading: setLoading
    }
  );

  const onSubmit = () => {
    const newAnswer = {
      question_id: props.questionId,
      text: text
    };

    submitAnswer(newAnswer, auth.tokenObj).then(date => {
      if (mounted) {
        if (date === null) {
          setFailedSubmit(true);
        } else {
          const answer = {
            text: text,
            username: auth.user.username,
            date: date
          };
          setAnswerList([answer, ...answerList]);
          setFailedSubmit(false);
        }
      }
    });
  };

  return (
    <>
      <LoadingHandler data={answerList} loading={loading} text="Loading answers...">
        <AnswerCount answerList={answerList} />
        <hr />
        <AnswerStack answerList={answerList} />
      </LoadingHandler>
      <hr />
      <AnswerForm
        text={text}
        setText={setText}
        failedSubmit={failedSubmit}
        setFailedSubmit={setFailedSubmit}
        onSubmit={onSubmit}
      />
    </>
  );
}