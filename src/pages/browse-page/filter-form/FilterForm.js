import {Button, Form, InputGroup, Table} from "react-bootstrap";
import isDate from "validator/es/lib/isDate";
import {useState} from "react";
import "./FilterForm.css";

export default function FilterForm(props) {
  const [disableClear, setDisableClear] = useState(true);
  const [error, setError] = useState({});

  const formValid = () => {
    let valid = true;
    let errors = {};

    if(!isDate(props.dateFrom) && props.dateFrom !== "") {
      errors['date'] = "Insert valid From date.";
      valid = false;
    }

    if(!isDate(props.dateTo) && props.dateTo !== "") {
      const errorTo = "Insert valid To date.";
      errors['date'] = errors['date'] ? `${errors['date'].slice(0,-1)} and To date`: errorTo;
      valid = false;
    }

    const isSingleDateBlank = (d1, d2) => (!d1 && d2) || (d1 && !d2);
    if(isSingleDateBlank(props.dateFrom, props.dateTo)) {
      errors['date'] += " Complete either both dates or none.";
      valid = false;
    }

    if (valid && new Date(props.dateFrom) > new Date(props.dateTo)) {
      errors['date'] = "Date From should be less or equal than Date To.";
      valid = false;
    }

    if (props.keywords.every(k => k === "")) {
      errors['keywords'] = "Keywords should not be blank.";
      valid = false;
    }

    setError(errors);
    return valid;
  }

  return (
    <Form id="filter-form" className="my-2">
      <Form.Group>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>From</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            placeholder="Date: yyyy/mm/dd or yyyy-mm-dd"
            value={props.dateFrom}
            onChange={e => {
              props.setShowCriteria(false);
              props.setDateFrom(e.target.value)
            }}
          />
          <InputGroup.Prepend className="ml-n1">
            <InputGroup.Text>To</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            placeholder="Date: yyyy/mm/dd or yyyy-mm-dd"
            value={props.dateTo}
            onChange={e => {
              props.setShowCriteria(false);
              props.setDateTo(e.target.value);
            }}
          />
        </InputGroup>
        <Form.Text id="error-date" className="text-danger">
          <span> {error['date']} </span>
        </Form.Text>

      </Form.Group>
      <Form.Group>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text><i className="fas fa-tag"> </i></InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            id="filter-form-keywords"
            placeholder="Keywords to filter...  e.g. forty;two"
            value={props.keywords.join(';')}
            onChange={e => {
              props.setShowCriteria(false);
              props.setKeywords(e.target.value === "" ? [] : e.target.value.split(';'));
            }}
          />
          <InputGroup.Append id="filter-form-buttons">
            <Button
              variant="outline-info shadow-none"
              disabled={!props.dateFrom.length && !props.dateTo.length && !props.keywords.length}
              onClick={() => {
                if(formValid()) {
                  setDisableClear(false);
                  props.setShowCriteria(true);
                  props.onFilter();
                }
              }}
            >
              Filter Questions
            </Button>
            <Button
              variant="outline-danger shadow-none"
              disabled={disableClear}
              onClick={() => {
                setDisableClear(true);
                props.setShowCriteria(false);
                props.onClear();
              }}
            >
              Clear Filter
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className="text-muted ml-5">
          Separate keywords with semicolon ( ; )
          <span className="text-danger ml-2">{error['keywords']}</span>
        </Form.Text>
        <Form.Text className="text-muted ml-5">
          All keywords are in lowercase.
        </Form.Text>
      </Form.Group>
      <hr />
      {props.showCriteria &&
        <>
          <h5 className="text-center">Filter Criteria</h5>
          <Table borderless hover>
            <tbody>
              {props.dateFrom.length > 0 &&
              <tr>
                <td><b>From</b></td>
                <td className="text-right">{props.dateFrom}</td>
              </tr>
              }
              {props.dateTo.length > 0 &&
              <tr>
                <td><b>To</b></td>
                <td className="text-right">{props.dateTo}</td>
              </tr>
              }
              {props.keywords.length > 0 &&
              <tr>
                <td><b>Keywords</b></td>
                <td className="text-right">{props.keywords.filter(x => x !== "").join(', ')}</td>
              </tr>
              }
            </tbody>
          </Table>
          <hr/>
        </>
      }
    </Form>
  );
}