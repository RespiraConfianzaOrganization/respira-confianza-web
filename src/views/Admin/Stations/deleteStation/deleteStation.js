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

class DeleteStation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: this.props.openModal,
      handleDeleteClick: this.props.handleDeleteClick,
      getStations: this.props.getStations,
      delete: false,
      station: this.props.station,
    };
  }

  handleClose = () => {
    this.setState({ error: '' })
    this.state.handleDeleteClick(false, null);
  };

  handleDelete = async () => {
    const response = await deleteRequest(`${process.env.REACT_APP_API_URL}/api/stations/${this.state.station.id}`)
    if (response.status === 200) {
      await this.state.getStations();
      this.props.enqueueSnackbar(`Estación ${this.state.station.name} eliminada correctamente!`);
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
            Confirmación de eliminación de estación
                    </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>{this.state.error}</span>
              ¿Estás seguro de eliminar la estación
              <span className="Text__bolder"> {this.state.station.name} </span>
              ubicada en {this.state.station.country}, {this.state.station.city} con Latitud:{this.state.station.latitude}, Longitud: {this.state.station.longitude}?
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

export default withSnackbar(DeleteStation);