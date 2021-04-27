import {QuestionStack, Paginate} from "../../../../components";
import {Button} from "react-bootstrap";
import {useState} from "react";

export default function QuestionColumn(props) {
  const [currentPageNum, setCurrentPageNum] = useState(0);
  const questions = props.questions;

  const paginate = () => {
    if (questions) {
      const questionsPerPage = 10;
      const offset = currentPageNum * questionsPerPage;
      const pageCount = Math.ceil(questions.length / questionsPerPage);
      const currentQPage = questions.slice(offset, offset + questionsPerPage);
      return [pageCount, currentQPage];
    } else return [0 ,[]];
  };
  const [pageCount, currentQPage] = paginate();

  return (
    <>
      {props.selected !== null &&
      <Button variant="light" className="mb-2" onClick={() => props.setSelected(null)}>
        <i className="fas fa-arrow-alt-circle-left"> {props.backBtnText} </i>
      </Button>
      }
      <QuestionStack
        scrollToTop="auto"
        questionList={currentQPage}
        selected={props.selected}
        setSelected={props.setSelected}
      />
      {props.selected === null
        ? <Paginate
          pageCount={pageCount}
          setCurrentPageNum={setCurrentPageNum}
          scrollToTop={true}
          resetSelectedPage={false}
          setResetSelectedPage={() => null}
        />
        : props.children
      }
    </>
  );
}