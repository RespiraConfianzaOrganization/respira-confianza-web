import React from "react"
import moment from "moment"
import { getRequest } from "../../../utils/axios"
import { TextField, MenuItem, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, TablePagination, Paper, Divider } from "@material-ui/core"
import './Readings.css'

class Readings extends React.Component {
  state = {
    search: {
      page: 0,
      limit: 10,
      station: -1
    },
    countAllReadings: 0,
    readings: [],
    stations: [{ id: -1, name: 'Todas' }],
    columns: [
      { id: 'station', label: 'Estación', minWidth: 170 },
      { id: 'TEMP', label: 'Temperatura', },
      { id: 'PRESS', label: 'Presion', },
      { id: 'HR', label: 'Humedad relativa', },
      { id: 'MP10', label: 'MP 10' },
      { id: 'MP25', label: 'MP 2.5', },
      { id: 'SO2', label: 'SO2', },
      { id: 'O3', label: 'O3', },
      { id: 'NO2', label: 'NO2', },
      { id: 'NO', label: 'NO', },
      { id: 'CO2', label: 'CO2', },
      { id: 'CO', label: 'CO', },
      { id: 'COV', label: 'COV', },
      { id: 'recorded_at', label: 'Fecha', },
    ]
  }
  async componentDidMount() {
    await this.getReadings();
    await this.getStations();
  }

  getReadings = async () => {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/station-readings`, {
      limit: this.state.search.limit, page: this.state.search.page, station: this.state.search.station
    });
    if (response.status === 200) {
      this.setState({ readings: response.data.readings, countAllReadings: response.data.countAllReadings })
    }
  }

  getStations = async () => {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/stations`);
    if (response.status === 200) {
      const stations = response.data.stations
      stations.unshift({ id: -1, name: 'Todas' });
      this.setState({ stations });
    }
  };

  handleChangePage = (_, newPage) => {
    this.setState({ search: { ...this.state.search, page: newPage } }, () => this.getReadings());
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ search: { ...this.state.search, limit: +event.target.value } }, () => this.getReadings());
  };

  handleChangeStation = (event) => {
    this.setState({ search: { ...this.state.search, station: event.target.value } }, () => this.getReadings());
  };

  render() {
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h3>Lecturas de las estaciones</h3>
          </div>
          <Divider />
        </div>
        <div className="search__container">
          <TextField
            className="search__byStation"
            select
            variant="outlined"
            label="Estación"
            value={this.state.search.station}
            onChange={this.handleChangeStation}
          >
            {this.state.stations.map((station) => (
              <MenuItem key={station.id} value={station.id}>
                {station.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <Paper className="Paper_container">
          <TableContainer className="Table__container">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {this.state.columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.readings.map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {this.state.columns.map((column) => {
                        let value
                        if (column.id === 'recorded_at') {
                          value = moment(row[column.id]).format("DD/MM/YYYY hh:mm:ss a");
                        }
                        else if (column.id === 'station') {
                          value = row['Station']['name']
                        }
                        else {
                          value = row[column.id];
                        }

                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={this.state.countAllReadings}
            rowsPerPage={this.state.search.limit}
            page={this.state.search.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    )
  }
}

export default Readings