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
import { withSnackbar } from 'notistack';
import "./deleteSensorType.css"

class DeleteSensorType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: this.props.openModal,
      handleDeleteClick: this.props.handleDeleteClick,
      getSensorTypes: this.props.getSensorTypes,
      delete: false,
      sensorType: this.props.sensorType,
    };
  }

  handleClose = () => {
    this.setState({ error: '' })
    this.state.handleDeleteClick(false, null);
  };

  handleDelete = async () => {
    const response = await deleteRequest(`${process.env.REACT_APP_API_URL}/api/sensor-types/${this.state.sensorType.id}`)
    if (response.status === 200) {
      await this.state.getSensorTypes();
      this.props.enqueueSnackbar('Tipo de sensor eliminado correctamente!');
      this.state.handleDeleteClick(false, null);
    }
    else {
      this.props.enqueueSnackbar('No se pudo eliminar');
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
            Confirmación de eliminación de tipo de sensor
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>{this.state.error}</span>
              ¿Estas seguro de eliminar el tipo de sensor
              <span className="Text__bolder"> {this.state.sensorType.type} </span>
              con unidad {this.state.sensorType.unit} ?
              <span className="Text__bolder">
                {" "}Al eliminar un tipo de sensor, se eliminará los umbrales definidos para ese sensor y las instancias de sensores en las estaciones.
              </span>   </DialogContentText>
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

export default withSnackbar(DeleteSensorType);