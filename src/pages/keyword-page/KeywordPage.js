import {ChartTemplate, LoadingHandler} from "../../components";
import {questionsPerKeyword, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";

function findTenMostFrequentKeywords(data) {
  if (data.length <= 10)
    return data;

  const compare = (a, b) => {
    if (a['questions'] === b['questions']) {
      return a['keyword'] === b['keyword'] ? 0 : (a['keyword'] < b['keyword'] ? -1 : 1);
    } else {
      return a['questions'] - b['questions'];
    }
  }

  let desired = [];
  for (const obj of data) {
    if (desired.length < 10) {
      desired.push(obj)
      if (desired.length === 10) {
        desired.sort(compare);
      }
    } else {
      if (obj['questions'] > desired[0]['questions']) {
        desired[0] = obj;
        desired.sort(compare);
      }
    }
  }
  return desired;
}

export default function KeywordPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(true);

  useFetchDataOnMount(
    {
      asyncFetch: questionsPerKeyword,
      mounted: mounted,
      setMounted: setMounted,
      dataState: data,
      setDataState: setData,
      setLoading: setLoading
    }
  );

  return (
    <>
      <h3 className="text-center mb-4 pt-4">Questions per Keyword</h3>
      <LoadingHandler data={data} loading={loading} text="Loading questions per keyword...">
        <ChartTemplate
          mainChart = 'bar'
          secChart = 'pie'
          obj = {{key: 'keyword', value: ['questions']}}
          data = {data}
          transformData = {findTenMostFrequentKeywords}
          table = {{keyHeading : 'Keyword', valueHeading : ['Questions tagged']}}
        />
      </LoadingHandler>
    </>
  );
}