import AnswerStack from "../../../../components/answer-stack/AnswerStack";
import {useState} from "react";
import QuestionColumn from "./QuestionColumn";

function QnAFeed() {
  let qnaL = [];
  for(let id=1; id<=50; id++){
    qnaL.push(
      {
        q: {
          id: id,
          title: "Question heading / title" + id,
          text: "Question text",
          keywords: id % 2 === 0 ? ["Question"] : ["related"],
          username: "username",
          date: "Jan 05 2021 04:20"
        },
        a: {
          text: "Answer text for question: " + id,
          username: "me",
          date: "date"
        }
      }
    );
  }

  return qnaL;
}

function AnswerPerQuestion(props) {
  return (
    <>
      <hr/>
      <AnswerStack answerList={[props.answer_obj[`${props.selected}`]]}/>
    </>
  );
}

export default function MyAnswers() {
  const [selected, setSelected] = useState(null);
  const QnAObj = QnAFeed();

  let answer_obj= {}
  for (const obj of QnAObj) {
    answer_obj[`${obj.q.id}`] = obj.a;
  }

  return(
    <QuestionColumn
      title="My Answers"
      backBtnText="View all answered questions"
      questions={QnAObj.map(obj => obj.q)}
      selected={selected}
      setSelected={setSelected}
    >
      <AnswerPerQuestion answer_obj={answer_obj} selected={selected}/>
    </QuestionColumn>
  );
}