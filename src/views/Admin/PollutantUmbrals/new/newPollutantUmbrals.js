import React from "react"
import './newPollutantUmbrals.css'
import { Link, Redirect } from "react-router-dom"
import { getRequest, postRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import { withSnackbar } from 'notistack';

class NewPollutantUmbrals extends React.Component {
    state = {
        form: {
            pollutant_id: -1,
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        errors: {
            pollutant_id: "",
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        pollutant_unit: "",
        pollutants: [{ id: -1, name: "Selecciona", unit: "" }],
        submitted: false
    }

    async componentDidMount() {
        const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/pollutants`);
        if (response.status === 200) {
            let res_pollutants = response.data.pollutants;
            res_pollutants.unshift({ id: -1, name: "Seleccionar", unit: "" });
            this.setState({ pollutants: res_pollutants })
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


    onChangePollutant = (e) => {
        let id = +e.target.value
        const pollutant = this.state.pollutants.filter(pollutant => pollutant.id === id)
        let unit = ""
        if (pollutant.length > 0) {
            unit = pollutant[0].unit
        }
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: id
            },
            pollutant_unit: unit
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {
            pollutant_id: "",
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        }
        let isValid = true
        let form = this.state.form
        let umbrals = ['good', 'moderate', 'unhealthy', 'very_unhealthy', 'dangerous']
        Object.keys(form).forEach(field => {
            if (!form[field]) {
                errors[field] = "Este campo es obligatorio"
                isValid = false
            }
        })
        umbrals.forEach(umbral => {
            if (!Number(form[umbral])) {
                errors[umbral] = "Este campo debe ser un número"
                isValid = false
            }
        })
        if (form.pollutant_id === -1) {
            errors.pollutant_id = "Debe seleccionar un contaminante"
            isValid = false
        }
        this.setState({ errors })
        if (isValid) {
            //Post
            try {
                const response = await postRequest(`${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/new`, form);
                if (response.status === 201) {
                    this.props.enqueueSnackbar('Umbrales de contaminante creado correctamente!');
                    this.setState({ submitted: true, })
                }
            } catch (e) {
                this.props.enqueueSnackbar(e.response.data.message);
            }
        }
    }

    render() {
        if (this.state.submitted) {
            return <Redirect to="/admin/umbrales-contaminantes" />
        }
        return (
            <div className="Container">
                <div className="Container__header">
                    <div className="Container__header_row">
                        <h3>Nuevo umbrales de contaminante</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/umbrales-contaminantes/"> Volver</Button>
                        </div>
                    </div>
                    <Divider />
                </div>
                <form className="form">
                    <ul className="text__left">
                        <li>A partir de un tipo de contaminante se definirán las umbrales de salud para mostrarlos en la aplicación</li>
                    </ul>
                    <h4 className="text__left">Contaminante:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="pollutant_id" label="Contaminante" select type="number"
                                SelectProps={{ native: true }} value={this.state.form.pollutant_id} variant="outlined" fullWidth size="small" onChange={this.onChangePollutant} helperText={this.state.errors.pollutant_id} error={Boolean(this.state.errors.pollutant_id)} >
                                {this.state.pollutants.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField className="filled" name="pollutant_unit" label="Unidad" variant="outlined" fullWidth size="small" value={this.state.pollutant_unit} InputProps={{
                                readOnly: true,
                                className: "filled"
                            }} />
                        </Grid>
                    </Grid>
                    <h4 className="text__left">Umbrales:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="good" label="Bueno" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.good} error={Boolean(this.state.errors.good)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="moderate" label="Moderado" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.moderate} error={Boolean(this.state.errors.moderate)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="unhealthy" label="No saludable" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.unhealthy} error={Boolean(this.state.errors.unhealthy)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="very_unhealthy" label="Muy insalubre" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.very_unhealthy} error={Boolean(this.state.errors.very_unhealthy)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="dangerous" label="Peligroso" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.dangerous} error={Boolean(this.state.errors.dangerous)} />
                        </Grid>
                        <Grid item xs={12} md={5}>

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

export default withSnackbar(NewPollutantUmbrals)