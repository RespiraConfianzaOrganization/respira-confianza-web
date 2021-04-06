import React from "react"
import './editPollutantUmbrals.css'
import { Link, Redirect } from "react-router-dom"
import { getRequest, putRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import { withSnackbar } from 'notistack';

class EditPollutantUmbrals extends React.Component {
    state = {
        form: {
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        errors: {
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        pollutant: {
            id: this.props.match.params.id,
            name: "",
            unit: ""
        },
        submitted: false
    }

    async componentDidMount() {
        const responsePollutantUmbrals = await getRequest(`${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/${this.state.pollutant.id}`);
        if (responsePollutantUmbrals.status === 200) {
            let pollutantUmbrals = responsePollutantUmbrals.data.pollutantUmbrals;
            this.setState({
                form: {
                    good: pollutantUmbrals.good,
                    moderate: pollutantUmbrals.moderate,
                    unhealthy: pollutantUmbrals.unhealthy,
                    very_unhealthy: pollutantUmbrals.very_unhealthy,
                    dangerous: pollutantUmbrals.dangerous,
                },
                pollutant: {
                    ...this.state.pollutant,
                    name: pollutantUmbrals.Pollutant.name,
                    unit: pollutantUmbrals.Pollutant.unit
                }
            })

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

    handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {
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
        this.setState({ errors })
        if (isValid) {
            //Post
            try {
                const response = await putRequest(`${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/${this.state.pollutant.id}`, form);
                if (response.status === 200) {
                    this.props.enqueueSnackbar('Umbrales de contaminante editados correctamente!');
                    this.setState({ submitted: true, })
                }
                else {
                    this.props.enqueueSnackbar('No se pudo editar');
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
                        <h3>Editar umbrales de contaminante</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/umbrales-contaminantes/"> Volver</Button>
                        </div>
                    </div>
                    <Divider />
                </div>
                <form className="form">
                    <ul className="text__left">
                        <li>Sólo se pueden editar los umbrales. Si se desea, puedes eliminar los umbrales para este contaminante.</li>
                        <li>A partir de un tipo de contaminante se definirán las umbrales de salud para mostrarlos en la aplicación</li>
                    </ul>
                    <h4 className="text__left">contaminante:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="pollutant_id" label="Contaminante" value={this.state.pollutant.name} variant="outlined" fullWidth size="small" helperText={this.state.errors.pollutant_id} error={Boolean(this.state.errors.pollutant_id)}
                                InputProps={{
                                    readOnly: true,
                                    className: "filled"
                                }} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField className="filled" name="pollutant_unit" label="Unidad" variant="outlined" fullWidth size="small" value={this.state.pollutant.unit} InputProps={{
                                readOnly: true,
                                className: "filled"
                            }} />
                        </Grid>
                    </Grid>
                    <h4 className="text__left">Umbrales:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="good" label="Bueno" value={this.state.form.good} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.good} error={Boolean(this.state.errors.good)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="moderate" label="Moderado" value={this.state.form.moderate} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.moderate} error={Boolean(this.state.errors.moderate)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="unhealthy" label="No saludable" value={this.state.form.unhealthy} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.unhealthy} error={Boolean(this.state.errors.unhealthy)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="very_unhealthy" label="Muy insalubre" value={this.state.form.very_unhealthy} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.very_unhealthy} error={Boolean(this.state.errors.very_unhealthy)} />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField name="dangerous" label="Peligroso" value={this.state.form.dangerous} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.dangerous} error={Boolean(this.state.errors.dangerous)} />
                        </Grid>
                        <Grid item xs={12} md={5}>

                        </Grid>
                    </Grid>
                    <div className="form__row_button">
                        <Button className="form_button" type="submit" variant="contained" color="primary" onClick={this.handleSubmit} >Guardar</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export default withSnackbar(EditPollutantUmbrals)