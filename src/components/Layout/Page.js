import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../../common/PrivateRoute";
import Home from "../Home";
// import FooterPage from "./Footer";

export default class Page extends React.Component {
    render() {
        return (
            <div style={{ width: "100%", paddingLeft: "58px" }}>
                <Switch>
                    <PrivateRoute exact path="/admin/" component={Home} />
                </Switch>
            </div>
        );
    }
}