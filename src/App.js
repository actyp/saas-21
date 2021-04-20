import NavBarSignedOut from "./components/navbar/NavBarSignedOut";
import NavBarSignedIn from "./components/navbar/NavBarSignedIn";
import LandingPage from "./pages/landing-page/LandingPage";
import KeywordPage from "./pages/keyword-page/KeywordPage";
import DatePage from "./pages/date-page/DatePage";
import AskPage from "./pages/ask-page/AskPage";
import BrowsePage from "./pages/browse-page/BrowsePage";
import PersonalPage from "./pages/personal-page/PersonalPage";
import ContributionsPage from "./pages/personal-page/ContributionsPage";
import Footer from "./components/footer/Footer";
import {Switch, Route} from "react-router-dom";
import {useState} from "react";
import "./App.css";

function NavBarOI(props) {
  return (
    !props.isSignedIn
      ? <NavBarSignedOut {...props.navSignedOutProps}/>
      : <NavBarSignedIn {...props.navSignedInProps}/>
  );
}

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState("");

  const navSignedOutProps = {
    setUsername: setUsername,
    setIsSignedIn: setIsSignedIn
  };
  const navSignedInProps = {
    setIsSignedIn:setIsSignedIn,
    username: username,
    setUsername: setUsername
  };

  return (
    <>
      <NavBarOI isSignedIn={isSignedIn}
                navSignedOutProps={navSignedOutProps}
                navSignedInProps={navSignedInProps}
      />
      <div id="content" className="container-fluid">
          <Switch>
            <Route exact path="/">
              <LandingPage isSignedIn={isSignedIn}/>
            </Route>
            <Route exact path="/keyword">
              <KeywordPage />
            </Route>
            <Route exact path="/date">
              <DatePage />
            </Route>
            <Route exact path="/ask">
              <AskPage username={username}/>
            </Route>
            <Route exact path="/browse">
              <BrowsePage isSignedIn={isSignedIn} username={username}/>
            </Route>
            <Route exact path="/personal">
              <PersonalPage />
            </Route>
            {/*<Route exact path="/personal/qna">
              <QnAPage />
            </Route>*/}
            <Route exact path="/personal/contributions">
              <ContributionsPage />
            </Route>
          </Switch>
      </div>
      <Footer />
    </>
  );
}
