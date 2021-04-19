import {
  Bar, BarChart, Brush,  CartesianGrid,
  Pie, PieChart, LabelList, Label,
  ResponsiveContainer, Tooltip,
  XAxis, YAxis
} from "recharts";
import {Alert, Button, Col, Row, Table} from "react-bootstrap";
import {useState} from "react";
import Paginate from "../../components/paginate/Paginate";

function get_data() {
  let data = [];
  for (let i=1; i<=200; i++) {
    data.push({
        'keyword': `k-${i}`,
        'questions': Math.ceil(Math.random()*1000)
      })
  }
  return data;
}

export default function KeywordPage(){
  const [currentTablePage, setCurrentTablePage] = useState(0);
  const [isSynced, setIsSynced] = useState(false);
  const data = get_data();

  const paginate = () => {
    const keywordsPerPage = 15;
    const offset = currentTablePage * keywordsPerPage;
    const pageCount = Math.ceil(data.length / keywordsPerPage);
    const currentQPage = data.slice(offset, offset + keywordsPerPage);
    return [pageCount, currentQPage];
  };
  const [pageCount, currentTPage] = paginate();

  const table_rows = currentTPage.map(({keyword, questions}) =>
    <tr key={keyword}>
      <td>{keyword}</td>
      <td>{questions}</td>
    </tr>
  );

  return (
    <>
      <h3 className="text-center mb-4">Questions per Keyword</h3>
      {data.length === 0
       ?<Alert variant="danger" className="mx-auto mt-5 w-25">
          <Alert.Heading>Something Went Wrong...</Alert.Heading>
          <p>Please try again later.</p>
        </Alert>
       :<>
          <ResponsiveContainer width="100%" minHeight="75vh">
            <BarChart data={isSynced ? currentTPage : data}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="keyword"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="questions" fill="#8884d8"/>
              <Brush dataKey="questions" height={30} stroke="#8884d8"/>
            </BarChart>
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
              <PieChart>
                <Pie data={currentTPage} dataKey="questions" nameKey="keyword" cx="60%" cy="48%"
                     innerRadius={180} outerRadius={250} paddingAngle={3} fill="#8884d8"
                >
                  <LabelList dataKey="keyword" position="outside" clockWise={true}/>
                  <Label value="In sync with table" position="center"/>
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col>
            <Table striped borderless hover size="sm" className="mx-auto w-50 text-center">
              <thead>
              <tr>
                <th>Keyword</th>
                <th>Questions tagged</th>
              </tr>
              </thead>
              <tbody>{table_rows}</tbody>
            </Table>
            <Paginate
              pageCount={pageCount}
              setCurrentPage={setCurrentTablePage}
              scrollToTop={false}
              resetSelectedPage={false}
              setResetSelectedPage={() => null}
            />
          </Col>
        </Row>
        </>
      }
    </>
  );
}