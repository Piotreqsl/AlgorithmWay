import React, { Component } from "react";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";

import {markNotificationsRead} from '../redux/actions/userActions'

import IconButton from '@material-ui/core/IconButton'
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "@material-ui/core/Tooltip";


//notification icon types
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export class notifications extends Component {
  state = {
    anchorEl: null
  };



  handleOpen = (event) => {
      this.setState({anchorEl: event.target})
  }

  handleClose = () => {
    this.setState({anchorEl: null})
  }

  onMenuOpened = () => {
      let unreadNotificationsIds = this.props.notifications
      .filter(not => !not.read)
      .map(not => not.notificationId);
      this.props.markNotificationsRead(unreadNotificationsIds);
  }


  render() {
    dayjs.extend(relativeTime);

    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;
    let notificationIcon;
    if (notifications && notifications.length > 0) {
        notifications.filter(not => not.read === false).length > 0 ?
        (notificationIcon = (
        <Badge badgeContent={notifications.filter(not => not.read === false).length > 9 ? ("9+") : notifications.filter(not => not.read === false).length} color="secondary">
          <NotificationsIcon style={{color: "#FFFFFF"}} />
        </Badge>
        )) 
           
        :( notificationIcon = <NotificationsIcon style={{color: "#FFFFFF"}} />) 
    } else {
        notificationIcon = <NotificationsIcon style={{color: "#FFFFFF"}} />
    }


    let notificationsMarkup = notifications && notifications.length > 0 ? (
        notifications.map(not => {
            const type = not.type;
            const time = dayjs(not.createdAt).fromNow();
            const isRead = not.read;

            const sender = not.sender !== "AlgorithmWay admin" ? (
                not.sender
            ) : ("Admin");

            var icon = null;
            var txt = null;
            var link = null;
            if(not.type === "comment") {

              icon =  (<ChatBubbleIcon color="primary" />)
              txt = `${sender} has commented on your post`
              link = `/posts/${not.postId}`

            } else if (not.type === "edit-request") {

               icon = (<EditIcon color="primary" />)
               txt = `${sender} has requested to edit your post`
                link = `/editRequest/${not.editPostId}`
            }else if(not.type === "edit-request-admin") {
              icon =  (<SupervisedUserCircleIcon color="primary" />)
              txt = `Admin has edited your post`

            } else if(not.type === "edit-req-reject") {

            icon =    (<CancelIcon  color="primary" />)
            txt = `${sender} has rejected your request`

            } else if(not.type === "edit-request-owner-to-sender") {
                icon = (<CheckCircleIcon color="primary" />)
                txt = `${sender} has accepted your request`
                link = `/posts/${not.postId}`
            }

            return (
                <MenuItem 
                style={isRead ? {height: "50px"} : {height: "50px", backgroundColor:"#2e2e3a10"}}
                
                component={Link} to={link} 
                onClick={this.handleClose}
                key={not.createdAt}>

                {icon} <div
                      style={{
                        
                        marginRight: "10px"
                      }}
                    ></div>

                    <Typography variant="body2">
                        {txt}
                    </Typography>

                   

                </MenuItem>
            )

        })
    ) : (<p>Nothing to show</p>)

    return (
      <div>
     <Tooltip placement="bottom" title="Notifications"> 
        <IconButton aria-haspopup="true" 
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        onClick={this.handleOpen}
        > 
        {notificationIcon}
        </IconButton>
       </Tooltip>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
          style={{marginTop: "45px",}}
        >

          {notificationsMarkup}

        </Menu>
      </div>
    );
  }
}

notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired,
    
}

const mapStateToProps = state => ({
    notifications: state.user.notifications,
})

export default connect(mapStateToProps, {markNotificationsRead})(notifications);
