import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import HomePage from "./pages/HomePage";
import AttackPage from "./pages/AttackPage";
import ControlPage from "./pages/ControlPage";
import ErrorPage from "./pages/ErrorPage";

const useStyles = makeStyles({
  "@global": {
    body: {
      backgroundColor: "rgba(26,26,29,1)",
      backgroundImage:
        "linear-gradient( 135.8deg,  hsl(240, 5.5%, 10.8%) 27.1%, hsl(3, 53.1%, 28.4%) 77.5% )",
      minHeight: "100vh",
      color: "hsl(3, 100%, 90%)"
    }
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "hsl(3, 100%, 59%)"
    },
    secondary: {
      main: "hsl(64, 100%, 64%)"
    },
    text: {
      primary: "hsl(3, 100%, 20%)",
      secondary: "hsla(3, 100%, 10%, 0.6)"
    },
    background: {
      default: "hsl(3, 100%, 20%)"
    },
    action: {
      disabledBackground: "hsla(3, 20%, 100%, .12)"
    }
  }
});

const App: React.FC = () => {
  useStyles();
  document.title = "Freshy Game";
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/attack" component={AttackPage} />
          <Route path="/control" component={ControlPage} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
