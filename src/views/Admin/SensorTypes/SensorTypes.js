import React from "react"
import { Link } from "react-router-dom"
import { getRequest } from "../../../utils/axios"
import { Button, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, TablePagination, Paper, Divider } from "@material-ui/core"
import "./SensorTypes.css"

class SensorTypes extends React.Component {
    state = {
        page: 0,
        rowsPerPage: 10,
        sensorTypes: [],
        columns: [
            { id: 'type', label: 'Tipo', minWidth: 170 },
            { id: 'unit', label: 'Unidad', minWidth: 170 },
        ]
    }
    async componentDidMount() {
        const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types`);
        if (response.status === 200) {
            this.setState({ sensorTypes: response.data.sensorTypes })
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
                        <h3>Tipos de Sensores</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/tipos-de-sensores/nuevo"> Nuevo</Button>
                        </div>
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
                                {this.state.sensorTypes.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {this.state.columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
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
                        count={this.state.sensorTypes.length}
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

export default SensorTypes