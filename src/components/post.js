import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

//Material-UI imports

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton'
import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "@material-ui/core/Tooltip";
import MessageIcon from '@material-ui/icons/Message';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

import dayjs from "dayjs";


import DeletePost from './delete_post'

import { connect } from 'react-redux'
import { likePost, unlikePost } from '../redux/actions/dataActions'
import PropTypes from 'prop-types'



//icons
import LikedIcon from '@material-ui/icons/Favorite';
import LikeIcon from '@material-ui/icons/FavoriteBorder';

const styles = {
  card: {
    display: "flex"
  }
};

class post extends Component {

  likedPost = () => {
    if (this.props.user.likes && this.props.user.likes.find(like => like.postId === this.props.post.postId)) {
      return true;
    } else {
      return false;
    }
  }

  likePost = () => {
    this.props.likePost(this.props.post.postId);
  }
  unlikePost = () => {
    this.props.unlikePost(this.props.post.postId);
  }



  render() {



    dayjs.extend(relativeTime);
    const {
      classes,
      post: {
        title,
        shortDesc,
        userHandle,
        createdAt,
        userImage,
        postId,
        java,
        python,
        cpp,
        likeCount,
        commentCount,
      },
      user: {
        authenticated, credentials: { handle }
      }
    } = this.props;



    const likeButton = !authenticated ? (
      <IconButton style={{ backgroundColor: 'transparent', marginRight: '-12px' }} component={Link} to="/login" >
        <LikeIcon color="primary" />
      </IconButton>
    ) : (
        this.likedPost() ? (
          <IconButton style={{ backgroundColor: 'transparent', marginRight: '-12px' }} onClick={this.unlikePost} >
            <LikedIcon color="primary" />
          </IconButton>
        ) : (

            <IconButton style={{ backgroundColor: 'transparent', marginRight: '-12px' }} onClick={this.likePost} >
              <LikeIcon color="primary" />
            </IconButton>

          )
      )


    const deleteButton = (authenticated && userHandle === handle) || (authenticated && this.props.user.adminPrivileges) ? (

      <DeletePost postId={postId} />

    ) : null



    var j_src;
    var p_src;
    var c_src;
    j_src = "java_logo.png";
    p_src = "python_logo.png";

    c_src = "cpp_logo.png";


    return (



      <div className="post-margin">
        <Card>
          <CardMedia image={userImage} title="User image" />
          <CardContent>
            <Typography
              className="post-title"
              component={Link}
              to={`/posts/${postId}`}
              variant="h6"
            >
              {title}
            </Typography>
            <div className="post-langs">
              {java !== undefined && java !== "" && java !== null ? <Tooltip title="Java" placement="top">
                <img draggable="false" src={j_src} height="24px" />
              </Tooltip> : null}


              {python !== undefined && python !== "" && python !== null ? <Tooltip title="Python" placement="top">
                <img draggable="false" src={p_src} height="24px" />
              </Tooltip> : null}


              {cpp !== undefined && cpp !== "" && cpp !== null ?
                <Tooltip title="C++" placement="top">
                  <img draggable="false" src={c_src} height="24px" />
                </Tooltip> : null}
            </div>
            <br /> <br />
            <Typography variant="body2">{shortDesc}</Typography>
            <div className="post-date">
              <Typography variant="caption" color="inherit">
                {dayjs(createdAt).fromNow()}
              </Typography>

              {likeButton}  <Typography variant="caption" color="inherit">
                {likeCount}
              </Typography>
             
             
             
             
              <IconButton style={{ backgroundColor: 'transparent', marginRight: '-8px', marginTop: "3px" }} >
              <ChatBubbleOutlineIcon color="primary"></ChatBubbleOutlineIcon>
               </IconButton><Typography variant="caption" color="inherit">
                {commentCount}
              </Typography>
              

              {deleteButton}

            </div>
            <div className="post-userhandle">
              <Typography
                component={Link}
                to={`/users/${userHandle}`}
                variant="overline"
                color="inherit"
              >
                {userHandle}
              </Typography>
            </div>
          </CardContent>
        </Card>



      </div>
    );
  }
}


post.propTypes = {
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  user: state.user
})


const mapActionsToProps = {
  likePost,
  unlikePost,

}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(post));
