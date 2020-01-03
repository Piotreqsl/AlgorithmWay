import React, { Component } from 'react'

import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton'
import { withSnackbar } from "notistack";
import {connect} from 'react-redux';
import {submitComment} from '../redux/actions/dataActions'

import SendIcon from '@material-ui/icons/Send';

export class comment_input extends Component {
    state = {
        errors: {},

    }
    
    handleChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        });
        
        event.target.parentElement.parentElement.querySelector("p").innerHTML =
          event.target.value.toString().length + "/" + event.target.maxLength;
      };

      handleSubmit = event => {
        event.preventDefault();

        if(document.getElementById("commentField").value.length !== 0) {
        this.props.submitComment(this.props.postId, {body: this.state.commentBody});
        document.getElementById("commentField").value = "";
        document.getElementById("commentField-helper-text").innerHTML = "0/1000";
    } else {
        this.props.enqueueSnackbar(`Comment cannot be empty`, {
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 2000
          });
    }
    
    }
    
    render() {
        const{authenticated} = this.props;
        const errors = this.state.errors;
        return (

            (authenticated ? (

            <Paper
            style={{
                padding: "7px",
                marginTop: "20px",
            }}
            >

            <div className="comment-inputfield">
            <TextField 
            
            fullWidth name="commentBody" helperText="0/1000" rowsMax="8" multiline="true" onChange={this.handleChange} inputProps={{ maxLength: 1000 }} id="commentField" variant="outlined" /> 
            <IconButton
            style={{
                marginLeft: "7px",
                width: "50px",
                height: "50px"
            }}
            onClick={this.handleSubmit}

            >
            <SendIcon />
            </IconButton>

            </div>
            </Paper>

            ) : null)

            
        )
    }
}

comment_input.propTypes= {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,

}

const mapStateToProps = state => ({
    UI: state.submitComment,
    authenticated: state.user.authenticated,

})


export default connect(mapStateToProps, {submitComment})(withSnackbar(comment_input));
