import {ChartTemplate, LoadingHandler} from "../../components";
import {questionsPerDate, useFetchDataOnMount} from "../../services/api";
import {useState} from "react";

function findWeekDays(data) {
  const weekDays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let desiredObj = {};
  for (const d of weekDays) {
    desiredObj[d] = { questions: 0 };
  }
  for (const obj of data) {
    const weekDay = weekDays[new Date(obj['date']).getDay()];
    desiredObj[weekDay]['questions'] += obj['questions'];
  }

  let desired = [];
  for(const day in desiredObj) {
    desired.push({
      'date': day,
      'questions': desiredObj[day]['questions']
    });
  }
  return desired;
}

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
      <h3 className="text-center mb-4 pt-4">Questions per Period</h3>
      <LoadingHandler data={data} loading={loading} text="Loading questions per date...">
        <ChartTemplate
          mainChart = 'area'
          secChart = 'radar'
          obj = {{key: 'date', value: ['questions']}}
          data = {data}
          transformData = {findWeekDays}
          table = {{keyHeading : 'Date', valueHeading : ['Questions posted']}}
        />
      </LoadingHandler>
    </>
  );
}