import {ChartTemplate, LoadingHandler} from "../../components";
import {questionsPerDate, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";


export default function DatePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(true);

  useFetchDataOnMount(
    {
      asyncFetch: questionsPerDate,
      mounted: mounted,
      setMounted: setMounted,
      dataState: data,
      setDataState: setData,
      setLoading: setLoading
    }
  );

  return (
    <>
      <h3 className="text-center mb-4">Questions per Period</h3>
      <LoadingHandler data={data} loading={loading} text="Loading questions per date...">
        <ChartTemplate
          mainChart = 'area'
          secChart = 'radar'
          obj = {{key: 'date', value: ['questions']}}
          data = {data}
          table = {{keyHeading : 'Date', valueHeading : ['Questions posted']}}
        />
      </LoadingHandler>
    </>
  );
}