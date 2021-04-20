import ChartTemplate from "../../components/chart-template/ChartTemplate";

function getData() {
  let data = [];
  for (let i=1; i<=200; i++) {
    data.push({
        'keyword': `k-${i}`,
        'questions': Math.ceil(Math.random()*1000)
      })
  }
  return data;
}

export default function KeywordPage() {
  const data = getData();
  return (
    <>
      <h3 className="text-center mb-4">Questions per Keyword</h3>
      <ChartTemplate
        mainChart = 'bar'
        secChart = 'pie'
        obj = {{key: 'keyword', value: ['questions']}}
        data = {data}
        table = {{keyHeading : 'Keyword', valueHeading : ['Questions tagged']}}
      />
    </>
  );
}