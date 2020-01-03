import React, { Component, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { extend } from "dayjs";
import axios from "axios";
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography'

import { resetPassword } from "../redux/actions/userActions"

import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

import PropTypes from "prop-types";

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
class FormDialog extends Component {
  state = {
    email: "",
    errors: {},
    open: false,
    success: '',
  };



  submit = () => {


    const resetPassword = {
      body: this.state.email,
    }



    this.props.resetPassword(resetPassword);


    this.handleClose();


    console.log(this.state.email);
  }

  componentWillReceiveProps(nextProps) {

    console.log(nextProps);
    if (nextProps.UI.loading === false && nextProps.UI.success && !nextProps.UI.errors && !nextProps.UI.general && nextProps.UI.success !== 'Git majonezizk') {



      this.props.enqueueSnackbar('Recovery email sent', {
        preventDuplicate: true,
        variant: "success",
        autoHideDuration: 2000,

      });
    }
    if (nextProps.UI.errors != null) {
      const err = nextProps.UI.errors;
      console.log(err + "err.error: " + err.error);
      if (err.error === "Email not found" && !nextProps.UI.success) {

        this.props.enqueueSnackbar('Invalid email', {
          preventDuplicate: true,
          variant: "error",
          autoHideDuration: 2000,

        });

      }
    }





  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleOpen = () => {
    this.setState({ open: true });

  };

  handleClose = () => {
    this.setState({ open: false });
  };






  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <div>

        <Typography
          component={Link}
          className="frgtPassword"
          onClick={this.handleOpen}
          variant="body1"
        >
          Forgot password
          </Typography>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"

        >
          <DialogTitle id="form-dialog-title">Reset your password</DialogTitle>
          <form>
            <DialogContent>

              <TextField
                variant="outlined"
                margin="dense"
                id="email"
                label="Email"
                value={this.state.email}
                placeholder="Enter your email"
                // onChange={this.handleChange}

                onChange={e => this.emailChange(e.target.value)}
                type="text"
                fullWidth


                inputProps={{ maxLength: 50 }}
              />

              <div className="resetDialog"></div>


            </DialogContent>
          </form>
          <DialogActions>
            <IconButton
              variant="contained"
              onClick={this.handleClose}
              color="primary"
            >
              <CloseIcon></CloseIcon>
            </IconButton>
            <IconButton variant="contained" onClick={this.submit} color="primary">
              <DoneIcon></DoneIcon>
            </IconButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }


  emailChange(value) {
    this.setState({
      email: value
    });
  }



}

FormDialog.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  credentials: state.user.credentials,
  UI: state.UI,
});

export default connect(mapStateToProps, { resetPassword })(withSnackbar((FormDialog)));
