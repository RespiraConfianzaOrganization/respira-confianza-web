import React from "react"
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom"
import { putRequest } from "../../../utils/axios"
import { Button, Grid, TextField } from "@material-ui/core"
import { withSnackbar } from 'notistack';

class Profile extends React.Component {
  state = {
    user: null,
    form: {
      password: "",
      passwordConfirmation: "",
    },
    errors: {
      password: "",
      passwordConfirmation: "",
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
      password: "",
      passwordConfirmation: "",
    }
    let isValid = true
    let form = this.state.form
    Object.keys(form).forEach(field => {
      if (!form[field]) {
        errors[field] = "Este campo es obligatorio"
        isValid = false
      }
    })

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
        const response = await putRequest(`${process.env.REACT_APP_API_URL}/api/admins/${this.props.user.id}`, form);
        if (response.status === 200) {
          this.props.enqueueSnackbar('Contraseña cambiada exitosamente!');
          this.setState({ submitted: true, })
        }
      } catch (e) {
        if (e.response) {
          this.props.enqueueSnackbar(e.response.data.message);
        }
        else { this.props.enqueueSnackbar("Hubo un error. Intentalo más tarde"); }
      }
    }
  }

  render() {
    if (!this.props.user) {
      return <div className="Container"><h3>Hubo un problema</h3></div>
    }
    if (this.state.submitted) {
      return <Redirect to="/admin/administradores" />
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h2>Perfil</h2>
            <div className="Container__header_row_button">
              <Button color="primary" variant="contained" component={Link} to="/admin/administradores/"> Volver</Button>
            </div>
          </div>
        </div>
        <Grid container>
          <Grid item md={6} xs={6}>
            <h4 className="text__left">Nombre</h4>
            <p>{this.props.user.first_name}</p>
          </Grid>
          <Grid item md={6} xs={6}>
            <h4 className="text__left">Apellido</h4>
            <p>{this.props.user.last_name}</p>
          </Grid>
          <Grid item md={6} xs={12}>
            <h4 className="text__left">Email</h4>
            <p>{this.props.user.email}</p>
          </Grid>
          {this.props.user.City ?
            <Grid container>
              <Grid item md={6} xs={6}>
                <h4 className="text__left">Ciudad</h4>
                <p>{this.props.user.City.name}</p>
              </Grid>
              <Grid item md={6} xs={6}>
                <h4 className="text__left">País</h4>
                <p>{this.props.user.City.country}</p>
              </Grid>
            </Grid> : null}
        </Grid>
        <form className="form">
          <h4 className="text__left">Cambiar contraseña:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField type="password" name="password" label="Contraseña" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.password} error={Boolean(this.state.errors.password)} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField type="password" name="passwordConfirmation" label="Confirmación contraseña" variant="outlined" fullWidth size="small" onChange={this.onChange} helperText={this.state.errors.passwordConfirmation} error={Boolean(this.state.errors.passwordConfirmation)} />
            </Grid>
          </Grid>
          <div className="form__row_button">
            <Button className="form_button" type="submit" variant="contained" color="secondary" onClick={this.handleSubmit} >Cambiar</Button>
          </div>
        </form>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(withSnackbar(Profile))