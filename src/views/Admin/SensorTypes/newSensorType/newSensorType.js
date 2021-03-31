import React from "react"
import { Link, Redirect } from "react-router-dom"
import { postRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import { withSnackbar } from 'notistack'
import "./newSensorType.css"

class NewSensorType extends React.Component {
  state = {
    form: {
      type: "",
      unit: "",
    },
    errors: {
      type: "",
      unit: "",
    },
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
      type: "",
      unit: "",
    }
    let isValid = true
    let form = this.state.form

    Object.keys(form).forEach(field => {
      if (!form[field]) {
        errors[field] = "Este campo es obligatorio"
        isValid = false
      }
    })
    this.setState({ errors })
    if (isValid) {
      //Post
      try {
        const response = await postRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types/new`, form);
        if (response.status === 201) {
          this.props.enqueueSnackbar('Tipo de sensor creado correctamente!');
          this.setState({ submitted: true, })
        }
      } catch (e) {
        this.props.enqueueSnackbar(e.response.data.message,);
      }
    }
  }

  render() {
    if (this.state.submitted) {
      return <Redirect to="/admin/tipos-de-sensores" />
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h3>Nuevo tipo de sensor</h3>
            <div className="Container__header_row_button">
              <Button color="primary" variant="contained" component={Link} to="/admin/tipos-de-sensores/"> Volver</Button>
            </div>
          </div>
          <Divider />
        </div>
        <form className="form">
          <ul className="text__left">
            <li>El tipo de sensor puede ser de Presión, Temperatura, NOX, CO2,etc</li>
            <li>La unidad se refiere a la unidad de medida con la que el sensor enviará los datos (°C, Pa, ect)</li>
          </ul>
          <h4 className="text__left">Información:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField name="type" label="Tipo" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.type} error={Boolean(this.state.errors.type)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="unit" label="Unidad" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.unit} error={Boolean(this.state.errors.unit)} />
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

export default withSnackbar(NewSensorType)