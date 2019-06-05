import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AttackPage from "./pages/AttackPage";
import ErrorPage from "./pages/ErrorPage";

const App: React.FC = () => {
  document.title = "Freshy Game";
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/attack" component={AttackPage} />
        <Route component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
