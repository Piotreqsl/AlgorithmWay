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
import IconButton from '@material-ui/core/IconButton'
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

import PropTypes from "prop-types";

import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';


class FormDialog extends Component {
  state = {
    bio: "",
    location: "",
    open: false
  };

  mapUserDetailsToState = credentials => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      location: credentials.location ? credentials.location : ""
    });
  };

  submit = () => {
    const userDetails = {
      bio: this.state.bio,
      location: this.state.location,
    };

    this.props.editUserDetails(userDetails);
    this.handleClose();
  }
  

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const { credentials} = this.props;
    this.mapUserDetailsToState(credentials);
  }

  
  

  render() {
    return (
      <div>
        <Tooltip title="Edit profile" placement="left">
          <EditIcon
            color="primary"
            onClick={this.handleOpen}
            className="editIco"
          />
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit your profile details</DialogTitle>
          <form> 
          <DialogContent>
            <DialogContentText>
              This is the place where you can change information about your
              profile.
            </DialogContentText>
            <TextField
              variant="outlined"
              margin="dense"
              id="bio"
              label="Bio"
              value={this.state.bio}
             // onChange={this.handleChange}
              
             onChange={e => this.onBioChange(e.target.value)}
             type="text"
              fullWidth
              multiline="true"
              rows="3"
              inputProps={{ maxLength: 150 }}
            />

            <TextField
              variant="outlined"
             
              margin="dense"
              id="location"
              label="Location"
              type="text"
              value={this.state.location}
             // onChange={this.handleChange}
             onChange={e => this.onLocChange(e.target.value)}
             
             fullWidth
              multiline="true"
              
              inputProps={{ maxLength: 20 }}
            />
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
  onLocChange(value){
    this.setState({
         location: value
    });
}
onBioChange(value){
  this.setState({
       bio: value
  });
}

}

FormDialog.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
 
};
const mapStateToProps = state => ({
  credentials: state.user.credentials,
  
});

export default connect(mapStateToProps, { editUserDetails })(FormDialog);
