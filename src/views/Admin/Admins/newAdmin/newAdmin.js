import React from "react"
import { Link, Redirect } from "react-router-dom"
import { postRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, Snackbar, TextField } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';
import { validateEmail, validateUsername } from "../../../../utils/validator"
import "./newAdmin.css"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class newAdmin extends React.Component {
    state = {
        form: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country: "",
            city: ""
        },
        errors: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country: "",
            city: ""
        },
        openSnackbar: false,
        snackMessage: { message: "", success: false },
        submitted: false
    }

    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country: "",
            city: ""
        }
        let isValid = true
        let form = this.state.form
        Object.keys(form).forEach(field => {
            if (!form[field]) {
                errors[field] = "Este campo es obligatorio"
                isValid = false
            }
        })

        if (!validateEmail(form.email)) {
            errors.email = "Debe ingresar email válido"
            isValid = false
        }
        if (form.username.length < 8 || form.username.length > 15) {
            errors.username = "Username debe tener entre 8 a 15 carácteres"
            isValid = false
        }
        if (!validateUsername(form.username)) {
            errors.username = "Debe ingresar username válido"
            isValid = false
        }
        if (form.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 carácteres"
            isValid = false
        }
        if (form.password !== form.passwordConfirmation) {
            errors.password = "Contraseñas no coinciden"
            errors.passwordConfirmation = "Contraseñas no coinciden"
            isValid = false
        }
        this.setState({ errors })
        if (isValid) {
            //Post
            try {
                const response = await postRequest(`${process.env.REACT_APP_API_URL}/api/admins/new`, form);
                if (response.status === 201) {
                    this.setState({ snackMessage: { message: "Administrador creado!", success: true }, submitted: true, })
                }
            } catch (e) {
                this.setState({
                    snackMessage: { message: e.response.data.message, success: false }, openSnackbar: true
                })
            }


        }
    }
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSnackbar: false });
    };

    render() {
        if (this.state.submitted) {
            return <Redirect to="/admin/administradores" />
        }
        return (
            <div className="Container">
                <Snackbar open={this.state.openSnackbar} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity={this.state.snackMessage.success ? "success" : "error"}>
                        {this.state.snackMessage.message}
                    </Alert>
                </Snackbar>
                <div className="Container__header">
                    <div className="Container__header_row">
                        <h3>Nuevo administrador</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/administradores/"> Volver</Button>
                        </div>
                    </div>
                    <Divider />
                </div>
                <ul>
                    <li>
                        El username solo puede contener letras, numeros y _ .
                    </li>
                </ul>
                <form className="form">
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="first_name" label="Nombre" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.first_name} error={Boolean(this.state.errors.first_name)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="last_name" label="Apellido" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.last_name} error={Boolean(this.state.errors.last_name)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="username" label="Usuario" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.username} error={Boolean(this.state.errors.username)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="email" label="Email" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.email} error={Boolean(this.state.errors.email)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="country" label="País" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.country} error={Boolean(this.state.errors.country)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="city" label="Ciudad" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.city} error={Boolean(this.state.errors.city)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField type="password" name="password" label="Contraseña" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.password} error={Boolean(this.state.errors.password)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField type="password" name="passwordConfirmation" label="Confirmación contraseña" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.passwordConfirmation} error={Boolean(this.state.errors.passwordConfirmation)} />
                        </Grid>
                    </Grid>
                    <div className="form__row_button">
                        <Button className="form_button" type="submit" variant="contained" color="primary" onClick={this.handleSubmit} >Agregar</Button>
                    </div>
                </form>
            </div>
        )
    }
}