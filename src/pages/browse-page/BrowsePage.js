import {QuestionStack, Paginate, LoadingHandler} from "../../components";
import FilterForm from "./filter-form/FilterForm";
import AnswerPage from "./answer-page/AnswerPage";
import {Col, Button, Alert, Row} from "react-bootstrap";
import {allQuestions, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";
import {useAuth} from "../../services/auth";


export default function BrowsePage() {
  // filter-form state
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [showCriteria, setShowCriteria] = useState(false);
  // question selected (selected = question id | null)
  const [selected, setSelected] = useState(null);
  // all question list and current page number 0, 1, ...
  const [allQList, setAllQList] = useState([]);
  const [allPageNum, setAllPageNum] = useState(0);
  // show and filtered question list and current page number 0, 1, ...
  const [showFiltered, setShowFiltered] = useState(false);
  const [filteredQList, setFilteredQList] = useState([]);
  const [filteredPageNum, setFilteredPageNum] = useState(0);
  // reset page number
  const [resetPage, setResetPage] = useState({status: false, pageNum: 0});
  // questionsPerFetch variable
  const questionsPerFetch = 60;
  // load more button state
  const [loadMore, setLoadMore] = useState({start: questionsPerFetch, failed: false, noMoreQs: false});
  // component basic state
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: () => allQuestions(0, 9),
      mounted: mounted,
      setMounted: setMounted,
      dataState: allQList,
      setDataState: setAllQList,
      setLoading: setLoading
    }
  );

  const loadQuestions = (start) => {
    const stop = start + questionsPerFetch - 1;
    allQuestions(start, stop).then(qList => {
      if(mounted) {
        if(qList === null) {
          setLoadMore({start: start, failed: true, noMoreQs: false});
          setTimeout(() => {
            setLoadMore({start: start, failed: false, noMoreQs: false})
          }, 2000);
        } else {
          setLoadMore({start: stop + 1, failed: false, noMoreQs: qList.length < questionsPerFetch});
          qList.length > 0 && setAllQList(prev => [...prev, ...qList]);
        }
      }
    });
  };

  const paginate = () => {
    const currentQList = showFiltered ? filteredQList : allQList;
    const currentPageNum = showFiltered ? filteredPageNum : allPageNum;

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
      const notEmptyKeywords = keywords.filter(x => x !== "");
      const isFilteredKeyword = (k) => notEmptyKeywords.includes(k);
      filtered = allQList.filter(q => q.keywords.some(isFilteredKeyword));
    }

    if(dateFrom !== "" && dateTo !== ""){
      const isBetweenDates = (d) => new Date(dateFrom) <= new Date(d) && new Date(d) <= new Date(dateTo);
      filtered = (filtered.length > 0 ? filtered : allQList).filter(q => isBetweenDates(q.date));
    }

    setFilteredQList(filtered);
    setShowFiltered(true);
    setResetPage({status: true, pageNum: 0});
  };

  const onClear = () => {
    setFilteredQList([]);
    setShowFiltered(false);
    setResetPage({status: true, pageNum: allPageNum});
  };

  const alterView = (all, signedIn, qSelected) =>
    selected === null ? (auth.user ? signedIn : all) : qSelected;

  return (
    <Col md={5} className="mx-auto mt-4 px-1">
      <h3 className="text-center mb-4 pt-4">
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
            clearDisabled={!showFiltered}
            showCriteria={showCriteria}
            setShowCriteria={setShowCriteria}
            onFilter={onFilter}
            onClear={onClear}
          />,
          <Button
            variant="light"
            className="mb-2"
            onClick={() => {
              const pageNum = showFiltered ? filteredPageNum : allPageNum;
              setResetPage({status: true, pageNum: pageNum});
              setSelected(null);
            }}
          >
            <i className="fas fa-arrow-alt-circle-left"> Browse all questions </i>
          </Button>
        )
      }
      <LoadingHandler data={allQList} loading={loading} text="Loading questions...">
        {currentQPage.length > 0
          ? <QuestionStack
            scrollToTop="auto"
            questionList={currentQPage}
            selected={selected}
            setSelected={setSelected}
          />
          : <h5 className="text-center">Nothing Found.</h5>
        }
        { alterView(
            <Alert
              variant="success"
              className="mt-3 text-center"
            >
              <h4>Sign in to view more questions</h4>
            </Alert>,
            currentQPage.length > 0 &&
            <>
              <Paginate
                pageCount={pageCount}
                setCurrentPageNum={showFiltered ? setFilteredPageNum : setAllPageNum}
                scrollToTop={true}
                resetPage={resetPage}
                setResetPage={setResetPage}
              />
              {allPageNum === pageCount - 1 && !showFiltered && !loadMore.noMoreQs &&
                <Col className="py-2">
                  <Row className="justify-content-center">
                    <Button
                      className="btn btn-sm shadow-none mx-auto"
                      variant="outline-info"
                      onClick={() => loadQuestions(loadMore.start)}
                    >
                      Load More Questions
                    </Button>
                  </Row>
                  <Row className="justify-content-center mt-1">
                    {loadMore.failed &&
                      <span className="text-danger text-center">
                        Something went wrong, try again later
                      </span>
                    }
                  </Row>
                </Col>
              }
            </>,
            <AnswerPage questionId={selected} />
          )
        }
      </LoadingHandler>
    </Col>
  );
}