import React from "react"
import { Link, Redirect } from "react-router-dom"
import { postRequest, getRequest } from "../../../../utils/axios"
import { Button, Grid, TextField } from "@material-ui/core"
import "./newStation.css"
import { withSnackbar } from "notistack"

class NewStation extends React.Component {
  state = {
    form: {
      name: "",
      country: "",
      city_id: "",
      latitude: "",
      longitude: "",
      status: "",
      privateKey: ""
    },
    errors: {
      name: "",
      country: "",
      city: "",
      latitude: "",
      longitude: "",
      status: "",
      privateKey: ""
    },
    countries: [],
    cities: [{ id: -1, name: "Seleccionar" }],
    statusOptions: [{ type: "Seleccionar" }, { type: "Habilitada" }, { type: "Deshabilitada" }, { type: "En construcción" }],
    submitted: false
  }

  async componentDidMount() {
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
        country,
        city_id: null
      }
    })
    await this.getCities(country)
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
      if (field !== "privateKey" && !form[field]) {
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
        const response = await postRequest(`${process.env.REACT_APP_API_URL}/api/stations/new`, form);
        if (response.status === 201) {
          this.props.enqueueSnackbar('Estación creada correctamente!');
          this.setState({ submitted: true, })
        }
      } catch (e) {
        this.props.enqueueSnackbar(e.response.data.message);
      }
    }
  }

  render() {
    if (this.state.submitted) {
      return <Redirect to="/admin/estaciones" />
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h2>Nueva estación</h2>
            <div className="Container__header_row_button">
              <Button color="primary" variant="contained" component={Link} to="/admin/estaciones/"> Volver</Button>
            </div>
          </div>
        </div>
        <form className="form">
          <h4 className="text__left">Información:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField name="name" label="Nombre" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.name} error={Boolean(this.state.errors.name)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="status" label="Estado" select
                InputLabelProps={{ shrink: true }}
                SelectProps={{ native: true }}
                value={this.state.form.status}
                variant="outlined"
                fullWidth size="small"
                onChange={this.onChange}
                helperText={this.state.errors.status}
                error={Boolean(this.state.errors.status)} >
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
              <TextField name="latitude" label="Latitud" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.latitude} error={Boolean(this.state.errors.latitude)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField name="longitude" label="Longitud" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.longitude} error={Boolean(this.state.errors.longitude)} />
            </Grid>
          </Grid>
          <h4 className="text__left">Contraseña:</h4>
          <Grid container spacing={4} justify={"center"}>
            <Grid item xs={12} md={5}>
              <TextField name="privateKey" label="Contraseña o Token" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.privateKey} error={Boolean(this.state.errors.privateKey)} />
            </Grid>
          </Grid>
          <div className="form__row_button">
            <Button className="form_button" type="submit" variant="contained" color="secondary" onClick={this.handleSubmit} >Agregar</Button>
          </div>
        </form>
      </div>
    )
  }
}

export default withSnackbar(NewStation)
