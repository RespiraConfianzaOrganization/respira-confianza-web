
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { Provider } from "react-redux";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import store from "./store/store";
import { loadUser } from "./actions/auth";
import Page from "./components/Layout/Page";
import Login from "./views/Login";
import Map from "./views/Map";
import { NavBarCustumer, DrawnerCustumer } from "./components/Layout/Layout";
import "./App.css";
import { cssVariables, theme } from "./theme";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    zIndex: 1251,
    overflow: "hidden",
    fontFamily: theme.fontFamily,
    backgroundColor: "#f5f8fb"
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
    justifyContent: "center",
    alignItems: "center"
  },
}));

function App() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  const classes = useStyles();

  return (
    <Provider store={store}>
      <Router>
        <SnackbarProvider maxSnack={3}>
          <ThemeProvider theme={{ ...theme, ...cssVariables }}>
            <div className={classes.root}>
              <div className={classes.appFrame}>
                <NavBarCustumer open={open} setOpen={setOpen} />
                <DrawnerCustumer open={open} setOpen={setOpen} />
                <main className={classes.content}>
                  <Switch>
                    <Route exact path="/" component={Map} />
                    <Route exact path="/ingresar" component={Login} />
                    <Route path="/admin" component={Page} />
                  </Switch>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </SnackbarProvider>
      </Router>
    </Provider>
  );
}

export default App;