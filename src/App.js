
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import store from "./store/store";
import Page from "./components/Layout/Page";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import "./App.css";
import { cssVariables, theme } from "./theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    zIndex: 1,
    overflow: "hidden",
    fontFamily: theme.fontFamily,
  },
  appFrame: {
    display: "flex",
    width: "100%",
    height: "100%",
  },
  content: {
    display: "flex",
    flexGrow: 1,
    width: "100%",
    overflowY: "auto",
    marginTop: 48,
    textAlign: "center",
    justifyContent: "center",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={{ ...theme, ...cssVariables }}>
          <div className={classes.root}>
            <div className={classes.appFrame}>
              <main className={classes.content}>
                <Switch>
                  <Route exact path="/inicio/" component={Home} />
                  <Route exact path="/ingresar/" component={Login} />
                  <Route path="/" component={Page} />
                </Switch>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

export default App;