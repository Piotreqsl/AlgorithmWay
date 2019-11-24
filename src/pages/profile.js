import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
//MUI
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Icon from '@material-ui/core/Icon';



const styles = {
  paper: {
    padding: "20px"
  },

  left: {
    maxWidth: 300
  }
};

export class profile extends Component {
  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, location },
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
              <Typography variant="h5"> {handle} </Typography>


              <div className="profile-ainfo">
              <Typography className={classes.left} variant="body2">
                {" "}
                Location: {location} Gniezno, Polska {" "}
              </Typography>

              <Typography className={classes.left} variant="body2">
                {" "}
                Joined: {createdAt}  {" "}
              </Typography>
            </div>


            </div>


            


           

            <Typography className="profile-bio" variant="body2">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.{" "}
            </Typography>

            
          </Paper>
        </div>
      ) : (
        <p>not urs prof</p>
      )
    ) : (
      <p> loading... </p>
    );

    return profileMarkup;
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
