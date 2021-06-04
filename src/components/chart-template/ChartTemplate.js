import {useState} from "react";
import {Button, Col, Row, Table} from "react-bootstrap";
import Paginate from "../paginate/Paginate";
import "./ChartTemplate.css";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Label,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

/*
 * mainChartProps:
 *  isSynced : boolean
 *  obj : { key : string, value : string [] }
 *  allData : obj [] (all data)
 *  partData : obj [] (slice of allData)
 */

// supports string [] in obj value (legend is ok)
function barChartMain(props) {
  const data = props.isSynced ? props.partData : props.allData;
  const dataLen = data.length;
  const color = ["#20B2AA", "#FC8F8F"];

  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey={props.obj.key}/>
      <YAxis/>
      <Tooltip/>
      {props.obj.value.map((v, i) =>
        <Bar key={v} dataKey={v} name={v} fill={color[i]}/>
      )}
      <Brush height={30} stroke="#8884d8" startIndex={dataLen < 30 ? 0 : dataLen-30}/>
      <Legend verticalAlign="top" />
    </BarChart>
  );
}

// supports string [] in obj value (legend has color issues)
function areaChartMain(props) {
  const data = props.isSynced ? props.partData : props.allData;
  const dataLen = data.length;
  const colorId = ["20B2AA", "FC8F8F"];

  return(
    <AreaChart data={data}>
      <defs>
        {colorId.map(id =>
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={'#'+id} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={'#'+id} stopOpacity={0.2}/>
          </linearGradient>
        )}
      </defs>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey={props.obj.key} />
      <YAxis/>
      <Tooltip/>
      {props.obj.value.map((v, i) =>
        <Area key={v} name={v} type="monotone" dataKey={v} sfillOpacity={1} fill={`url(#${colorId[i]})`} />
      )}
      <Brush height={30} stroke="#8884d8" startIndex={dataLen < 30 ? 0 : dataLen-30}/>
      <Legend verticalAlign="top" />
    </AreaChart>
  );
}

/*
 * secChartProps:
 *  obj : { key : string, value : string [] }
 *  partData : obj array (slice of allData)
 */

// semi supports string [] in obj value (uses obj.value[0] only)
function pieChartSec(props) {
  const data = props.partData;
  const dataLen = data.length;

  return (
    <PieChart>
      <Pie data={data} dataKey={props.obj.value[0]} nameKey={props.obj.key} cx="50%" cy="50%"
           paddingAngle={3} innerRadius='50%' fill="#4682B4" label={{ position: 'outside' }}
      >
        {dataLen > 5 && <Label value="Top 10" position="center" stroke="#4682B4"/>}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

// supports string [] in obj value
function radarChartSec(props) {
  const data = props.partData;
  const isSingle = props.obj.value.length === 1;
  const color = [isSingle ? "#4682B4" : "#20B2AA", "#FC8F8F"];

  return(
    <RadarChart data={data} innerRadius='20%' cx="50%" cy="50%">
      <PolarGrid gridType="circle"/>
      <PolarAngleAxis dataKey={props.obj.key} />
      <Tooltip />
      {props.obj.value.map((v, i) =>
        <Radar key={v} name={v} dataKey={v} fill={color[i]} fillOpacity={isSingle ? 0.6 : 0.4} />
      )}
    </RadarChart>
  );
}

/* props:
 *  mainChart : 'bar'|'area'
 *  secChart  : 'pie'|'radar'
 *  obj : { key : string, value : string [] }
 *  data : obj []
 *  transformData : fn for transforming data for secChart
 *  table : { keyHeading : string, valueHeading : string [] }
 */
export default function ChartTemplate(props) {
  const [currentTablePage, setCurrentTablePage] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const allData = props.data;

  const paginate = () => {
    if (allData) {
      const itemsPerPage = 15;
      const offset = currentTablePage * itemsPerPage;
      const pageCount = Math.ceil(allData.length / itemsPerPage);
      const currentTPage = allData.slice(offset, offset + itemsPerPage);
      return [pageCount, currentTPage];
    } else return [0, []];
  };
  const [pageCount, currentTPage] = paginate();

  const getMainChart = () => {
    const chartProps = {
      obj: props.obj,
      isSynced: isSynced,
      allData: allData,
      partData: currentTPage
    };
    switch (props.mainChart) {
      case 'bar'  : return barChartMain({...chartProps});
      case 'area' : return areaChartMain({...chartProps});
      default     : return barChartMain({...chartProps});
    }
  };
  const mainChart = getMainChart();

  const getSecChart = () => {
    const chartProps = {
      obj: props.obj,
      partData: props.transformData ? props.transformData(allData) : currentTPage
    };
    switch (props.secChart) {
      case 'pie'  : return pieChartSec({...chartProps});
      case 'radar': return radarChartSec({...chartProps});
      default     : return pieChartSec({...chartProps});
    }
  };
  const secChart = getSecChart();

  const tableHead = (
    <tr>
      <th>{props.table['keyHeading']}</th>
      {props.table['valueHeading'].map(v => <th key={v}>{v}</th>)}
    </tr>
  );

  const tableRows = currentTPage.map(obj =>
    <tr key={obj[props.obj.key]}>
      <td>{obj[props.obj.key]}</td>
      {props.obj.value.map(v => <td key={v}>{obj[v]}</td>)}
    </tr>
  );

  return (
    <>
      <ResponsiveContainer width="100%" minHeight="75vh">
        {mainChart}
      </ResponsiveContainer>
      <p className="text-center text-primary">
        <span>Slide the whole or the blue edges to focus on specific region.</span>
        <Button variant="outline-primary" className="btn-sm ml-3 shadow-none" onClick={() => setIsSynced(!isSynced)}>
          {isSynced ? 'Show all' : 'Sync to table'}
        </Button>
      </p>
      <Row className="mt-4">
        <Col>
          <ResponsiveContainer minWidth="100%" height="100%">
            {secChart}
          </ResponsiveContainer>
        </Col>
        <Col>
          <Table striped borderless hover size="sm" className="mx-auto w-50 text-center">
            <thead>{tableHead}</thead>
            <tbody>{tableRows}</tbody>
          </Table>
          <Paginate
            pageCount={pageCount}
            setCurrentPageNum={setCurrentTablePage}
            scrollToTop={false}
          />
        </Col>
      </Row>
    </>
  );
}