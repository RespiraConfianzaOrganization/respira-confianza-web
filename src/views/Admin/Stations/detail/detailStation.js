import React from "react";
import moment from "moment";
import { getRequest, deleteRequest } from "../../../../utils/axios";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Grid,
  SvgIcon,
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import AddPollutant from "./addPollutant";
import "./detailStation.css";

class DetailStation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      station_id: this.props.match.params.id,
      station: null,
      addPollutants: [{ id: -1, name: "Seleccionar" }],
    };
  }

  async componentDidMount() {
    const station = await this.getStation();
    let existing_pollutants = [];
    if (station) {
      existing_pollutants = station.Pollutants;
    }
    const addPollutants = await this.getPollutants(existing_pollutants);
    this.setState({ station: station, addPollutants });
  }

  getStation = async () => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/stations/${this.state.station_id}`
    );
    if (response.status === 200) {
      return response.data.station;
    }
    return null;
  };

  getPollutants = async (pollutants) => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/pollutants`
    );
    if (response.status === 200) {
      let res_pollutants = response.data.pollutants;
      const existing_pollutants = pollutants.map((pollutant) => pollutant.id);
      res_pollutants = res_pollutants.filter((pollutant) => {
        return !existing_pollutants.includes(pollutant.id);
      });
      res_pollutants.unshift({ id: -1, name: "Seleccionar" });
      return res_pollutants;
    }
    return [{ id: -1, name: "Seleccionar" }];
  };

  handleDeletePollutant = async (pollutant_id) => {
    const station_id = this.state.station_id;
    try {
      const response = await deleteRequest(
        `${process.env.REACT_APP_API_URL}/api/pollutant-station/${station_id}&${pollutant_id}`
      );
      if (response.status === 200) {
        //Sacar contaminante de la estación
        const pollutants = this.state.station.Pollutants.filter((pollutant) => {
          return pollutant.id !== pollutant_id;
        });
        const station = this.state.station;
        station.Pollutants = pollutants;
        //Agregar contaminate a listado para agregar
        const newToAdd = response.data.pollutant;
        //NUEVO
        this.state.addPollutants.push(newToAdd);
        this.setState({
          station,
          addPollutants: this.state.addPollutants,
        });
        this.props.enqueueSnackbar("Contaminante eliminado correctamente!");
      }
    } catch (e) {
      this.props.enqueueSnackbar(e.response.data.message);
    }
  };

  setPollutantAndStation = async (newPollutants, station) => {
    this.setState({ addPollutants: newPollutants, station });
  };

  render() {
    if (!this.state.station) {
      return null;
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h3>Detalle estación</h3>
            <div className="Container__header_row_button">
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/admin/estaciones/"
              >
                {" "}
                Volver
              </Button>
            </div>
          </div>
          <Divider />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Información"
                classes={{
                  title: "header_detail_station",
                }}
              />
              <Divider />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>{this.state.station.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>País</TableCell>
                    <TableCell>{this.state.station.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>{this.state.station.city}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Latitud</TableCell>
                    <TableCell>{this.state.station.latitude}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Longitud</TableCell>
                    <TableCell>{this.state.station.longitude}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{this.state.station.status}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Agregada</TableCell>
                    <TableCell>
                      {moment(this.state.station.created_at).format(
                        "DD/MM/YYYY hh:mm:ss"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <Grid item>
              <Card>
                <CardHeader
                  title="Private Key"
                  classes={{
                    title: "header_detail_station",
                  }}
                />
                <Divider />
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>{this.state.station.private_key}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Contaminantes Actuales"
                classes={{
                  title: "header_detail_station",
                }}
              />
              <Divider />
              <AddPollutant
                station={this.state.station}
                addPollutants={this.state.addPollutants}
                setPollutantAndStation={this.setPollutantAndStation}
                enqueueSnackbar={this.props.enqueueSnackbar}
              />
              <Divider />
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Contaminante</TableCell>
                    <TableCell>Unidad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                  {this.state.station.Pollutants.map((pollutant) => (
                    <TableRow key={pollutant.id}>
                      <TableCell>{pollutant.name}</TableCell>
                      <TableCell>{pollutant.unit} </TableCell>
                      <TableCell>
                        <IconButton
                          className="Delete__button"
                          onClick={() =>
                            this.handleDeletePollutant(pollutant.id)
                          }
                        >
                          <SvgIcon fontSize="small">
                            <DeleteIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withSnackbar(DetailStation);
