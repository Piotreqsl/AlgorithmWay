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
import Button from '@material-ui/core/Button';
import Dialog from "../components/dialog_change";
import { Link } from "react-router-dom";
import { logoutUser, uploadImage } from '../redux/actions/userActions';
import Snackbar from '../components/snackbar';

import FeedbackIcon from '@material-ui/icons/Feedback';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//icons
import Location from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import FireplaceIcon from "@material-ui/icons/Fireplace";
import EditIcon from "@material-ui/icons/Edit";
import PublishIcon from '@material-ui/icons/Publish';

import { LinearProgress } from '@material-ui/core';

import Tooltip from "@material-ui/core/Tooltip";
import { height } from "@material-ui/system";
import { withSnackbar } from 'notistack'; import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { getPosts, loadMorePosts, synchronizePosts } from '../redux/actions/dataActions'
import { Waypoint } from 'react-waypoint';
import Drawer from '@material-ui/core/Drawer';


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
  state = {
    right: false,
  }


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




  loadMorePosts = () => {





    this.props.loadMorePosts([], [], false);
  }





  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  }

  toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ [side]: open });
  };


  componentDidUpdate(prevProps) {


    if (!this.props.data.noMore && this.props.data.backupdata !== prevProps.data.backupdata) {
      let filtered = this.props.data.posts.filter(element => {
        return element.userHandle === this.props.user.credentials.handle
      })


      if (filtered.length <= 5) {
        console.log("przeszło")

        this.loadMorePosts()
      }
    }
  }

  componentDidMount() {
    if (!this.props.data.noMore) this.props.getPosts();
    if (!this.props.data.noMore && this.props.data.posts.length !== this.props.data.backupdata.length) this.props.getPosts();

  }


  render() {
    dayjs.extend(theTime);

    let recentPostsMarkup = this.props.data.posts ? (
      this.props.data.posts.map(post =>
        (post.userHandle === this.props.user.credentials.handle) ?
          <Post key={post.postId} post={post} /> : null
      )
    ) : (
        null
      );

    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, location, reputation },
        loading,
        authenticated
      },
    } = this.props;

    const sideList = side => (
      <div
        className={classes.list}
        role="presentation"
        onClick={this.toggleDrawer(side, false)}
        onKeyDown={this.toggleDrawer(side, false)}
      >
        <List>
          {this.props.user.editRequests.map(((req) => (
            <ListItem button key={req.id} component={Link} to={`/editRequests/${req.id}`}>
              <ListItemIcon>  <EditIcon /> </ListItemIcon>
              <ListItemText primary={req.title} />

            </ListItem>
          )))}

        </List>
      </div>
    );





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

           



            <div> 
            {this.props.user.editRequests.length > 0 ? (

              <Tooltip placement="right" title="Edit requests"> 
                <FeedbackIcon color="primary" style={{backgroundColor: "transparent"}} onClick={this.toggleDrawer('right', true)} className="editIco"/>
                </Tooltip>

            ) : null }
              
            <Dialog />
            </div>

          </Paper>

          <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
            {sideList('right')}
          </Drawer>

          <div className={classes.profilePosts}>

            {recentPostsMarkup}
            <div className="infinite-scroll-example__waypoint">
              {!this.props.data.noMore ? <Waypoint
                bottomOffset={0}
                scrollableAncestor="window"
                onEnter={

                  this.loadMorePosts

                }
              /> : null}
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

const mapActionsToProps = { logoutUser, uploadImage, getPosts, loadMorePosts, synchronizePosts }

profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  synchronizePosts: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  bottomOffset: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  scrollableAncestor: PropTypes.any,

};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withSnackbar(profile)));
