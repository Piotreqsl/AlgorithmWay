import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import axios from "axios";
import Post from '../components/post';
import EditRequestList from '../components/editRequestList';
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";

// MUI Stuff

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { Waypoint } from 'react-waypoint';
import { getUnapprovedPosts, loadMorePosts, filterPosts } from '../redux/actions/dataActions'
import { withSnackbar } from 'notistack';


const styles = {
  textField: {
    marginBottom: "13px",
    marginTop: "2px"
  },
  custError: {
    color: "green",
    fontSize: "0.9rem"
  },
  button: {
    marginTop: "25px",
    position: "relative"
  },
  info: {
    textAlign: "center",
    color: "red",
    fontSize: "0.9rem"
  }
};

class admin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      loadingLocal: false,
      errors: {},
      success: "",
      posts: null,
      editReq: null
    };
  }

  componentDidMount() {

    this.props.getUnapprovedPosts();

    axios.get("/getEditRequests").then(res => {
      console.log(res.data);
      this.setState({
        editReq: res.data
      })
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (prevProps.UI.success !== this.props.UI.success && this.props.UI.success === "Post approved") {
      this.props.enqueueSnackbar('Post successfully approved', {
        variant: "success",
        autoHideDuration: 3000,

      });
    }

    if (prevProps.UI.errors !== this.props.UI.errors && this.props.UI.errors === "Post already approved") {
      this.props.enqueueSnackbar("Post already approved", {
        variant: "error",
        autoHideDuration: 3000,

      });
    }




  }


  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loadingLocal: true,
      errors: {},
      success: ""
    });
    console.log(this.state.email);

    const userData = {
      body: this.state.email
    };

    axios
      .post("/admin/add", userData)
      .then(res => {
        this.setState({
          loadingLocal: false,
          errors: {},
          success: "Privileges added successfully!"
        });

        console.log(this.state.success);
      })
      .catch(err => {
        console.log(err.response.data);
        this.setState({
          errors: err.response.data,
          loadingLocal: false
        });
      });
  };

  render() {
    const {
      classes,
      user: { adminPrivileges, loading }
    } = this.props;
    const { errors, loadingLocal, success } = this.state;


    let recentPostsMarkup = this.props.data.admin.unapprovedPosts ? (
      this.props.data.admin.unapprovedPosts.map((post) => <Post key={post.postId} post={post} />)
    ) : (<div><center>
      <CircularProgress color="primary" /></center></div>);



    let editRequests = (this.state.editReq && this.state.editReq.error === undefined) ? (
      this.state.editReq.map((req) => <EditRequestList key={req.id} post={req} />)
    ) : (<div><center>
      <CircularProgress color="primary" /></center></div>);

    if (this.state.editReq && !this.state.editReq.error !== undefined) {
      editRequests = <p>{this.state.editReq.error}</p>
    }



    return (
      <div className="main-content">


        {(!loading ? (
          adminPrivileges ? (
            // Tu zacząć jakieś komponenty 
            <Grid container spacing={16}>
              <Grid item sm={9} xs={12}>
                <h1> Unapproved posts: </h1>
                {recentPostsMarkup}
              </Grid>

              <Grid item sm={3} xs={12}>
                <h1> Admin tools : </h1>
                <h3> Make admin: </h3>
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
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
                    disabled={loadingLocal}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Submit
                  {loadingLocal && (
                      <CircularProgress size={30} className={classes.progress} />
                    )}
                  </Button>
                  {success.length > 0 && (
                    <Typography className={classes.custError}>
                      {this.state.success}
                    </Typography>
                  )}
                </form>

                <h3> Pending edit requests: </h3>




                <div style={{ maxHeight: 350, overflow: 'auto' }}>
                  <List>
                    {editRequests}
                  </List>
                </div>






              </Grid>
            </Grid>

          ) : (
              <Typography className={classes.info}>
                Admin privileges required
          </Typography>
            )) : <div>
            <center>
              <CircularProgress color="primary" />
            </center>
          </div>)}
      </div>
    );
  }
}

admin.propTypes = {
  classes: PropTypes.object.isRequired,
  getUnapprovedPosts: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI,
  data: state.data

});


export default connect(
  mapStateToProps,
  { getUnapprovedPosts }
)(withStyles(styles)(withSnackbar(admin)));
