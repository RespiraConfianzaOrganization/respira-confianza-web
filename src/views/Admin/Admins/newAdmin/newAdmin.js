import React from "react"
import { Link, Redirect } from "react-router-dom"
import { postRequest, getRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import { validateEmail } from "../../../../utils/validator"
import { withSnackbar } from 'notistack';
import "./newAdmin.css"

class NewAdmin extends React.Component {
    state = {
        form: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country_id: "",
            city_id: ""
        },
        errors: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country_id: "",
            city_id: ""
        },
        countries: [],
        cities: [{ id: -1, name: "Seleccionar" }],
        submitted: false
    }

    async componentDidMount() {
        const response = await getRequest(
            `${process.env.REACT_APP_API_URL}/api/countries`
        );
        if (response.status === 200) {
            let res_countries = response.data.countries;
            let countries = res_countries
            countries.unshift({ id: -1, name: "Seleccionar" });
            this.setState({ countries });
        }
    }

    onChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
    }

    onChangeCountry = async (e) => {
        const country_id = +e.target.value
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: country_id
            }
        })
        const response = await getRequest(
            `${process.env.REACT_APP_API_URL}/api/cities/country/${country_id}`
        );
        if (response.status === 200) {
            let res_cities = response.data.cities;
            let cities = res_cities
            cities.unshift({ id: -1, name: "Seleccionar" });
            this.setState({ cities });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            country_id: "",
            city_id: ""
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
                    this.props.enqueueSnackbar('Administrador creado correctamente!');
                    this.setState({ submitted: true, })
                }
            } catch (e) {
                this.props.enqueueSnackbar(e.response.data.message,);
            }
        }
    }

    render() {
        if (this.state.submitted) {
            return <Redirect to="/admin/administradores" />
        }
        return (
            <div className="Container">
                <div className="Container__header">
                    <div className="Container__header_row">
                        <h3>Nuevo administrador</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/administradores/"> Volver</Button>
                        </div>
                    </div>
                    <Divider />
                </div>
                <form className="form">
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="first_name" label="Nombre" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.first_name} error={Boolean(this.state.errors.first_name)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="last_name" label="Apellido" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.last_name} error={Boolean(this.state.errors.last_name)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="email" label="Email" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.email} error={Boolean(this.state.errors.email)} />
                        </Grid>
                        <Grid item xs={12} md={5} />
                    </Grid>
                    <h4 className="text__left">Ubicación:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField
                                name="country_id"
                                label="País"
                                variant="outlined"
                                select
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ native: true }}
                                fullWidth size="small"
                                onChange={this.onChangeCountry}
                                helperText={this.state.errors.country}
                                error={Boolean(this.state.errors.country)} >
                                {this.state.countries.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}</TextField>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField
                                name="city_id"
                                label="Ciudad" variant="outlined"
                                select
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ native: true }}
                                fullWidth size="small"
                                onChange={this.onChange}
                                helperText={this.state.errors.city_id}
                                error={Boolean(this.state.errors.city_id)} >
                                {this.state.cities.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <h4 className="text__left">Contraseña:</h4>
                    <Grid container spacing={4} justify="center">
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
            </div >
        )
    }
}

export default withSnackbar(NewAdmin)