import {Alert, Button, Form, InputGroup} from "react-bootstrap";
import {AnswerStack, Loading} from "../../../components";
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
      text: text,
      username: auth.user.username
    };

    submitAnswer(newAnswer).then(ans => {
      if (mounted) {
        if (ans === null) {
          setFailedSubmit(true);
        } else {
          setAnswerList([...answerList, ans]);
          setFailedSubmit(false);
        }
      }
    });
  };

  return (
    <Loading loading={loading} text="Loading answers...">
      <h4 className="mt-3 text-info">
        {answerList.length + " " + (answerList.length === 1 ? "Answer" : "Answers")}
      </h4>
      <hr />
      <AnswerStack answerList={answerList} />
      <hr />
      <AnswerForm
        text={text}
        setText={setText}
        failedSubmit={failedSubmit}
        setFailedSubmit={setFailedSubmit}
        onSubmit={onSubmit}
      />
    </Loading>
  );
}