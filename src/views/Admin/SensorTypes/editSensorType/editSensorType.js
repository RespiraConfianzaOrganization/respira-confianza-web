import React from "react"
import { Link, Redirect } from "react-router-dom"
import { getRequest, putRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import { withSnackbar } from "notistack"
import "./editSensorType.css"

class EditSensorType extends React.Component {
  state = {
    form: {
      type: "",
      unit: "",
    },
    errors: {
      type: "",
      unit: "",
    },
    sensorType_id: this.props.match.params.id,
    submitted: false
  }

  async componentDidMount() {
    const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types/${this.state.sensorType_id}`);
    if (response.status === 200) {
      const sensorType = response.data.sensorType
      this.setState({
        form: {
          type: sensorType.type,
          unit: sensorType.unit,
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
        const response = await putRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types/${this.state.sensorType_id}`, form);
        if (response.status === 200) {
          this.props.enqueueSnackbar("Tipo de sensor editado correctamente!");
          this.setState({ submitted: true, })
        }
        else {
          this.props.enqueueSnackbar('No se pudo realizar la edición');
        }
      } catch (e) {
        this.props.enqueueSnackbar(e.response.data.message);
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
            <h3>Editar tipo de sensor</h3>
            <div className="Container__header_row_button">
              <Button color="primary" variant="contained" component={Link} to="/admin/tipos-de-sensores/"> Volver</Button>
            </div>
          </div>
          <Divider />
        </div>
        <form className="form">
          <ul className="text__left">
            <li>El tipo de sensor ya no se puede cambiar, ya que esto puede generar errores no deseados si ya se usa una instancia de este en las estaciones. Si lo deseas, puedes eliminarlo.</li>
            <li>La unidad se refiere a la unidad de medida con la que el sensor enviará los datos (°C, Pa, ect)</li>
          </ul>
          <h4 className="text__left">Información:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField name="type" label="Tipo" value={this.state.form.type} variant="outlined" fullWidth size="small" InputProps={{
                readOnly: true,
                className: "filled"
              }} onChange={this.onChange} helperText={this.state.errors.type} error={Boolean(this.state.errors.type)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="unit" label="Unidad" value={this.state.form.unit} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.unit} error={Boolean(this.state.errors.unit)} />
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

export default withSnackbar(EditSensorType)