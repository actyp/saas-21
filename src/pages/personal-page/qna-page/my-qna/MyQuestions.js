import AnswerStack from "../../../../components/answer-stack/AnswerStack";
import {useState} from "react";
import QuestionColumn from "./QuestionColumn";

function myQuestionFeed() {
  let qL = [];
  for(let id=1; id<=50; id++){
    qL.push(
      {
        id: id,
        title: "Question heading / title" + id,
        text: "Question text",
        keywords: id % 2 === 0 ? ["Question"] : ["related"],
        username: "username",
        date: "Jan 05 2021 04:20"
      },
      {
        id: (100-id),
        title: "Question heading / title" + (100-id),
        text: "Question text",
        keywords: (100-id) % 2 === 0 ? ["keywords"] : ["tags"],
        username: "username",
        date: "Jan 15 2021 04:20"
      }
    );
  }

  return qL;
}

function answers_per_question(qId) {
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

function AnswersPerQuestion(props) {
  const answerList = answers_per_question(props.questionId);

  return(
    <>
      <h4 className="mt-3 text-info">
        {answerList.length + " " + (answerList.length === 1 ? "Answer" : "Answers")}
      </h4>
      <hr/>
      <AnswerStack answerList={answerList}/>
    </>
  );
}

export default function MyQuestions() {
  const [selected, setSelected] = useState(null);
  const questions = myQuestionFeed();

  return(
    <QuestionColumn
      title="My Questions"
      backBtnText="View all questions"
      questions={questions}
      selected={selected}
      setSelected={setSelected}
    >
      <AnswersPerQuestion questionId={selected} />
    </QuestionColumn>
  );
}