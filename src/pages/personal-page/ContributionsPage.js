import {ChartTemplate, Loading} from "../../components";
import {dailyContributionsPerUserId, useFetchDataOnMount} from "../../services/api";
import {useAuth} from "../../services/auth";
import {useState} from "react";


export default function ContributionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  const auth = useAuth();

  useFetchDataOnMount(
    {
      asyncFetch: () => dailyContributionsPerUserId(auth.user.id),
      mounted: mounted,
      setMounted: setMounted,
      dataState: data,
      setDataState: setData,
      setLoading: setLoading
    }
  );

  return (
    <Loading loading={loading} text="Loading daily contributions...">
      <h3 className="text-center mb-4">My daily contributions</h3>
      <ChartTemplate
        mainChart = 'bar'
        secChart = 'radar'
        obj = {{key: 'date', value: ['questions', 'answers']}}
        data = {data}
        table = {{keyHeading : 'Date', valueHeading : ['Questions posted', 'Answers posted']}}
      />
    </Loading>
  );
}