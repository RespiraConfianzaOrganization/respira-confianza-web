import React from "react"
import './editSensorUmbrals.css'
import { Link, Redirect } from "react-router-dom"
import { getRequest, putRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, Snackbar, TextField } from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class editSensorUmbrals extends React.Component {
    state = {
        form: {
            sensor_type_id: -1,
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        errors: {
            sensor_type_id: "",
            good: "",
            moderate: "",
            unhealthy: "",
            very_unhealthy: "",
            dangerous: "",
        },
        sensorUmbrals_id: this.props.match.params.id,
        sensor_unit: "",
        sensorTypes: [{ id: -1, type: "Selecciona", unit: "" }],
        openSnackbar: false,
        snackMessage: { message: "", success: false },
        submitted: false
    }

    async componentDidMount() {
        const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types`);
        if (response.status === 200) {
            let res_sensorTypes = response.data.sensorTypes;
            res_sensorTypes.unshift({ id: -1, type: "Seleccionar", unit: "" });
            this.setState({ sensorTypes: res_sensorTypes })
        }

        const responseSensorUmbrals = await getRequest(`${process.env.REACT_APP_API_URL}/api/sensor-umbrals/${this.state.sensorUmbrals_id}`);
        if (response.status === 200) {
            let sensorUmbrals = responseSensorUmbrals.data.sensorUmbrals;
            this.setState({
                form: {
                    sensor_type_id: sensorUmbrals.Sensor_Type.id,
                    good: sensorUmbrals.good,
                    moderate: sensorUmbrals.moderate,
                    unhealthy: sensorUmbrals.unhealthy,
                    very_unhealthy: sensorUmbrals.very_unhealthy,
                    dangerous: sensorUmbrals.dangerous,
                },
                sensor_unit: sensorUmbrals.Sensor_Type.unit
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


    onChangeSensor = (e) => {
        let id = +e.target.value
        const sensor = this.state.sensorTypes.filter(sensor => sensor.id === id)
        let unit = ""
        if (sensor.length > 0) {
            unit = sensor[0].unit
        }
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: id
            },
            sensor_unit: unit
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        let errors = {
            sensor_type_id: "",
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
        if (form.sensor_type_id === -1) {
            errors.sensor_type_id = "Debe seleccionar un sensor"
            isValid = false
        }
        this.setState({ errors })
        if (isValid) {
            //Post
            try {
                const response = await putRequest(`${process.env.REACT_APP_API_URL}/api/sensor-umbrals/${this.state.sensorUmbrals_id}`, form);
                if (response.status === 200) {
                    this.setState({ snackMessage: { message: "Tipo de sensor creado!", success: true }, submitted: true, })
                }
                else {
                    this.setState({
                        snackMessage: { message: "No se pudo modificar los umbrales del sensor", success: false }, openSnackbar: true
                    })
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
            return <Redirect to="/admin/umbrales-sensores" />
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
                        <h3>Editar umbrales de sensor</h3>
                        <div className="Container__header_row_button">
                            <Button color="primary" variant="contained" component={Link} to="/admin/umbrales-sensores/"> Volver</Button>
                        </div>
                    </div>
                    <Divider />
                </div>
                <form className="form">
                    <ul className="text__left">
                        <li>A partir de un tipo de sensor se definirán las umbrales de salud para mostrarlos en la aplicación</li>
                    </ul>
                    <h4 className="text__left">Sensor:</h4>
                    <Grid container spacing={4} justify="center">
                        <Grid item xs={12} md={5}>
                            <TextField name="sensor_type_id" label="Sensor" select type="number"
                                SelectProps={{ native: true }} value={this.state.form.sensor_type_id} variant="outlined" fullWidth size="small" onChange={this.onChangeSensor} helperText={this.state.errors.sensor_type_id} error={Boolean(this.state.errors.sensor_type_id)} >
                                {this.state.sensorTypes.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.type}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <TextField className="filled" name="sensor_unit" label="Unidad" variant="outlined" fullWidth size="small" value={this.state.sensor_unit} InputProps={{
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
                        <Button className="form_button" type="submit" variant="contained" color="primary" onClick={this.handleSubmit} >Agregar</Button>
                    </div>
                </form>
            </div>
        )
    }
}