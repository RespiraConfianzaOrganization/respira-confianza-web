import React from "react"
import moment from "moment"
import { getRequest } from "../../../utils/axios"
import { Table, TableBody, TableHead, TableCell, TableContainer, TableRow, TablePagination, Paper, Divider } from "@material-ui/core"

class Readings extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    readings: [],
    columns: [
      { id: 'station', label: 'Estación', minWidth: 170 },
      { id: 'Temperatura', label: 'Temperatura', },
      { id: 'Presion', label: 'Presion', },
      { id: 'Humedad', label: 'Humedad', },
      { id: 'MP25', label: 'MP 2.5', },
      { id: 'MP1', label: 'MP 1' },
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
  }

  getReadings = async () => {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/station-readings`);
    if (response.status === 200) {
      this.setState({ readings: response.data.readings })
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value });
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
                {this.state.readings.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {this.state.columns.map((column) => {
                        let value
                        if (column.id === 'recorded_at') {
                          value = moment(row[column.id]).format("DD/MM/YYYY hh:mm:ss");
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
            count={this.state.readings.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    )
  }
}

export default Readings