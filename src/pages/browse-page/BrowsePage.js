import {QuestionStack, Paginate, LoadingHandler} from "../../components";
import FilterForm from "./filter-form/FilterForm";
import AnswerPage from "./answer-page/AnswerPage";
import {Col, Button, Alert} from "react-bootstrap";
import {allQuestions, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";
import {useAuth} from "../../services/auth";


export default function BrowsePage() {
  // filter-form state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keywords, setKeywords] = useState([]);
  // question selected (selected = question id | null)
  const [selected, setSelected] = useState(null);
  // all fetched questions
  const [allQList, setAllQList] = useState([]);
  // current question list: all or filtered
  const [currentQList, setCurrentQList] = useState([]);
  // current page number 0, 1, 2, ...
  const [currentPageNum, setCurrentPageNum] = useState(0);
  // reset current page number on filter
  const [resetSelectedPage, setResetSelectedPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: allQuestions,
      mounted: mounted,
      setMounted: setMounted,
      dataState: allQList,
      setDataState: setAllQList,
      setLoading: setLoading,
      afterFunc: setCurrentQList
    }
  );

  const paginate = () => {
    if (currentQList) {
      const questionsPerPage = 10;
      const offset = currentPageNum * questionsPerPage;
      const pageCount = Math.ceil(currentQList.length / questionsPerPage);
      const currentQPage = currentQList.slice(offset, offset + questionsPerPage);
      return [pageCount, currentQPage];
    } else return [0, []];
  };
  const [pageCount, currentQPage] = paginate();

  const onFilter = () => {
    let filtered = [];

    if(keywords.length !== 0){
      const isFilteredKeyword = (k) => keywords.includes(k);
      filtered = allQList.filter(q => q.keywords.some(isFilteredKeyword));
    }

    if(dateFrom !== "" && dateTo !== ""){
      const isBetweenDates = (d) => new Date(dateFrom) <= new Date(d) && new Date(d) <= new Date(dateTo);
      filtered = (filtered.length > 0 ? filtered : allQList).filter(q => isBetweenDates(q.date));
    }

    if(filtered.length > 0) {
      setCurrentQList(filtered);
      setCurrentPageNum(0);
      setResetSelectedPage(true);
    }
  };

  const onClear = () => {
    setCurrentQList(allQList);
  };

  const alterView = (all, sin, sel) =>
    selected === null ? (auth.user ? sin : all) : sel;

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
      <LoadingHandler data={allQList} loading={loading} text="Loading answers...">
        <QuestionStack
          scrollToTop="auto"
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
              setCurrentPageNum={setCurrentPageNum}
              scrollToTop={true}
              resetSelectedPage={resetSelectedPage}
              setResetSelectedPage={setResetSelectedPage}
            />,
            <AnswerPage questionId={selected} />
          )
        }
      </LoadingHandler>
    </Col>
  );
}