import React from "react"
import moment from "moment"
import { getRequest } from "../../../../utils/axios"
import { Link } from "react-router-dom"
import { Button, Card, CardHeader, Divider, IconButton, Grid, SvgIcon, Table, TableCell, TableRow, TableBody, TextField } from "@material-ui/core"
import {
  Delete as DeleteIcon,
} from "@material-ui/icons";
import "./detailStation.css"

class DetailStation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        values: { pollutant_id: '' },
        errors: {
          pollutant_id: ''
        }
      },
      station_id: this.props.match.params.id,
      station: null,
      addPollutants: [{ id: -1, name: "Seleccionar" }]
    }
  }

  async componentDidMount() {
    await this.getStation();
    await this.getPollutants();
  }

  getStation = async () => {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/stations/${this.state.station_id}`);
    if (response.status === 200) {
      this.setState({ station: response.data.station })
    }
  }

  getPollutants = async () => {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/pollutants`);
    if (response.status === 200) {
      let res_pollutants = response.data.pollutants;
      res_pollutants.unshift({ id: -1, name: "Seleccionar", unit: "" });
      this.setState({ addPollutants: res_pollutants })
    }
  }

  render() {
    if (!this.state.station) {
      return null
    }
    return <div className="Container">
      <div className="Container__header">
        <div className="Container__header_row">
          <h3>Detalle estación</h3>
          <div className="Container__header_row_button">
            <Button color="primary" variant="contained" component={Link} to="/admin/estaciones/"> Volver</Button>
          </div>
        </div>
        <Divider />
      </div>
      <Grid container spacing={2} >
        <Grid item xs={12} md={6}>
          <Card
          >
            <CardHeader title="Información" classes={{
              title: "header_detail_station"
            }} />
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
                  <TableCell>{moment(this.state.station.created_at).format("DD/MM/YYYY hh:mm:ss")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
          >
            <CardHeader title="Contaminantes Actuales" classes={{
              title: "header_detail_station"
            }} />
            <Divider />
            <div className="add_pollutant_station">
              Agregar nuevo
                <TextField name="pollutant_id" label="Contaminante" select type="number"
                SelectProps={{ native: true }} value={this.state.form.pollutant_id} variant="outlined" fullWidth size="small" helperText={this.state.form.errors.pollutant_id} error={Boolean(this.state.form.errors.pollutant_id)} >
                {this.state.addPollutants.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </TextField>
              <Button color="primary" variant="contained">Agregar</Button>
            </div>
            <Divider />
            <Table>
              <TableBody>
                <TableCell>Contaminante</TableCell>
                <TableCell>Unidad</TableCell>
                {this.state.station.Pollutants.map(pollutant => <TableRow>
                  <TableCell>{pollutant.name}</TableCell>
                  <TableCell>{pollutant.unit} </TableCell>
                  <TableCell><IconButton className="Delete__button"
                  >
                    <SvgIcon fontSize="small">
                      <DeleteIcon />
                    </SvgIcon>
                  </IconButton></TableCell>
                </TableRow>)}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>

      <h4>Para enviar los datos que toma la estación al servidor, la estación debe identificarse mediante una private_key.</h4>
      <Grid item xs={12} md={6}>
        <Card
        >
          <CardHeader title="Private Key" classes={{
            title: "header_detail_station"
          }} />
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

    </div >
  }
}

export default DetailStation;