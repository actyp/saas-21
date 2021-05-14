import {ListGroup} from "react-bootstrap";
import "./AnswerStack.css";

/*
 * props: text : string, username : string, date : string
 */
function Answer(props) {
  const username = props.username.split('@')[0];
  return(
    <ListGroup.Item className="overflow-auto">
      <p> {props.text} </p>
      <div className="mt-2 text-info text-right">
        answered by <b> {username} </b> on {String(new Date(props.date)).slice(4,21)}
      </div>
    </ListGroup.Item>
  );
}

/*
 * props: answerList : list with answer objects {text, username, date}
 */
export default function AnswerStack(props) {
  const answers = props.answerList.map((props,ix) =>
    <Answer
      key={`answer-${ix}`}
      {...props}
    />
  );

  return(
    <ListGroup>
      {answers}
    </ListGroup>
  );
}