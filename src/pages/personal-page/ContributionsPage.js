import {ChartTemplate, LoadingHandler} from "../../components";
import {myContributions, useFetchDataOnMount} from "../../services/api";
import {useAuth} from "../../services/auth";
import {useState} from "react";


export default function ContributionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: () => myContributions(auth.tokenObj),
      mounted: mounted,
      setMounted: setMounted,
      dataState: data,
      setDataState: setData,
      setLoading: setLoading
    }
  );

  return (
    <>
      <h3 className="text-center mb-4">My daily contributions</h3>
      <LoadingHandler data={data} loading={loading} text="Loading daily contributions...">
        <ChartTemplate
          mainChart = 'bar'
          secChart = 'radar'
          obj = {{key: 'date', value: ['questions', 'answers']}}
          data = {data}
          table = {{keyHeading : 'Date', valueHeading : ['Questions posted', 'Answers posted']}}
        />
      </LoadingHandler>
    </>
  );
}