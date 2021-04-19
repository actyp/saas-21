import {Alert, Button, Col, Form, InputGroup} from "react-bootstrap";
import QuestionStack from "../../components/question-stack/QuestionStack";
import {useState} from "react";
import "./AskPage.css";

function submitQuestion(data) {
  console.log('Submit question:', data);
  return data['title'] === "true";
}

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
                onChange={e => props.setKeywords(e.target.value === "" ? [] : e.target.value.split(';'))}
              />
            </InputGroup>
            <Form.Text className="text-muted ml-5">
              Separate keywords with semicolon ( ; )
              <span className="text-danger ml-2">{error['keywords']}</span>
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
            show={props.failedSubmit.show}
            variant={props.failedSubmit.value ? "danger" : "success"}
            onClose={() => props.setFailedSubmit({...props.failedSubmit, show: false})}
          >
            <h5>
              Submit {props.failedSubmit.value ? "Failed" : "Successful"}
            </h5>
            <p className="m-0">
              {props.failedSubmit.value ? "Please try again." : "Question added to 'My Questions'."}
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
    keywords: ["Question", "related", "keywords", "tags"]
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
        questionList={questionList}
        selected={0}
        setSelected={() => null}
      />
    </Col>
  );
}

export default function AskPage(props) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [failedSubmit, setFailedSubmit] = useState({value: false, show: false});

  const togglePreview = () => setShowPreview(!showPreview);
  const onSubmit = () => {
    const data = {
      title:title,
      text:text,
      keywords:keywords,
      username: props.username,
      date:Date().slice(3,21)
    };
   const failedSubmit = !submitQuestion(data);
   setFailedSubmit({value: failedSubmit, show: true});
  };

  return (
    <>
      <AskForm
        title={title} setTitle={setTitle}
        text={text} setText={setText}
        keywords={keywords} setKeywords={setKeywords}
        onSubmit={onSubmit}
        failedSubmit={failedSubmit}
        setFailedSubmit={setFailedSubmit}
        preview = {{show: showPreview, toggle:togglePreview}}
      />
      <Preview
        show={showPreview}
        formData={{title: title, text: text, keywords: keywords}}
        username={props.username}
      />
    </>
  );
}