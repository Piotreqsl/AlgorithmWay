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

import {
  AutoSizer, CellMeasurerCache,
  CellMeasurer, InfiniteLoader
} from "react-virtualized";
import 'react-virtualized/styles.css';

import { List as ListR } from "react-virtualized";

import Tooltip from "@material-ui/core/Tooltip";
import { height } from "@material-ui/system";
import { withSnackbar } from 'notistack'; import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { synchronizePosts, getUserPosts, loadMoreUserPosts } from '../redux/actions/dataActions'
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
    waiting: true

  }
  _cache = new CellMeasurerCache({ minHeight: 0, fixedWidth: true, defaultHeight: 190 });


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
    if (!this.props.data.noMore) this.props.loadMoreUserPosts(this.props.user.credentials.handle);
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

  componentDidMount() {
    if (Object.keys(this.props.user.credentials).length > 0 && this.props.user.authenticated) {
      this.props.getUserPosts(this.props.user.credentials.handle);
    }
  }




  componentDidUpdate(prevProps) {

    if (this.list) {
      this.list.forceUpdateGrid();
      this.list.recomputeRowHeights();
    }

    if (this.props.user.credentials && this.state.waiting) {
      this.props.getUserPosts(this.props.user.credentials.handle);
      this.setState({
        waiting: false
      })
    }

    if (prevProps.data.posts.length > this.props.data.posts.length && this.props.UI.success === "Deleted succesfully") {
      this.list.forceUpdateGrid();
      this.list.recomputeRowHeights()
    }




    if (!this.props.data.noMore && this.props.data.backupdata.length !== prevProps.data.backupdata.length && this.props.data.posts.length <= 4 && prevProps.data.lastId !== this.props.data.lastId && this.props.user) {


      console.log("updejt");
      this.loadMorePosts();
    }


  }




  bindListRef = ref => {
    this.list = ref;
  };


  isRowLoaded = ({ index }) => {
    return !!this.props.data.posts[index];
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {

    console.log('łej ' + this.props.data.posts.length)
    if (this.props.data.posts.length > 4 && !this.props.data.noMore) this.props.loadMoreUserPosts(this.props.user.credentials.handle)
  }




  rowRenderer = ({ index, isScrolling, key, parent, style }) => {


    return (

      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure }) => (
          <div key={key} style={style} className="row" >
            <Post key={this.props.data.posts[index].postId} post={this.props.data.posts[index]} onLoad={measure} />
          </div>
        )

        }
      </CellMeasurer>
    )



  }


  render() {
    dayjs.extend(theTime);



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
                  <FeedbackIcon color="primary" style={{ backgroundColor: "transparent" }} onClick={this.toggleDrawer('right', true)} className="editIco" />
                </Tooltip>

              ) : null}

              <Dialog />
            </div>

          </Paper>

          <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
            {sideList('right')}
          </Drawer>


          <div style={{ display: 'flex', marginTop: "20px" }}>
            <div style={{ flex: '1 1 auto', height: '57vh' }}>





              <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                loadMoreRows={this.loadMoreRows}
                rowCount={10000000}
              >
                {({ onRowsRendered, registerChild }) => (


                  <AutoSizer >
                    {({ width, height }) => (



                      <div className="list">
                        <ListR style={{ outline: "none" }}
                          ref={this.bindListRef}
                          width={width}
                          height={height}
                          deferredMeasurementCache={this._cache}
                          rowHeight={this._cache.rowHeight}
                          rowRenderer={this.rowRenderer}
                          rowCount={this.props.data.posts.length}
                          onRowsRendered={onRowsRendered}
                        />
                      </div>

                    )}
                  </AutoSizer>
                )}
              </InfiniteLoader>


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


const mapActionsToProps = { logoutUser, uploadImage, getUserPosts, loadMoreUserPosts, synchronizePosts }

profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  synchronizePosts: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  getUserPosts: PropTypes.func.isRequired,
  loadMoreUserPosts: PropTypes.func.isRequired,


};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  data: state.data,

});
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(withSnackbar(profile)));
