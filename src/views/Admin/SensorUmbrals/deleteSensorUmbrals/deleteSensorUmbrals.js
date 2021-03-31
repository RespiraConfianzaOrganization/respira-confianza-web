import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { deleteRequest } from "../../../../utils/axios"
import "./deleteSensorUmbrals.css"

export default class DeleteSensorUmbrals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: this.props.openModal,
      handleClick: this.props.handleClick,
      getUmbrals: this.props.getUmbrals,
      delete: false,
      sensorUmbrals: this.props.sensorUmbrals,
      error: 'No se pudo eliminar'
    };
  }

  handleClose = () => {
    this.setState({ error: '' })
    this.state.handleClick(false, null);
  };

  handleDelete = async () => {
    const response = await deleteRequest(`${process.env.REACT_APP_API_URL}/api/sensor-umbrals/${this.state.sensorUmbrals.id}`)
    if (response.status === 200) {
      await this.state.getUmbrals();
      this.state.handleClick(false, null);
    }
    else {
      this.setState({ error: 'No se pudo eliminar' })
    }
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.openModal}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle id="responsive-dialog-title">
            Confirmación de eliminación de umbrales de sensor
                    </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>{this.state.error}</span>
              ¿Estas seguro de eliminar los umbrales para el sensor
              <span className="Text__bolder"> {this.state.sensorUmbrals.Sensor_Type.type} </span>
              con unidad {this.state.sensorUmbrals.Sensor_Type.unit} ?
                    </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleDelete}
              variant="contained"
              className="Delete__button"
            >
              Eliminar
            </Button>
            <Button
              onClick={this.handleClose}
              color="secondary"
              variant="contained"
              autoFocus
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
