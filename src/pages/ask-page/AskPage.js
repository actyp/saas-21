import {Alert, Button, Col, Form, InputGroup} from "react-bootstrap";
import {QuestionStack} from "../../components";
import {useEffect, useState} from "react";
import {useAuth} from "../../services/auth";
import {askQuestion} from "../../services/api";
import "./AskPage.css";

function AskForm(props) {
  const [error, setError] = useState({});

  const formValid = () => {
    let valid = true;
    let errors = {};

    if(props.title === "") {
      errors['title'] = "Title is required.";
      valid = false;
    }

    if(props.text === "") {
      errors['text'] = "Text is required.";
      valid = false;
    }

    if(props.keywords.length === 0) {
      errors['keywords'] = "Keywords are required.";
      valid = false;
    }

    setError(errors);
    return valid;
  }

  return (
    <Form>
      <h3 className="text-center mb-5"> Ask a question </h3>
      <Form.Row className="justify-content-md-center mx-0 mb-2">
        <Col md={5}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><i className="fas fa-heading"> </i></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder="Question heading / title"
                onChange={e => props.setTitle(e.target.value)}
              />
            </InputGroup>
            <Form.Text className="text-danger ml-5">{error['title']}</Form.Text>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row className="justify-content-md-center mx-0 mb-2">
        <Col md={5}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><i className="fas fa-pencil-alt"> </i></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                as="textarea" rows={3} cols={60}
                placeholder="Question text"
                onChange={e => props.setText(e.target.value)}
              />
            </InputGroup>
            <Form.Text className="text-danger ml-5">{error['text']}</Form.Text>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row className="justify-content-md-center mx-0 mb-4">
        <Col md={5}>
          <Form.Group>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text><i className="fas fa-tag"> </i></InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder="Question;related;keywords;tags"
                onChange={e => props.setKeywords(
                  e.target.value === "" ? [] : e.target.value.split(';').map(k => k.toLowerCase()))}
              />
            </InputGroup>
            <Form.Text className="text-muted ml-5">
              Separate keywords with semicolon ( ; )
              <span className="text-danger ml-2">{error['keywords']}</span>
            </Form.Text>
            <Form.Text className="text-muted ml-5">
              Keywords are stored in lowercase.
            </Form.Text>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row className="justify-content-md-center mx-0 ">
        <Col md={"auto"}>
          <Form.Group>
            <Button variant="success" onClick={() => formValid() && props.onSubmit()}>
              Submit Question
            </Button>
            <Button variant="info" className="ml-4 shadow-none" onClick={props.preview.toggle}>
              {props.preview.show ? 'Hide' : 'Show'} Preview
            </Button>
          </Form.Group>
          <Alert
            className="mb-0 mt-4"
            id="alert-box"
            dismissible
            show={props.submitStatus.show}
            variant={props.submitStatus.value ? "success" : "danger"}
            onClose={() => props.setSubmitStatus({...props.submitStatus, show: false})}
          >
            <h5>
              Submit {props.submitStatus.value ? "Successful" : "Failed"}
            </h5>
            <p className="m-0">
              {props.submitStatus.value ? "Question added to 'My Questions'." : "Please try again."}
            </p>
          </Alert>
        </Col>
      </Form.Row>
    </Form>
  );
}

function Preview(props) {
  let formData = {
    title: "Question heading / title",
    text: "Question text",
    keywords: ["question", "related", "keywords", "tags"]
  }

  for(const v in formData) {
    if(props.formData[v].length !== 0) {
      formData[v] = props.formData[v];
    }
  }

  const questionList = [ {...formData, id: 0, username: props.username, date: Date().slice(3,21)} ];

  return (
    props.show &&
    <Col md={5} className="mx-auto mt-4 px-1">
      <QuestionStack
        scrollToTop="unset"
        questionList={questionList}
        selected={0}
        setSelected={() => null}
      />
    </Col>
  );
}

export default function AskPage() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({value: false, show: false});
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  // set mounted to true on mount and false on unmount
  // state update under mounted condition prevents
  // state update on unmounted component
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const onSubmit = () => {
    const data = {
      title:title,
      text:text,
      keywords:keywords,
      username: auth.user.username
    };

    askQuestion(data).then(status => {
      if (mounted) {
        setSubmitStatus({value: status, show: true});
      }
    });
  };

  const togglePreview = () => setShowPreview(!showPreview);

  return (
    <>
      <AskForm
        title={title} setTitle={setTitle}
        text={text} setText={setText}
        keywords={keywords} setKeywords={setKeywords}
        onSubmit={onSubmit}
        submitStatus={submitStatus}
        setSubmitStatus={setSubmitStatus}
        preview = {{show: showPreview, toggle:togglePreview}}
      />
      <Preview
        show={showPreview}
        formData={{title: title, text: text, keywords: keywords}}
        username={auth.user.username}
      />
    </>
  );
}