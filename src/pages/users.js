import React, { Component } from 'react'
import { getForeignUser } from "../redux/actions/dataActions"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NotFound from './notFound'
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

import Post from "../components/post";
import CircularProgress from "@material-ui/core/CircularProgress";

import dayjs from "dayjs";
import theTime from "dayjs/plugin/advancedFormat";




import {
  List, AutoSizer, CellMeasurerCache,
  CellMeasurer, InfiniteLoader
} from "react-virtualized";
import 'react-virtualized/styles.css';

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

import { loadMoreUserPosts, getUserPosts } from '../redux/actions/dataActions'
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

export class users extends Component {

  state = {
    filtered: 0
  }

  _cache = new CellMeasurerCache({ minHeight: 150, fixedWidth: true, defaultHeight: 190 });



  loadMorePosts = () => {

    if (!this.props.data.noMore && this.props.data.user) this.props.loadMoreUserPosts(this.props.data.user.handle);
  }



  componentDidMount() {
    let str = this.props.location.pathname;
    let arr = str.split("/");
    let loc = arr[2];
    if (arr[1] === "users" && arr[2] !== "logo192.png") this.props.getForeignUser(loc);




    if (!this.props.data.noMore) this.props.getUserPosts(loc);


  }


  componentDidUpdate(prevProps) {

    if (this.list) {
      this.list.forceUpdateGrid();
      this.list.recomputeRowHeights()
    }

    let str = this.props.location.pathname;
    let arr = str.split("/");
    let loc = arr[2];

    if (loc === this.props.user.credentials.handle) {
      this.props.history.push('/user');
    }


    if (!this.props.data.noMore && this.props.data.backupdata !== prevProps.data.backupdata && prevProps.data.lastId !== this.props.data.lastId && this.props.data.user) {
      console.log("if");
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

    console.log("z loład")
    this.loadMorePosts()
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


    let str = this.props.location.pathname;
    let arr = str.split("/");
    let loc = arr[2];
    if (arr[1] === "users" && arr[2] !== "logo192.png") { loc = loc } else {
      loc = null;
    }




    const {
      classes,
      UI: { loading },

    } = this.props;



    const profileMarkup = !this.props.data.loading && !this.props.UI.errors ? (

      <div class="main-content-squeezed">
        <Paper className={classes.paper}>
          <div className="profile-av">


            <div className="container1">

              <Avatar alt={
                this.props.data.user ? (this.props.data.user.handle) : null


              } src={

                this.props.data.user ? (this.props.data.user.imageUrl) : null




              } className="bigAvatar-scss" />


            </div>



            <Typography variant="h5"> {this.props.data.user ? (this.props.data.user.handle) : null}</Typography>

            <div className="profile-ainfo">
              <Typography className={classes.left} variant="body2">
                {" "}
                <Tooltip title="Location" placement="left">
                  <Location color="primary"></Location>
                </Tooltip>
                <div className={classes.icoMargin} /> {this.props.data.user ? (this.props.data.user.location) : null}{" "}
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
                <div className={classes.icoMargin} /> {this.props.data.user ? (this.props.data.user.reputation) : null}{" "}
              </Typography>
            </div>
          </div>

          <Typography className="profile-bio" variant="body2">
            {" "}
            {this.props.data.user ? (this.props.data.user.bio) : null}{" "}
          </Typography>



        </Paper>


        <div style={{ display: 'flex', marginTop: "20px" }}>

          <div style={{ flex: '1 1 auto', height: '57vh' }}>




            <InfiniteLoader
              isRowLoaded={this.isRowLoaded}
              loadMoreRows={this.loadMorePosts}
              rowCount={10000000}
            >
              {({ onRowsRendered, registerChild }) => (


                <AutoSizer >
                  {({ width, height }) => (



                    <div className="list">
                      <List style={{ outline: "none" }}
                        ref={this.bindListRef}
                        width={width}
                        height={height}
                        deferredMeasurementCache={this._cache}
                        rowHeight={this._cache.rowHeight}
                        rowRenderer={this.rowRenderer}
                        rowCount={this.props.data.posts.length}
                        overscanRowCount={3}
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
        (!this.props.UI.errors ? (<div class="main-content-squeezed">
          <LinearProgress color="primary" />
        </div>) : <NotFound />


        )


      )



    return profileMarkup;








  }

}


users.propTypes = {

  data: PropTypes.object.isRequired,

  UI: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getForeignUser: PropTypes.func.isRequired,
  loadMoreUserPosts: PropTypes.func.isRequired,
  getUserPosts: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  onEnter: PropTypes.func,
  bottomOffset: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  scrollableAncestor: PropTypes.any,
};
const mapStateToProps = state => ({
  data: state.data,

  UI: state.UI,
  user: state.user
});

const mapActionsToProps = {
  getForeignUser, loadMoreUserPosts, getUserPosts
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(users));







