import React from "react"
import { Link } from "react-router-dom"
import { getRequest } from "../../../utils/axios"
import { Button, IconButton, SvgIcon, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, TablePagination, Paper, Divider } from "@material-ui/core"
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import "./SensorUmbrals.css"

class SensorUmbrals extends React.Component {
    state = {
        page: 0,
        rowsPerPage: 10,
        sensorUmbrals: [],
        columns: [
            { id: 'type', label: 'Sensor', minWidth: 270 },
            { id: 'unit', label: 'Unidad', minWidth: 170 },
            { id: 'good', label: 'Bueno', minWidth: 170 },
            { id: 'moderate', label: 'Moderado', minWidth: 170 },
            { id: 'unhealthy', label: 'No saludable', minWidth: 170 },
            { id: 'very_unhealthy', label: 'Muy insalubre', minWidth: 170 },
            { id: 'dangerous', label: 'Peligroso', minWidth: 170 },
        ]
    }
    async componentDidMount() {
        const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/sensor-umbrals`);
        if (response.status === 200) {
            this.setState({ sensorUmbrals: response.data.sensorUmbrals })
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
                        <h3>Umbrales de Salud de Sensores</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/umbrales-sensores/nuevo"> Nuevo</Button>
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
                                    <TableCell
                                        key={"admin"}
                                        style={{ minWidth: '170px' }}
                                    >
                                        Acciones
                                        </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.sensorUmbrals.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {this.state.columns.map((column) => {

                                                if (column.id === 'type' || column.id === 'unit') {
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {row['Sensor_Type'][column.id]}
                                                        </TableCell>
                                                    );
                                                }
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell key="acciones" className="Action_buttons">
                                                <IconButton className="Edit__button"
                                                >
                                                    <SvgIcon fontSize="small">
                                                        <EditIcon />
                                                    </SvgIcon>
                                                </IconButton>
                                                <IconButton className="Delete__button"
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
                        count={this.state.sensorUmbrals.length}
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

export default SensorUmbrals