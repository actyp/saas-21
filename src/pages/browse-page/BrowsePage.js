import FilterForm from "./filter-form/FilterForm";
import QuestionStack from "../../components/question-stack/QuestionStack";
import AnswerPage from "./answer-page/AnswerPage";
import Paginate from "../../components/paginate/Paginate";
import {Col, Button, Alert} from "react-bootstrap";
import {useState} from "react";

function questionFeed() {
  let qL = [];
  for(let id=1; id<=100; id++){
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
        id: (200-id),
        title: "Question heading / title" + (200-id),
        text: "Question text",
        keywords: (200-id) % 2 === 0 ? ["keywords"] : ["tags"],
        username: "username",
        date: "Jan 15 2021 04:20"
      }
    );
  }

  return qL;
}

export default function BrowsePage(props) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [resetSelectedPage, setResetSelectedPage] = useState(false);

  const wholeQList = questionFeed();
  const [currentQList, setCurrentQList] = useState(wholeQList);

  const onFilter = () => {
    let filtered = [];

    if(keywords.length !== 0){
      const isFilteredKeyword = (k) => keywords.includes(k);
      filtered = wholeQList.filter(q => q.keywords.some(isFilteredKeyword));
    }

    if(dateFrom !== "" && dateTo !== ""){
      const isBetweenDates = (d) => new Date(dateFrom) <= new Date(d) && new Date(d) <= new Date(dateTo);
      filtered = (filtered.length > 0 ? filtered : wholeQList).filter(q => isBetweenDates(q.date));
    }

    if(filtered.length > 0) {
      setCurrentQList(filtered);
      setCurrentPage(0);
      setResetSelectedPage(true);
    }
  };

  const onClear = () => {
    setDateFrom("");
    setDateTo("");
    setKeywords([]);
    setCurrentQList(wholeQList);
  };

  const paginate = () => {
    const questionsPerPage = 10;
    const offset = currentPage * questionsPerPage;
    const pageCount = Math.ceil(currentQList.length / questionsPerPage);
    const currentQPage = currentQList.slice(offset, offset + questionsPerPage);
    return [pageCount, currentQPage];
  };
  const [pageCount, currentQPage] = paginate();

  const alterView = (all, sin, sel) => selected === null ? (props.isSignedIn ? sin : all) : sel;

  return (
    <Col md={5} className="mx-auto mt-4 px-1">
      <h3 className="text-center mb-4">
        {selected === null ? "Browse Questions" : "Answer Question"}
      </h3>
      { alterView(
        null,
          <FilterForm
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            keywords={keywords}
            setKeywords={setKeywords}
            onFilter={onFilter}
            onClear={onClear}
          />,
          <Button
            variant="light"
            className="mb-2"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setKeywords([]);
              setSelected(null);
            }}
          >
            <i className="fas fa-arrow-alt-circle-left"> Browse all questions </i>
          </Button>
        )
      }
      <QuestionStack
        questionList={currentQPage}
        selected={selected}
        setSelected={setSelected}
      />
      { alterView(
          <Alert
            variant="success"
            className="mt-3 text-center"
          >
            <h4>Sign in to view more questions</h4>
          </Alert>,
          <Paginate
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
            scrollToTop={true}
            resetSelectedPage={resetSelectedPage}
            setResetSelectedPage={setResetSelectedPage}
          />,
          <AnswerPage
            isSignedIn={props.isSignedIn}
            username={props.username}
            questionId={selected}
          />
        )
      }
    </Col>
  );
}