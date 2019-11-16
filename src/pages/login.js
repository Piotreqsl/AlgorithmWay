import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";

import { Link } from "react-router-dom";

//mui

import Grid from "@material-ui/core/Grid";

import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";


//Redux

import {connect} from 'react-redux';
import {loginUser} from '../redux/actions/userActions'



import axios from "axios";

const styles = {
  form: {
    textAlign: "center",

    marginTop: "30px"
  },

  pageTitle: {
    color: "#2E2E3A",
    marginBottom: "20px"
  },

  bigAvatar: {
    marginBottom: "10px"
  },

  textField: {
    marginBottom: "13px",
    marginTop: "2px"
  },

  button: {
    marginTop: "25px",
    position: "relative"
  },
  custError: {
    color: "red",
    fontSize: "0.9rem"
  },
  formCard: {
    padding: "20px 20px 20px 20px",
    marginBottom: "30px"
  },
  crtAcc: {
    textDecoration: "none",
    color: "#4d4d62",
    "&:hover": {
      color: "#8b8ba3",
      transition: "0.2s"
    }
  },

  progress: {
    position: "absolute"
  }
};

//https://youtu.be/m_u6P5k0vP0?list=WL&t=23941

export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    
      errors: {}
    };
  }
  handleSubmit = event => {
    event.preventDefault();
   
    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData, this.props.history);
    
  };
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item xs></Grid>
        <Grid item>
          <center>
            <Avatar className={classes.bigAvatar} src="logo192.png"></Avatar>
          </center>{" "}
          <br></br>
          <Typography variant="h5" className={classes.pageTitle}>
            Log in to AlgorithmWay
          </Typography>
          <Card className={classes.formCard}>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                color="primary"
                type="text"
                id="email"
                name="email"
                label="Email"
                className={classes.textField}
                value={this.state.email}
                helperText={errors.email}
                error={errors.email ? true : false}
                onChange={this.handleChange}
                fullWidth
              ></TextField>

              <TextField
                variant="outlined"
                type="password"
                id="password"
                name="password"
                label="Password"
                className={classes.textField}
                value={this.state.password}
                helperText={errors.password}
                error={errors.password ? true : false}
                onChange={this.handleChange}
                fullWidth
              ></TextField>

              {errors.general && ( //if <= this then print => html
                <Typography variant="body2" className={classes.custError}>
                  {errors.general}
                </Typography>
              )}

              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.button}
              >
                Log in
                {loading && (
                  <CircularProgress size={30} className={classes.progress} />
                )}
              </Button>
            </form>
          </Card>
          <Typography
            component={Link}
            className={classes.crtAcc}
            to="/signup"
            variant="body1"
          >
            Create an account!
          </Typography>
        </Grid>
        <Grid item xs></Grid>
      </Grid>
    );
  }
}
login.propTypes = {
  classes: PropTypes.object.isRequired,

  loginUser: PropTypes.func.isRequired,

  user:PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,

});
const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));
