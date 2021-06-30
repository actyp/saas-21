import {Card, CardDeck} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import './BodyCards.css';

export default function BodyCards(props) {
  const cardList = props.cardList;
  const cards = cardList.map((cd, index) =>
    <Card key={`card-${index}`}>
      <Card.Img variant="top" src={cd.imgSource}/>
      <Card.Body>
        <Card.Title> {cd.bodyTitle} </Card.Title>
        <Card.Text> {cd.bodyText} </Card.Text>
      </Card.Body>
      <Card.Footer className="p-0">
        <Link to={cd.footerHref}>
          <Button variant="light" block disabled={cd.btnDisabled}>
            {cd.btnText}
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );

  return(
    <CardDeck>
      {cards}
    </CardDeck>
  );
}
