import {NavBarSignedOut, NavBarSignedIn, PrivateRoute, Footer} from "./components";
import {ProvideAuth, useAuth} from "./services/auth";
import {Switch, Route, BrowserRouter} from "react-router-dom";
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
import React from "react";

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
        <NavBarOI />
        <div id="content" className="container-fluid">
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route exact path="/keyword">
                <KeywordPage />
              </Route>
              <Route exact path="/date">
                <DatePage />
              </Route>
              <Route exact path="/browse">
                <BrowsePage />
              </Route>
              <PrivateRoute>
                <Route exact path="/ask">
                  <AskPage />
                </Route>
                <Route exact path="/personal">
                  <PersonalPage />
                </Route>
                <Route exact path="/personal/qna">
                  <QnAPage />
                </Route>
                <Route exact path="/personal/contributions">
                  <ContributionsPage />
                </Route>
              </PrivateRoute>
            </Switch>
        </div>
        <Footer />
      </ProvideAuth>
    </BrowserRouter>
  );
}
