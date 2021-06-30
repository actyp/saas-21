import {AnswerStack,LoadingHandler} from "../../../../components";
import QuestionColumn from "./QuestionColumn";
import {answersPerQuestionId, myQuestions, useFetchDataOnMount} from "../../../../services/api";
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
    <LoadingHandler data={answerList} loading={loading} text="Loading answers..." >
      <h4 className="mt-3 text-info">
        {answerList.length + " " + (answerList.length === 1 ? "Answer" : "Answers")}
      </h4>
      <hr/>
      <AnswerStack answerList={answerList}/>
    </LoadingHandler>
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
      asyncFetch: () => myQuestions(auth.tokenObj),
      mounted: mounted,
      setMounted: setMounted,
      dataState: questions,
      setDataState: setQuestions,
      setLoading: setLoading
    }
  );

  return(
    <>
      <h3 className="text-center mb-4 page-title">My Questions</h3>
      <LoadingHandler data={questions} loading={loading} text="Loading my questions..." >
        <QuestionColumn
            backBtnText="View all questions"
            questions={questions}
            selected={selected}
            setSelected={setSelected}
        >
            <AnswersPerQuestion questionId={selected}/>
        </QuestionColumn>
      </LoadingHandler>
    </>
  );
}