import React from "react";
import "./newPollutantUmbrals.css";
import { Link, Redirect } from "react-router-dom";
import { getRequest, postRequest } from "../../../../utils/axios";
import { Button, Grid, TextField } from "@material-ui/core";
import { withSnackbar } from "notistack";
import { validateNumber, validateUmbrals } from "../../../../utils/validator";

class NewPollutantUmbrals extends React.Component {
  state = {
    form: {
      pollutant: "Seleccionar",
      good: "",
      moderate: "",
      unhealthy: "",
      very_unhealthy: "",
      dangerous: ""
    },
    errors: {
      pollutant: "",
      good: "",
      moderate: "",
      unhealthy: "",
      very_unhealthy: "",
      dangerous: "",
      form: "",
    },
    pollutant_unit: "",
    pollutants: [{ name: "Seleccionar", unit: "" }],
    submitted: false,
  };

  async componentDidMount() {
    const umbrals = await this.getUmbrals();
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/pollutants`
    );
    if (response.status === 200) {
      let res_pollutants = response.data.pollutants;
      const existing_pollutants = umbrals.map((umbral) => umbral.pollutant);
      res_pollutants = res_pollutants.filter((pollutant) => {
        return !existing_pollutants.includes(pollutant.name);
      });
      res_pollutants.unshift({ id: -1, name: "Seleccionar", unit: "" });
      this.setState({ pollutants: res_pollutants });
    }
  }

  getUmbrals = async () => {
    const response = await getRequest(
      `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals`
    );
    if (response.status === 200) {
      return response.data.pollutantUmbrals;
    }
    return [];
  };

  onChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  onChangePollutant = (e) => {
    let name = e.target.value;
    const pollutant = this.state.pollutants.filter(
      (pollutant) => pollutant.name === name
    );
    let unit = "";
    if (pollutant.length > 0) {
      unit = pollutant[0].unit;
    }
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: name,
      },
      pollutant_unit: unit,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {
      pollutant: "",
      good: "",
      moderate: "",
      unhealthy: "",
      very_unhealthy: "",
      dangerous: "",
      form: "",
    };
    let isValid = true;
    let form = this.state.form;
    let umbrals = [
      "good",
      "moderate",
      "unhealthy",
      "very_unhealthy",
      "dangerous",
    ];

    umbrals.forEach((umbral) => {
      if (form[umbral]) {
        if (!validateNumber(form[umbral])) {
          errors[umbral] = "Este campo debe ser un número";
          isValid = false;
        }
      }
    });

    if (!form.pollutant || form.pollutant === "Seleccionar") {
      errors.pollutant = "Debe seleccionar un contaminante";
      isValid = false;
    }

    if (!validateUmbrals(form, umbrals)) {
      errors.form = "Los umbrales ingresados son inválidos"
      isValid = false;
    }
    this.setState({ errors });
    if (isValid) {
      //Post
      try {
        const response = await postRequest(
          `${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/new`,
          form
        );
        if (response.status === 201) {
          this.props.enqueueSnackbar(
            "Umbrales de contaminante creado correctamente!"
          );
          this.setState({ submitted: true });
        }
      } catch (e) {
        this.props.enqueueSnackbar(e.response.data.message);
      }
    }
  };

  render() {
    if (this.state.submitted) {
      return <Redirect to="/admin/umbrales-contaminantes" />;
    }
    return (
      <div className="Container">
        <div className="Container__header">
          <div className="Container__header_row">
            <h2>Nuevo umbrales de contaminante</h2>
            <div className="Container__header_row_button">
              <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/admin/umbrales-contaminantes/"
              >
                {" "}
                Volver
              </Button>
            </div>
          </div>
        </div>
        <form className="form">
          <ul className="text__left">
            <li>
              A partir de un tipo de contaminante se definirán las umbrales de
              salud para mostrarlos en la aplicación
            </li>
            <li>
              Los umbrales son rangos de salud. Estos empiezan desde el 0. Por ejemplo si bueno=60, quiere decir que desde el 0 a 60 es considerado un rango bueno.
            </li>
            <li>Se debe cumplir que bueno&lt;moderado&lt;no saludable&lt;Muy insalubre&lt;Peligroso</li>
            <li>No es necesario que se ingresen todos los umbrales, puede que solo se necesiten tres: bueno, moderado y no saludable.</li>
          </ul>
          <h4 className="text__red"> {this.state.errors.form}</h4>
          <h4 className="text__left">Contaminante:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField
                name="pollutant"
                label="Contaminante"
                select
                type="number"
                SelectProps={{ native: true }}
                value={this.state.form.pollutant}
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChangePollutant}
                helperText={this.state.errors.pollutant}
                error={Boolean(this.state.errors.pollutant)}
              >
                {this.state.pollutants.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                className="filled"
                name="pollutant_unit"
                label="Unidad"
                variant="outlined"
                fullWidth
                size="small"
                value={this.state.pollutant_unit}
                InputProps={{
                  readOnly: true,
                  className: "filled",
                }}
              />
            </Grid>
          </Grid>
          <h4 className="text__left">Umbrales:</h4>
          <Grid container spacing={4} justify="center">
            <Grid item xs={12} md={5}>
              <TextField
                name="good"
                label="Bueno"
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChange}
                helperText={this.state.errors.good}
                error={Boolean(this.state.errors.good)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                name="moderate"
                label="Moderado"
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChange}
                helperText={this.state.errors.moderate}
                error={Boolean(this.state.errors.moderate)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                name="unhealthy"
                label="No saludable"
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChange}
                helperText={this.state.errors.unhealthy}
                error={Boolean(this.state.errors.unhealthy)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                name="very_unhealthy"
                label="Muy insalubre"
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChange}
                helperText={this.state.errors.very_unhealthy}
                error={Boolean(this.state.errors.very_unhealthy)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                name="dangerous"
                label="Peligroso"
                variant="outlined"
                fullWidth
                size="small"
                onChange={this.onChange}
                helperText={this.state.errors.dangerous}
                error={Boolean(this.state.errors.dangerous)}
              />
            </Grid>
            <Grid item xs={12} md={5}></Grid>
          </Grid>
          <div className="form__row_button">
            <Button
              className="form_button"
              type="submit"
              variant="contained"
              color="secondary"
              onClick={this.handleSubmit}
            >
              Agregar
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default withSnackbar(NewPollutantUmbrals);
