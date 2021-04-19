import {Badge, ListGroup} from "react-bootstrap";
import "./QuestionStack.css";

/*
 * props: title : string, text : string, keywords : string [], username : string, date : string,
 *        id : int, selected : int (selected question id), setSelected : function
 */
function Question(props) {
  const keywords = props.keywords.map((k,i) =>
    k && <Badge key={`keyword-${i}`} variant="light" className="keyword mr-2">{k}</Badge>
  );

  const selected = props.selected === props.id;
  const show = () => props.selected === null || selected;

  return(
      show() &&
      <ListGroup.Item
        className={`question overflow-auto ${selected ? "" : "selectable"}`}
        onClick={() => props.setSelected(props.id)}
      >
        <h5> {props.title} </h5>
        <hr/>
        <p> {props.text} </p>
        <div> {keywords} </div>
        <div className="mt-2 text-info text-right">
          asked by <b> {props.username} </b> on {props.date}
        </div>
      </ListGroup.Item>
  );
}

/*
 * props: questionList : list with question objects {id, title, text, keywords, username, date}
 *        selected : int (question id) setSelected : function to alter selected prop
 */
export default function QuestionStack(props) {
  const selected = props.selected;
  const setSelected = props.setSelected;

  const questions = props.questionList.map((props,ix) =>
    <Question
      key={`question-${ix}`}
      {...props}
      selected={selected}
      setSelected={setSelected}
    />
  );

  return(
    <ListGroup>
      {questions}
    </ListGroup>
  );
}
