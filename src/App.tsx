import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
