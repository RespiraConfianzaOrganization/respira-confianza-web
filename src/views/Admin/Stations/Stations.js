import React from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../../../utils/axios";
import {
  IconButton,
  SvgIcon,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  Paper,
  Divider,
} from "@material-ui/core";
import {
  ArrowForward as ArrowIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";
import "./Stations.css";
import DeleteStation from "./deleteStation/deleteStation";

class Stations extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 10,
    stations: [],
    openModal: false,
    selectedStation: null,
    columns: [
      { id: "name", label: "Nombre", minWidth: 270 },
      { id: "country", label: "País" },
      { id: "city", label: "Ciudad" },
      { id: "latitude", label: "Latitud" },
      { id: "longitude", label: "Longitud" },
      { id: "status", label: "Estado", minWidth: 170 },
    ],
  };
  async componentDidMount() {
    await this.getStations();
  }

  getStations = async () => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/stations`
    );
    if (response.status === 200) {
      this.setState({ stations: response.data.stations });
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ page: 0, rowsPerPage: +event.target.value });
  };

  handleDeleteClick = (value, selected) => {
    this.setState({ openModal: value, selectedStation: selected });
  };

  render() {
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h3>Estaciones</h3>
            <div className="Container__header_row_button">
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/admin/estaciones/nueva"
              >
                {" "}
                Nueva
              </Button>
            </div>
          </div>
          <Divider />
        </div>
        {this.state.openModal ? (
          <DeleteStation
            openModal={this.state.openModal}
            handleDeleteClick={this.handleDeleteClick}
            station={this.state.selectedStation}
            getStations={this.getStations}
          />
        ) : null}
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
                  <TableCell key={"admin"} style={{ minWidth: "170px" }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.stations
                  .slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                    this.state.rowsPerPage
                  )
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {this.state.columns.map((column) => {
                          let value = row[column.id];
                          if (column.id === "country") {
                            value = row['City']['Country']['name'];
                          }
                          if (column.id === "city") {
                            value = row['City']['name'];
                          }
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {value}
                            </TableCell>
                          );
                        })}

                        <TableCell key="acciones" className="Action_buttons">
                          <IconButton
                            className="Watch__button"
                            to={`/admin/estaciones/${row.id}/`}
                            component={Link}
                          >
                            <SvgIcon fontSize="small">
                              <ArrowIcon />
                            </SvgIcon>
                          </IconButton>

                          <IconButton
                            className="Edit__button"
                            to={`/admin/estaciones/${row.id}/editar/`}
                            component={Link}
                          >
                            <SvgIcon fontSize="small">
                              <EditIcon />
                            </SvgIcon>
                          </IconButton>
                          <IconButton
                            className="Delete__button"
                            onClick={() => this.handleDeleteClick(true, row)}
                          >
                            <SvgIcon fontSize="small">
                              <DeleteIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={this.state.stations.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    );
  }
}

export default Stations;
