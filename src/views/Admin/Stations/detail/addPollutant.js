import React from "react";
import { postRequest } from "../../../../utils/axios";
import { Button, TextField } from "@material-ui/core";
import "./detailStation.css";

class AddPollutant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        values: { pollutant_id: -1, station_id: this.props.station.id },
        errors: {
          pollutant_id: "",
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
          pollutant_id: +e.target.value,
        },
      },
    });
  };

  handleAddPollutant = async () => {
    let errors = {
      pollutant_id: "",
    };
    let isValid = true;
    const form = this.state.form.values;
    if (!form.pollutant_id || form.pollutant_id === -1) {
      errors.pollutant_id = "Debe seleccionar un contaminante";
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
            (pollutant) => pollutant.id !== newPollutant.id
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
          name="pollutant_id"
          label="Contaminante"
          select
          type="number"
          SelectProps={{ native: true }}
          value={this.state.form.pollutant_id}
          variant="outlined"
          fullWidth
          size="small"
          onChange={this.onChangePollutant}
          helperText={this.state.form.errors.pollutant_id}
          error={Boolean(this.state.form.errors.pollutant_id)}
        >
          {this.state.addPollutants.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </TextField>
        <Button
          color="primary"
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
