import {Col, Row} from "react-bootstrap";
import MyQuestions from "./my-qna/MyQuestions";
import MyAnswers from "./my-qna/MyAnswers";

export default function QnAPage() {
  return(
    <Row>
      <Col md={5} className="mx-auto mt-4 px-1">
        <MyQuestions />
      </Col>
      <Col md={5} className="mx-auto mt-4 px-1">
        <MyAnswers />
      </Col>
    </Row>
  );
}