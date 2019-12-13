import React, { Component, Fragment } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

//Material-UI imports

import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "@material-ui/core/Tooltip";

import dayjs from "dayjs";


import { connect } from "react-redux";
import { deletePost } from "../redux/actions/dataActions";
import PropTypes from "prop-types";



import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";


import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

const styles = {

cont: {
    marginTop: "-20px",
    marginBottom: "20px",

}

};
export class delete_post extends Component {
 state = {
     open: false,
 };
 handleOpen = () => {
     this.setState({open: true});
 }
 handleClose = () => {
    this.setState({open: false});
}
deletePost = () => {
    this.props.deletePost(this.props.postId)
    this.setState({open: false});
}

 
    render() {
    const { classes } = this.props;

    return <Fragment>

<Tooltip title="Delete post" placement="top">
          <IconButton onClick={this.handleOpen}
            className="deleteIco"> 
          <DeleteOutlineIcon
            color="primary"
            
          />
          </IconButton>
        </Tooltip>




        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Are you sure you want to delete this post?</DialogTitle>
          
          <DialogContent className={classes.cont}>
            This action is irreverable
            
          </DialogContent>
          
          <DialogActions>

            <IconButton
              variant="contained"
              onClick={this.handleClose}
              color="primary"
            >
             <CloseIcon></CloseIcon>
            </IconButton>

            <IconButton variant="contained" onClick={this.deletePost} color="primary">
              <DoneIcon></DoneIcon>
            </IconButton>
          </DialogActions>
        </Dialog>

    </Fragment>;
  }
}
delete_post.propTypes = {
  deletePost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired
};

export default connect(null, { deletePost })(withStyles(styles)(delete_post));
