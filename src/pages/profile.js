import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
//MUI
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Post from "../components/post";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { isAbsolute } from "path";
import dayjs from "dayjs";
import theTime from "dayjs/plugin/advancedFormat";

import Dialog from "../components/dialog_change";

import { logoutUser, uploadImage } from '../redux/actions/userActions';
import Snackbar from '../components/snackbar';


//icons
import Location from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import FireplaceIcon from "@material-ui/icons/Fireplace";
import EditIcon from "@material-ui/icons/Edit";
import PublishIcon from '@material-ui/icons/Publish';

import { LinearProgress } from '@material-ui/core';

import Tooltip from "@material-ui/core/Tooltip";
import { height } from "@material-ui/system";
import { withSnackbar } from 'notistack';

import { getPosts, loadMorePosts } from '../redux/actions/dataActions'
import { Waypoint } from 'react-waypoint';



const styles = {
  paper: {
    padding: "20px"
  },

  left: {
    maxWidth: 300,
    display: "inline-flex",
    verticalAlign: "middle",
    lineHeight: 1.8
  },
  profilePosts: {
    marginTop: 20
  },
  icoMargin: {
    marginRight: 5
  },

  editIco: {
    display: "inline-flex",
    verticalAlign: "middle",
    lineHeight: 1.5,
    height: 20,
    marginLeft: 5
  }
};

export class profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);


    const isType = (image.type);
    if (isType === "image/png" || isType === "image/jpg" || isType === "image/jpeg" || isType === "image/bmp") {



      if (image.size < 5000000) {

        this.props.uploadImage(formData);

      } else {

        this.props.enqueueSnackbar(`Selected file is too big (Max. 5MB)`, {
          preventDuplicate: true,
          variant: "error",
          autoHideDuration: 5000,

        });

      }
    } else {

      this.props.enqueueSnackbar(`Invalid file type`, {
        preventDuplicate: true,
        variant: "error",
        autoHideDuration: 3000,

      });

    }


  }


  renderWaypoint = () => {
    if (this.props.user.loading === false && this.props.data.posts.length > 0) {
      return (
        <Waypoint
          onEnter={this.loadMorePosts}
        />
      )

    }
  }

  loadMorePosts = () => {
    console.log("hej waypoint")

    this.props.loadMorePosts([], [], false);
  }





  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  }




  componentDidUpdate(prevProps) {

    /// Zobaczyć jak wyjdzie w praniu i najwyżej napisać ify na doładowanie postoów

    var did = false
    console.log("updejt")

    /// Jeśli upcoming data nic nie wniosło to ładuje dalej
    /// Zobaczyć jak wyjdzie w praniu i najwyżej napisać ify na doładowanie postoów

    /// Jeśli aktualnych postów jest 5 lub mniej, to ładuje sie wiecej postów żeby zawsze trochę można było skrolować
    if ((prevProps.data.posts !== this.props.data.posts) && this.props.data.posts !== undefined && this.props.data.posts.length <= 5 && this.props.data.noMore === false && did === false) {


      this.props.loadMorePosts([], [], false);
    }


  }

  componentDidMount() {



    if (this.props.user.credentials.handle !== undefined && this.props.user.credentials.handle !== null) { }
    if (this.props.data.posts === undefined || this.props.data.posts.length <= 1) this.props.getPosts();


  }


  render() {
    dayjs.extend(theTime);

    let recentPostsMarkup = this.props.data.posts ? (
      this.props.data.posts.map(post =>
        (post.userHandle === this.props.user.credentials.handle) ?
          <Post key={post.postId} post={post} /> : null
      )
    ) : (
        <div>
          <center>
            <CircularProgress color="primary" />
          </center>
        </div>
      );

    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, location, reputation },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <div class="main-content-squeezed">
          <Paper className={classes.paper}>
            <div className="profile-av">


              <div className="container1">

                <Avatar alt={handle} src={imageUrl} className="bigAvatar-scss" />

                <div className="overlay1">

                  <IconButton onClick={this.handleEditPicture} className="icon1" >
                    <PublishIcon fontSize="large" color="primary" />
                  </IconButton>
                  <input type="file" id="imageInput" hidden="hidden" onChange={this.handleImageChange} />
                </div>
              </div>



              <Typography variant="h5"> {handle}</Typography>

              <div className="profile-ainfo">
                <Typography className={classes.left} variant="body2">
                  {" "}
                  <Tooltip title="Location" placement="left">
                    <Location color="primary"></Location>
                  </Tooltip>
                  <div className={classes.icoMargin} /> {location}{" "}
                </Typography>
                <br></br>

                <Typography className={classes.left} variant="body2">
                  {" "}
                  <Tooltip title="Account created" placement="left">
                    <EventIcon color="primary"></EventIcon>
                  </Tooltip>
                </Typography>
                <br></br>

                <Typography className={classes.left} variant="body2">
                  {" "}
                  <Tooltip title="Reputation" placement="left">
                    <FireplaceIcon color="primary"></FireplaceIcon>
                  </Tooltip>{" "}
                  <div className={classes.icoMargin} /> {reputation}{" "}
                </Typography>
              </div>
            </div>

            <Typography className="profile-bio" variant="body2">
              {" "}
              {bio}{" "}
            </Typography>

            <Dialog />

          </Paper>

          <div className={classes.profilePosts}>

            {recentPostsMarkup}
            <div className="infinite-scroll-example__waypoint">
              {this.renderWaypoint()}
              {!loading ? this.props.data.noMore ? null : (<div className="post-margin"><center>
                <LinearProgress color="primary" style={{ width: "100%" }} /></center></div>) : null}

            </div>

          </div>
        </div>
      ) : (
          <center> <p>You need to be logged in to see this page</p> </center>
        )
    ) : (

        <div class="main-content-squeezed">
          <LinearProgress color="primary" />
        </div>
      );

    return profileMarkup;
  }


}

const mapStateToProps = state => ({
  user: state.user,
  UI: state.ui,
  data: state.data
});

const mapActionsToProps = { logoutUser, uploadImage, getPosts, loadMorePosts }

profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withSnackbar(profile)));
