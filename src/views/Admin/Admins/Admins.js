import React from "react"
import { Link } from "react-router-dom"
import { getRequest } from "../../../utils/axios"
import { Button, IconButton, SvgIcon, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, TablePagination, Paper, Divider } from "@material-ui/core"
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";
import "./Admins.css"

class Admins extends React.Component {
    state = {
        page: 0,
        rowsPerPage: 10,
        admins: [],
        columns: [
            { id: 'first_name', label: 'Nombre', minWidth: 170 },
            { id: 'last_name', label: 'Apellido', minWidth: 170 },
            { id: 'email', label: 'Correo', minWidth: 170 },
            { id: 'country', label: 'Pais', minWidth: 170 },
            { id: 'city', label: 'Ciudad', minWidth: 170 },
        ]
    }
    async componentDidMount() {
        const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/admins`);
        if (response.status === 200) {
            this.setState({ admins: response.data.admins })
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
                        <h3>Administradores</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/administradores/nuevo"> Nuevo</Button>
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
                                        style={{ width: '170px' }}
                                    >
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.admins.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => {
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
                        count={this.state.admins.length}
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

export default Admins