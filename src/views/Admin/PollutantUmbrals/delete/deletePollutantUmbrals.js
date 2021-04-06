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
import "./deletePollutantUmbrals.css"

class DeletePollutantUmbrals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: this.props.openModal,
      handleDeleteClick: this.props.handleDeleteClick,
      getUmbrals: this.props.getUmbrals,
      delete: false,
      pollutantUmbrals: this.props.pollutantUmbrals,
    };
  }

  handleClose = () => {
    this.setState({ error: '' })
    this.state.handleDeleteClick(false, null);
  };

  handleDelete = async () => {
    const response = await deleteRequest(`${process.env.REACT_APP_API_URL}/api/pollutant-umbrals/${this.state.pollutantUmbrals.id}`)
    if (response.status === 200) {
      await this.state.getUmbrals();
      this.props.enqueueSnackbar(`Umbrales de contaminante ${this.state.pollutantUmbrals.Pollutant.name} eliminados correctamente!`);
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
            Confirmación de eliminación de umbrales de contaminante
                    </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span>{this.state.error}</span>
              ¿Estas seguro de eliminar los umbrales para el contaminante
              <span className="Text__bolder"> {this.state.pollutantUmbrals.Pollutant.name} </span>
              con unidad {this.state.pollutantUmbrals.Pollutant.unit} ?
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

export default withSnackbar(DeletePollutantUmbrals);