import React from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "../../common/PrivateRoute";
import Home from "../../views/Home";
import { Admins, newAdmin } from "../../views/Admin/Admins"
import { Stations, newStation, editStation } from "../../views/Admin/Stations"
import { SensorTypes, newSensorType, editSensorType } from "../../views/Admin/SensorTypes"
import { SensorUmbrals, newSensorUmbrals, editSensorUmbrals } from "../../views/Admin/SensorUmbrals"
// import FooterPage from "./Footer";

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
                    {/*  SensorTypes   */}
                    <PrivateRoute exact path="/admin/tipos-de-sensores" component={SensorTypes} />
                    <PrivateRoute exact path="/admin/tipos-de-sensores/nuevo" component={newSensorType} />
                    <PrivateRoute exact path="/admin/tipos-de-sensores/:id/editar/" component={editSensorType} />
                    {/*  SensorUmbrals   */}
                    <PrivateRoute exact path="/admin/umbrales-sensores" component={SensorUmbrals} />
                    <PrivateRoute exact path="/admin/umbrales-sensores/nuevo" component={newSensorUmbrals} />
                    <PrivateRoute exact path="/admin/umbrales-sensores/:id/editar/" component={editSensorUmbrals} />
                </Switch>
            </div>
        );
    }
}