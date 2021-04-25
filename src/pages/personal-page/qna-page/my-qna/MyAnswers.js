import {AnswerStack, Loading} from "../../../../components";
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

  const fillAnsObj = (qnaList) => {
    let ansObj = {}
    for (const obj of qnaList) {
      ansObj[`${obj.question.id}`] = obj.answer;
    }
    setAnsObj(ansObj);
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

  return (
    <Loading loading={loading} text="Loading answered questions">
      <QuestionColumn
        title="My Answers"
        backBtnText="View all answered questions"
        questions={qnaObjList.map(obj => obj.question)}
        selected={selected}
        setSelected={setSelected}
      >
        <AnswerPerQuestion ansObj={ansObj} questionId={selected}/>
      </QuestionColumn>
    </Loading>
  );
}  