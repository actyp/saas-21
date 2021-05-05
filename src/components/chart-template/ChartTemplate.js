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
  LabelList,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
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
  const color = ["#8884d8", "#82ca9d"];

  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3"/>
      <XAxis dataKey={props.obj.key}/>
      <YAxis/>
      <Tooltip/>
      {props.obj.value.map((v, i) =>
        <Bar key={v} dataKey={v} name={v} fill={color[i]}/>
      )}
      <Brush height={30} stroke="#8884d8"/>
      <Legend verticalAlign="top" />
    </BarChart>
  );
}

// supports string [] in obj value (legend has color issues)
function areaChartMain(props) {
  const data = props.isSynced ? props.partData : props.allData;
  const colorId = ["8884d8", "82ca9d"];

  return(
    <AreaChart data={data}>
      <defs>
        {colorId.map(id =>
          <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={'#'+id} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={'#'+id} stopOpacity={0}/>
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
      <Brush height={30} stroke="#8884d8"/>
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

  return (
    <PieChart>
      <Pie data={data} dataKey={props.obj.value[0]} nameKey={props.obj.key} cx="60%" cy="48%"
           paddingAngle={3} innerRadius={180} outerRadius={250} fill="#8884d8"
      >
        <LabelList dataKey={props.obj.key} position="outside" clockWise='2' stroke="#8884d8"/>
        <Label value="In sync with table" position="center" stroke="#8884d8"/>
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

// supports string [] in obj value
function radarChartSec(props) {
  const data = props.partData;
  const color = ["#8884d8", "#82ca9d"];

  return(
    <RadarChart data={data} innerRadius={50} outerRadius={230} cx="60%" cy="48%">
      <PolarGrid gridType="circle"/>
      <PolarAngleAxis dataKey={props.obj.key} />
      <PolarRadiusAxis />
      <Tooltip />
      {props.obj.value.map((v, i) =>
        <Radar key={v} name={v} dataKey={v} stroke="#8884d8" fill={color[i]} fillOpacity={0.4} />
      )}
    </RadarChart>
  );
}

/* props:
 *  mainChart : 'bar'|'area'
 *  secChart  : 'pie'|'radar'
 *  obj : { key : string, value : string [] }
 *  data : obj []
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
      partData: currentTPage
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
      <p className="text-center text-info">
        <span>Slide the edges to focus on specific region.</span>
        <Button variant="outline-info" className="btn-sm ml-3 shadow-none" onClick={() => setIsSynced(!isSynced)}>
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
            resetSelectedPage={false}
            setResetSelectedPage={() => null}
          />
        </Col>
      </Row>
    </>
  );
}