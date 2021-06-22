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
  Tooltip,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import Loading from "../../../../common/Loading";
import AddPollutant from "./addPollutant";
import "./detailStation.css";

class DetailStation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      station_id: this.props.match.params.id,
      station: null,
      addPollutants: [{ id: -1, name: "Seleccionar" }],
      stationExist: true,
      copySuccess: 'Copiar llave',
      loading: true,
    };
  }

  async componentDidMount() {
    const station = await this.getStation();
    let existing_pollutants = [];
    if (station) {
      existing_pollutants = station.Pollutants;
    }
    const addPollutants = await this.getPollutants(existing_pollutants);
    this.setState({ station: station, addPollutants, loading: false });
  }

  getStation = async () => {
    try {
      const response = await getRequest(
        `${process.env.REACT_APP_API_URL}/api/stations/${this.state.station_id}`
      );
      if (response.status === 200) {
        return response.data.station;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  getPollutants = async (pollutants) => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/pollutants`
    );
    if (response.status === 200) {
      let res_pollutants = response.data.pollutants;
      const existing_pollutants = pollutants.map((pollutant) => pollutant.name);
      res_pollutants = res_pollutants.filter((pollutant) => {
        return !existing_pollutants.includes(pollutant.name);
      });
      res_pollutants.unshift({ id: -1, name: "Seleccionar" });
      return res_pollutants;
    }
    return [{ id: -1, name: "Seleccionar" }];
  };

  handleDeletePollutant = async (pollutant) => {
    const station_id = this.state.station_id;
    try {
      const response = await deleteRequest(
        `${process.env.REACT_APP_API_URL}/api/pollutant-station/${station_id}&${pollutant}`
      );
      if (response.status === 200) {
        //Sacar contaminante de la estación
        const pollutants = this.state.station.Pollutants.filter((pollutantInstance) => {
          return pollutantInstance.name !== pollutant;
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

  handleCopyText = () => {
    var textField = document.createElement('textarea')
    textField.innerText = this.state.station.private_key
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    this.setState({ copySuccess: 'Llave copiada exitosamente' });
  }

  render() {
    if (this.state.loading) {
      return <Loading />
    }
    if (!this.state.station) {
      return <div>
        <h2>Estación no existe</h2>
      </div>
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
                    <TableCell>{this.state.station.City.Country.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>{this.state.station.City.name}</TableCell>
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
                      <TableCell>
                        <Tooltip disableFocusListener title={this.state.copySuccess}>
                          <IconButton
                            className="Copy__button"
                            onClick={this.handleCopyText}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
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
                    <TableRow key={pollutant.name}>
                      <TableCell>{pollutant.name}</TableCell>
                      <TableCell>{pollutant.unit} </TableCell>
                      <TableCell>
                        <IconButton
                          className="Delete__button"
                          onClick={() =>
                            this.handleDeletePollutant(pollutant.name)
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
