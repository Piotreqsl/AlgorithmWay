import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from '@material-ui/core/Tooltip'
export class comments extends Component {
  render() {
    dayjs.extend(relativeTime);
    const { comments, currentUserHandle } = this.props;
    return (
      <div>
        {comments ? (
          <Grid container>
            {comments.map(comment => {
              const { body, createdAt, userImage, userHandle } = comment;
              return (
                <Paper
                  style={{ width: "100%", marginTop: "10px" }}
                  key={createdAt}
                >
                  <div className="comment-display">
                    <div className="comment-info">
                      <Avatar src={userImage} component={Link}
                        to={
                          userHandle === currentUserHandle
                            ? `/user`
                            : `/users/${userHandle}`
                        } />

                      <Typography
                        variant="caption"
                        component={Link}
                        to={
                          userHandle === currentUserHandle
                            ? `/user`
                            : `/users/${userHandle}`
                        }
                      >
                        {userHandle}
                      </Typography>
                    </div>
                    <div
                      style={{
                        borderLeft: "1px solid #00000023",
                        height: "inherit",
                        marginRight: "10px"
                      }}
                    ></div>
                    <div className="comment-body">
                      <Typography variant="body2">{body}</Typography>

                      <Tooltip
                        placement="left"
                        title={dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                      >
                        <Typography
                          style={{ float: "right" }}
                          variant="caption"
                        >
                          {dayjs(createdAt).fromNow()}
                        </Typography>
                      </Tooltip>
                    </div>
                  </div>
                </Paper>
              );
            })}
          </Grid>
        ) : null}
      </div>
    );
  }
}

comments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default comments;
