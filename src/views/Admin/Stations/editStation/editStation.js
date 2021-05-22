import React from "react"
import { Link, Redirect } from "react-router-dom"
import { getRequest, putRequest } from "../../../../utils/axios"
import { Button, Divider, Grid, TextField } from "@material-ui/core"
import "./editStation.css"
import { withSnackbar } from "notistack"

class EditStation extends React.Component {
  state = {
    form: {
      name: "",
      country: "",
      city_id: "",
      latitude: "",
      longitude: "",
      status: "",
    },
    errors: {
      name: "",
      country: "",
      city_id: "",
      latitude: "",
      longitude: "",
      status: "",
    },
    stationExist: true,
    station_id: this.props.match.params.id,
    countries: [{ name: "Seleccionar" }],
    cities: [{ id: -1, name: "Seleccionar" }],
    statusOptions: [{ type: "Seleccionar" }, { type: "Habilitada" }, { type: "Deshabilitada" }, { type: "En construcción" }],
    submitted: false
  }

  async componentDidMount() {
    await this.getCountries();
    try {
      const response = await getRequest(`${process.env.REACT_APP_API_URL}/api/stations/${this.state.station_id}`);
      if (response.status === 200) {
        const station = response.data.station
        this.setState({
          form: {
            name: station.name,
            country: station.City.country,
            city_id: station.city_id,
            latitude: station.latitude,
            longitude: station.longitude,
            status: station.status,
          }
        })
        await this.getCities(station.City.country);
      }
    } catch (e) {
      this.setState({ stationExist: false })
      return
    }
  }

  async getCountries() {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/countries`
    );
    if (response.status === 200) {
      let res_countries = response.data.countries;
      let countries = res_countries
      countries.unshift({ name: "Seleccionar" });
      this.setState({ countries });
    }
  }

  async getCities(country) {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/cities/country/${country}`
    );
    if (response.status === 200) {
      let res_cities = response.data.cities;
      let cities = res_cities
      cities.unshift({ id: -1, name: "Seleccionar" });
      this.setState({ cities });
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
    const country = e.target.value
    this.setState({
      form: {
        ...this.state.form,
        country: country,
        city_id: null
      }
    })
    await this.getCities(country)
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    let errors = {
      name: "",
      country: "",
      city_id: "",
      latitude: "",
      longitude: "",
      status: "",
    }
    let isValid = true
    let form = this.state.form

    Object.keys(form).forEach(field => {
      if (!form[field]) {
        errors[field] = "Este campo es obligatorio"
        isValid = false
      }
    })
    if (form.name.length < 4 || form.name.length > 40) {
      errors.name = "Nombre debe tener entre 4 a 40 carácteres"
      isValid = false
    }
    if (!Number(form.latitude)) {
      errors.latitude = "Debe ingresar una latitud correcta. Ej: -35.43"
      isValid = false
    }
    if (!Number(form.longitude)) {
      errors.longitude = "Debe ingresar una longitud correcta. Ej: -71.67 "
      isValid = false
    }
    if (!form.country || form.country === "Seleccionar") {
      errors.country = "Debe seleccionar una país"
      isValid = false
    }
    if (!form.city_id || form.city_id === -1) {
      errors.city_id = "Debe seleccionar una ciudad"
      isValid = false
    }
    if (!form.status || form.status === "Seleccionar") {
      errors.status = "Debe ingresar un estado"
      isValid = false
    }
    this.setState({ errors })
    if (isValid) {
      //Post
      try {
        const response = await putRequest(`${process.env.REACT_APP_API_URL}/api/stations/${this.state.station_id}`, form);
        if (response.status === 200) {
          this.props.enqueueSnackbar('Estación editada correctamente!');
          this.setState({ submitted: true, })
        }
      } catch (e) {
        this.props.enqueueSnackbar(e.response.data.message);
      }
    }
  }

  render() {
    if (!this.state.stationExist) {
      return <div>
        <h2>Estación no existe</h2>
      </div>
    }
    if (this.state.submitted) {
      return <Redirect to="/admin/estaciones" />
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h3>Editar estación</h3>
            <div className="Container__header_row_button">
              <Button color="primary" variant="contained" component={Link} to="/admin/estaciones/"> Volver</Button>
            </div>
          </div>
          <Divider />
        </div>
        <form className="form">
          <h4 className="text__left">Información:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField name="name" label="Nombre" value={this.state.form.name} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.name} error={Boolean(this.state.errors.name)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="status" label="Estado" select
                SelectProps={{ native: true }} value={this.state.form.status} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.status} error={Boolean(this.state.errors.status)} >
                {this.state.statusOptions.map((option) => (
                  <option key={option.type} value={option.type}>
                    {option.type}
                  </option>
                ))}
              </TextField>
            </Grid>


          </Grid>
          <h4 className="text__left">Ubicación:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField
                name="country"
                select
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: true }}
                label="País" variant="outlined"
                fullWidth size="small"
                onChange={this.onChangeCountry}
                value={this.state.form.country}
                helperText={this.state.errors.country}
                error={Boolean(this.state.errors.country)} >
                {this.state.countries.map((option) => (
                  <option key={option.name} value={option.name}>
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
                value={this.state.form.city_id}
                onChange={this.onChange}
                helperText={this.state.errors.city_id}
                error={Boolean(this.state.errors.city_id)} >
                {this.state.cities.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="latitude" label="Latitud" value={this.state.form.latitude} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.latitude} error={Boolean(this.state.errors.latitude)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="longitude" label="Longitud" value={this.state.form.longitude} variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.longitude} error={Boolean(this.state.errors.longitude)} />
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

export default withSnackbar(EditStation)