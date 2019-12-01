import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import axios from "axios";
// MUI Stuff

import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";

const styles = {
  textField: {
    marginBottom: "13px",
    marginTop: "2px"
  },
  custError: {
    color: "red",
    fontSize: "0.9rem"
  }
};

class admin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      loading: false,
      errors: {},
      success: {}
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errors: {},
      success: {}
    });
    console.log(this.state.email);

    const userData = {
      body: this.state.email
    };

    axios
      .post("/admin/add", userData)
      .then(res => {
        this.setState({
          loading: false,
          errors: {},
          success: "Privileges added"
        });
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loading: false
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading, success } = this.state;

    return (
      <div className="main-content">
        <Grid container spacing={16}>
          <Grid item sm={9} xs={12}>
            <h1> Unapproved posts: </h1>
            <div className="feed"> Test </div>
          </Grid>

          <Grid item sm={3} xs={12}>
            <h1> Admin tools : </h1>
            <h3> Make admin: </h3>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                helperText={errors.general}
                error={errors.general ? true : false}
                className={classes.TextField}
                value={this.state.email}
                onChange={this.handleChange}
                fullWidth
              />

              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Submit
                {loading && (
                  <CircularProgress size={30} className={classes.progress} />
                )}
              </Button>
              {success.general && (
                <Typography className={classes.custError}>
                  {success.general}
                </Typography>
              )}
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

admin.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(admin));
