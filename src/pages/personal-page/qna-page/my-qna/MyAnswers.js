import {AnswerStack, LoadingHandler} from "../../../../components";
import QuestionColumn from "./QuestionColumn";
import {answerPerQuestionPerUserId, useFetchDataOnMount} from "../../../../services/api";
import {useAuth} from "../../../../services/auth";
import {useState} from "react";

function AnswerPerQuestion(props) {
  return (
    <>
      <hr/>
      <AnswerStack answerList={[props.ansObj[`${props.questionId}`]]}/>
    </>
  );
}

export default function MyAnswers() {
  const [selected, setSelected] = useState(null);
  const [qnaObjList, setQnaObjList] = useState([]);
  const [ansObj, setAnsObj] = useState({});
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  const fillAnsObj = (qnaObjList) => {
    if (qnaObjList) {
      let ansObj = {}
      for (const obj of qnaObjList) {
        ansObj[`${obj.question.id}`] = obj.answer;
      }
      setAnsObj(ansObj);
    }
  };

  useFetchDataOnMount(
    {
      asyncFetch: () => answerPerQuestionPerUserId(auth.user.id),
      mounted: mounted,
      setMounted: setMounted,
      dataState: qnaObjList,
      setDataState: setQnaObjList,
      setLoading: setLoading,
      afterFunc: fillAnsObj
    }
  );

  const questions = qnaObjList ? qnaObjList.map(obj => obj.question) : [];

  return (
    <>
      <h3 className="text-center mb-4">My Answers</h3>
      <LoadingHandler data={qnaObjList} loading={loading} text="Loading answered questions">
        <QuestionColumn
          backBtnText="View all answered questions"
          questions={questions}
          selected={selected}
          setSelected={setSelected}
        >
          <AnswerPerQuestion ansObj={ansObj} questionId={selected}/>
        </QuestionColumn>
      </LoadingHandler>
    </>
  );
}  