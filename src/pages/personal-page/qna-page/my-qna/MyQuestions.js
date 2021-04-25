import {AnswerStack,Loading} from "../../../../components";
import QuestionColumn from "./QuestionColumn";
import {answersPerQuestionId, questionsPerUserId, useFetchDataOnMount} from "../../../../services/api";
import {useAuth} from "../../../../services/auth";
import {useState} from "react";

function AnswersPerQuestion(props) {
  const [answerList, setAnswerList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);

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

  return(
    <Loading loading={loading} text="Loading answers..." >
      <h4 className="mt-3 text-info">
        {answerList.length + " " + (answerList.length === 1 ? "Answer" : "Answers")}
      </h4>
      <hr/>
      <AnswerStack answerList={answerList}/>
    </Loading>
  );
}

export default function MyQuestions() {
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: () => questionsPerUserId(auth.user.id),
      mounted: mounted,
      setMounted: setMounted,
      dataState: questions,
      setDataState: setQuestions,
      setLoading: setLoading
    }
  );

  return(
    <Loading loading={loading} text="Loading my questions..." >
      <QuestionColumn
          title="My Questions"
          backBtnText="View all questions"
          questions={questions}
          selected={selected}
          setSelected={setSelected}
      >
          <AnswersPerQuestion questionId={selected}/>
      </QuestionColumn>
    </Loading>
  );
}