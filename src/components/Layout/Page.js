import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../../common/PrivateRoute";
import Home from "../../views/Home";
import { Admins, newAdmin } from "../../views/Admin/Admins"
import { Stations, newStation, editStation, DetailStation } from "../../views/Admin/Stations"
import { Pollutants } from "../../views/Admin/Pollutants"
import { PollutantUmbrals, newPollutantsUmbrals, editPollutantsUmbrals } from "../../views/Admin/PollutantUmbrals"
import { Readings } from "../../views/Admin/Readings"

export default class Page extends React.Component {
    render() {
        return (
            <div style={{ width: 'calc(100% - 58px)', paddingLeft: "58px" }}>
                <Switch>
                    <PrivateRoute exact path="/admin/" component={Home} />

                    {/*  Admins   */}
                    <PrivateRoute exact path="/admin/administradores" component={Admins} />
                    <PrivateRoute exact path="/admin/administradores/nuevo" component={newAdmin} />
                    {/*  Stations   */}
                    <PrivateRoute exact path="/admin/estaciones" component={Stations} />
                    <PrivateRoute exact path="/admin/estaciones/nueva" component={newStation} />
                    <PrivateRoute exact path="/admin/estaciones/:id/editar/" component={editStation} />
                    <PrivateRoute exact path="/admin/estaciones/:id" component={DetailStation} />
                    {/*  Pollutants   */}
                    <PrivateRoute exact path="/admin/contaminantes" component={Pollutants} />
                    {/*  PollutantsUmbrals   */}
                    <PrivateRoute exact path="/admin/umbrales-contaminantes" component={PollutantUmbrals} />
                    <PrivateRoute exact path="/admin/umbrales-contaminantes/nuevo" component={newPollutantsUmbrals} />
                    <PrivateRoute exact path="/admin/umbrales-contaminantes/:id/editar/" component={editPollutantsUmbrals} />
                    {/*   Readings    */}
                    <PrivateRoute exact path="/admin/lecturas" component={Readings} />
                </Switch>
            </div>
        );
    }
}