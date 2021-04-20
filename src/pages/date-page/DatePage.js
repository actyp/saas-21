import ChartTemplate from "../../components/chart-template/ChartTemplate";

function getData() {
  let data = [];
  const start=new Date('2021/01/01');
  const end=new Date('2021/01/02');

  for (let i=1; i<=200; i++) {
    data.push({
      'date': new Date(start.getTime() + i * (end.getTime() - start.getTime())).toDateString(),
      'questions': Math.ceil(Math.random()*1000)
    })
  }
  return data;
}

export default function DatePage() {
  const data = getData();
  return (
    <>
      <h3 className="text-center mb-4">Questions per Period</h3>
      <ChartTemplate
        mainChart = 'area'
        secChart = 'radar'
        obj = {{key: 'date', value: ['questions']}}
        data = {data}
        table = {{keyHeading : 'Date', valueHeading : ['Questions posted']}}
      />
    </>
  );
}