import React from "react";
import { withRouter } from "react-router-dom";
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
      delete: false,
      station: this.props.station,
    };
  }

  handleClose = () => {
    this.setState({ error: '' })
    this.state.handleDeleteClick(false);
  };

  handleDelete = async () => {
    try {
      const response = await deleteRequest(`${process.env.REACT_APP_API_URL}/api/stations/${this.state.station.id}`)
      if (response.status === 200) {
        this.props.enqueueSnackbar(`Estación ${this.state.station.name} eliminada correctamente!`);
        this.state.handleDeleteClick(false);
        this.props.history.push("/admin/estaciones");
      }
      else {
        this.props.enqueueSnackbar('No se pudo eliminar');
        this.state.handleDeleteClick(false);
      }
    } catch (err) {
      this.props.enqueueSnackbar(err.response.data.message);
      this.state.handleDeleteClick(false);
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
              ubicada en {this.state.station.City.Country.name}, {this.state.station.City.name} con Latitud:{this.state.station.latitude}, Longitud: {this.state.station.longitude}?
              Esta estación se eliminará solo si no tiene lecturas asociadas
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

export default withSnackbar(withRouter(DeleteStation));