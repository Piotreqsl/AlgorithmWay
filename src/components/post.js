import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

//Material-UI imports

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "@material-ui/core/Tooltip";

import dayjs from "dayjs";

const styles = {
  card: {
    display: "flex"
  }
};

class post extends Component {


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
        cpp
      }
    } = this.props;

    var j_src;
    var p_src;
    var c_src;
    if (java !== "") {
      j_src = "java_logo.png";
    }

    if (python !== "") {
      p_src = "python_logo.png";
    }

    if (cpp !== "") {
      c_src = "cpp_logo.png";
    }

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
              <Tooltip title="Java" placement="top">
                <img draggable="false" src={j_src} height="24px" />
              </Tooltip>

              <Tooltip title="Python" placement="top">
                <img draggable="false" src={p_src} height="24px" />
              </Tooltip>

              <Tooltip title="C++" placement="top">
                <img draggable="false" src={c_src} height="24px" />
              </Tooltip>
            </div>
            <br /> <br />
            <Typography variant="body2">{shortDesc}</Typography>
            <div className="post-date">
              <Typography variant="caption" color="inherit">
                {dayjs(createdAt).fromNow()}
              </Typography>
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

export default withStyles(styles)(post);
