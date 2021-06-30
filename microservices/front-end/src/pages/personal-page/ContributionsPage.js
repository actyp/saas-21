import {ChartTemplate, LoadingHandler} from "../../components";
import {myContributions, useFetchDataOnMount} from "../../services/api";
import {useAuth} from "../../services/auth";
import {useState} from "react";

function findWeekDays(data) {
  const weekDays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let desiredObj = {};
  for (const d of weekDays) {
    desiredObj[d] = { questions: 0, answers: 0 };
  }
  for (const obj of data) {
    const weekDay = weekDays[new Date(obj['date']).getDay()];
    desiredObj[weekDay]['questions'] += obj['questions'];
    desiredObj[weekDay]['answers'] += obj['answers'];
  }

  let desired = [];
  for(const day in desiredObj) {
    desired.push({
      'date': day,
      'questions': desiredObj[day]['questions'],
      'answers': desiredObj[day]['answers']
    });
  }
  return desired;
}

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
      <h3 className="text-center mb-4 pt-4 page-title">My daily contributions</h3>
      <LoadingHandler data={data} loading={loading} text="Loading daily contributions...">
        <ChartTemplate
          mainChart = 'bar'
          secChart = 'radar'
          obj = {{key: 'date', value: ['questions', 'answers']}}
          data = {data}
          transformData = {findWeekDays}
          table = {{keyHeading : 'Date', valueHeading : ['Questions posted', 'Answers posted']}}
        />
      </LoadingHandler>
    </>
  );
}