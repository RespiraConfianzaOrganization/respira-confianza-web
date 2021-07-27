import React from "react";
import { postRequest } from "../../../../utils/axios";
import { Button, TextField } from "@material-ui/core";
import "./detailStation.css";

class AddPollutant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        values: { pollutant: "", station_id: this.props.station.id, useAuxiliar: false },
        errors: {
          pollutant: "",
        },
      },
      station: this.props.station,
      addPollutants: this.props.addPollutants,
      setPollutantAndStation: this.props.setPollutantAndStation,
      enqueueSnackbar: this.props.enqueueSnackbar,
    };
  }

  onChangePollutant = async (e) => {
    this.setState({
      form: {
        ...this.state.form,
        values: {
          ...this.state.form.values,
          pollutant: e.target.value,
        },
      },
    });
  };

  handleAddPollutant = async () => {
    let errors = {
      pollutant: "",
    };
    let isValid = true;
    const form = this.state.form.values;
    if (!form.pollutant || form.pollutant === "") {
      errors.pollutant = "Debe seleccionar un contaminante";
      isValid = false;
    }

    this.setState({
      form: {
        ...this.state.form,
        errors,
      },
    });

    if (isValid) {
      try {
        const response = await postRequest(
          `${process.env.REACT_APP_API_URL}/api/pollutant-station/new`,
          form
        );
        if (response.status === 201) {
          // Agregar nuevo contaminante a la estación
          const newPollutant = response.data.pollutant;
          const pollutants = this.state.station.Pollutants;
          pollutants.push(newPollutant);
          const station = this.state.station;
          station.Pollutants = pollutants;
          //Actualizar listado de contaminantes para agregar
          const addPollutants = this.state.addPollutants.filter(
            (pollutant) => pollutant.name !== newPollutant.name
          );
          this.state.setPollutantAndStation(addPollutants, station);
          this.setState({ addPollutants: addPollutants });
          this.state.enqueueSnackbar("Contaminante agregado correctamente!");
        }
      } catch (e) {
        this.state.enqueueSnackbar(e.response.data.message);
      }
    }
  };

  render() {
    return (
      <div className="add_pollutant_station">
        Agregar nuevo
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
          helperText={this.state.form.errors.pollutant}
          error={Boolean(this.state.form.errors.pollutant)}
        >
          {this.state.addPollutants.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </TextField>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.handleAddPollutant}
        >
          Agregar
        </Button>
      </div>
    );
  }
}

export default AddPollutant;
