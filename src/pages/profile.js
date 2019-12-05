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

//icons
import Location from "@material-ui/icons/LocationOn";
import EventIcon from "@material-ui/icons/Event";
import FireplaceIcon from "@material-ui/icons/Fireplace";
import EditIcon from "@material-ui/icons/Edit";

import Tooltip from "@material-ui/core/Tooltip";
import { height } from "@material-ui/system";

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
  render() {
    dayjs.extend(theTime);

    let recentPostsMarkup = this.state.posts ? (
      this.state.posts.map(post => <Post key={post.postId} post={post} />)
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
              <Avatar alt={handle} src={imageUrl} className="bigAvatar-scss" />
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
                  </Tooltip>{" "}
                  <div className={classes.icoMargin} />{" "}
                  {dayjs(createdAt).format("DD-MM-YYYY")},{" "}
                  {dayjs(createdAt).fromNow()}{" "}
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

            <Dialog bio={bio} location={location} test="test" />
          </Paper>

          <div className={classes.profilePosts}>{recentPostsMarkup}</div>
        </div>
      ) : (
        <p>not urs prof</p>
      )
    ) : (
      <p> loading... </p>
    );

    return profileMarkup;
  }

  state = {
    posts: null
  };

  componentDidMount() {
    axios
      .get(`/users/${this.props.user.credentials.handle}`)
      .then(res => {
        console.log("Hello " + this.props.user.credentials.handle + "!");

        this.setState({
          posts: res.data.posts
        });
      })
      .catch(err => console.log("PER POST: " + err));
  }
}

const mapStateToProps = state => ({
  user: state.user
});

profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(profile));
