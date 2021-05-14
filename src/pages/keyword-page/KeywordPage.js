import {ChartTemplate, LoadingHandler} from "../../components";
import {questionsPerKeyword, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";


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
          table = {{keyHeading : 'Keyword', valueHeading : ['Questions tagged']}}
        />
      </LoadingHandler>
    </>
  );
}