import {NavBarSignedOut, NavBarSignedIn, PrivateRoute, Footer} from "./components";
import {ProvideAuth, useAuth} from "./services/auth";
import {Switch, Route, BrowserRouter} from "react-router-dom";
import React from "react";
import "./App.css";
import {
  LandingPage,
  KeywordPage,
  DatePage,
  BrowsePage,
  AskPage,
  PersonalPage,
  QnAPage,
  ContributionsPage
} from "./pages";

function ScrollToTopOnMount(props) {
  window.scrollTo({
    top: 0,
    behavior: "auto"
  });

  return props.content;
}

function NavBarOI() {
  const auth = useAuth();
  return (
    auth.user === null ? <NavBarSignedOut /> : <NavBarSignedIn />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProvideAuth>
        <div id="content" className="container-fluid">
          <NavBarOI />
          <Switch>
              <Route exact path="/">
                <ScrollToTopOnMount content={<LandingPage />} />
              </Route>
              <Route exact path="/keyword">
                <ScrollToTopOnMount content={<KeywordPage />} />
              </Route>
              <Route exact path="/date">
                <ScrollToTopOnMount content={<DatePage />} />
              </Route>
              <Route exact path="/browse">
                <ScrollToTopOnMount content={<BrowsePage />} />
              </Route>
              <PrivateRoute>
                <Route exact path="/ask">
                  <ScrollToTopOnMount content={<AskPage />} />
                </Route>
                <Route exact path="/personal">
                  <ScrollToTopOnMount content={<PersonalPage />} />
                </Route>
                <Route exact path="/personal/qna">
                  <ScrollToTopOnMount content={<QnAPage />} />
                </Route>
                <Route exact path="/personal/contributions">
                  <ScrollToTopOnMount content={<ContributionsPage />} />
                </Route>
              </PrivateRoute>

          </Switch>
        </div>
        <Footer />
      </ProvideAuth>
    </BrowserRouter>
  );
}
