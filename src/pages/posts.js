import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { getPost } from "../redux/actions/dataActions";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Link } from "react-router-dom";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import CropFreeIcon from "@material-ui/icons/CropFree";
import IconButton from "@material-ui/core/IconButton";
import Highlight from "react-highlight.js";
import DialogIMG from "../components/dialog_img";

import Avatar from "@material-ui/core/Avatar";
import LikedIcon from '@material-ui/icons/Favorite';
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import { likePost, unlikePost } from '../redux/actions/dataActions'

import Comments from '../components/comments'


const styles = {
  paper: {
    padding: "20px"
  },
  marginUni: {
    marginBottom: "10px"
  },
  expansion: {
    margin: "-20px"
  },
  heading: {
    fontSize: "1.7rem"
  }
};

export class posts extends Component {
  state = {
    postId: "",
    expanded: false,
    expandedC: false,

    alignment: "",
    currentCode: "",
    img: []
  };

  handleAlignment = event => {
    this.setState({ alignment: event.currentTarget.value });

    if (event.currentTarget.value == "js") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.java;
      //console.log(this.state.javaCode);
      this.setState({
        currentCode: "java"
      });
    }

    if (event.currentTarget.value == "py") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.python;
      // console.log(this.state.pythonCode);

      this.setState({
        currentCode: "python"
      });
    }

    if (event.currentTarget.value == "cpp") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.cpp;
      // console.log(this.state.cppCode);
      this.setState({
        currentCode: "cpp"
      });
    }
  };

  handleExpand = () => {
    console.log(this.state.expandedC);
    if (this.state.expandedC == false) {
      document.getElementById("codeBox").classList.add("blackBoxExpanded");
      this.setState({ expandedC: true });
    }
    if (this.state.expandedC == true) {
      document.getElementById("codeBox").classList.remove("blackBoxExpanded");

      this.setState({ expandedC: false });
    }
  };

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

  componentDidMount() {
    let str = this.props.location.pathname;
    let arr = str.split("/");
    console.log(arr[2]);
    let loc = arr[2];
    console.log("mount dla " + loc);

    if (arr[1] === "posts" && arr[2] !== "logo192.png") this.props.getPost(loc);
  }

  render() {
    const {
      classes,
      post: {
        postId,
        createdAt,
        shortDesc,
        desc,
        title,
        userHandle,
        userImage,
        commentCount,
        likeCount,
        java,
        python,
        cpp,
        comments,
        categories,
        images
      },
      user: {
        credentials: { handle },
        authenticated
      },
      UI: { loading }
    } = this.props;

    //const cat = (!this.props.UI.loading && this.props.UI.success !== null ? <p>{this.props.post.categories[0]} </p> : null)

    dayjs.extend(relativeTime);


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


    const handleChangePanel = event => {
      console.log(this.props.post);
      var ex = this.state.expanded;
      this.setState({
        expanded: !ex
      });
    };

    return (
      <div className="main-content-squeezed">
        {!loading ? (
          <div>
          <Paper className={classes.paper}>
            <ExpansionPanel
              className={classes.expansion}
              expanded={this.state.expanded}
              onChange={handleChangePanel}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography color="primary" className={classes.heading}>
                  {title}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography className={classes.marginUni} variant="body1">
                  {shortDesc}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
           
            <div className="prev-userhandle">
              <div className="prev-avNhandle"> 
              <Avatar style={{width: "30px", height: "30px"}} />
              <Typography style={{marginLeft: "5px"}}
                component={Link}
                to={
                  !loading
                    ? this.props.user.credentials.handle === this.props.post.userHandle
                      ? `/user`
                      : `/users/${userHandle}`
                    : null
                }
                variant="caption"
              >
                {userHandle}
               
              </Typography>
              </div>

                <div>

                {likeButton}  <Typography variant="caption" color="inherit">
                {likeCount}
              </Typography>

                </div>



              <Tooltip
              placement="left"
              title={dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
            >
              <Typography
                style={{  float: "right" }}
                variant="caption"
              >
                {dayjs(createdAt).fromNow()}
              </Typography>
            </Tooltip>

            </div>

            

            <div style={{ clear: "both" }}></div>

            <Typography
              style={{ marginTop: "15px", marginBottom: "25px" }}
              variant="body2"
            >
              {desc}
            </Typography>

            {this.props.post.java ||
            this.props.post.cpp ||
            this.props.post.python ? (
              <div>
                <Grid container spacing={1}>
                  <Grid item sm={12} md={12}>
                    <div className="codeBoxNav">
                      <ToggleButtonGroup
                        value={this.state.alignment}
                        exclusive
                        onChange={this.handleAlignment}
                      >
                        {this.props.post.java ? (
                          <ToggleButton id="langBTN" value="js">
                            <img
                              draggable="false"
                              src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/java_logo.png?alt=media&token=03067a8a-721b-4f69-ad32-ef2df63a9584"
                              height="24px"
                            />
                          </ToggleButton>
                        ) : null}

                        {this.props.post.python ? (
                          <ToggleButton id="langBTN" value="py">
                            <img
                              draggable="false"
                              src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/python_logo.png?alt=media&token=7e7010bb-fa65-445d-be7a-7a429c703d2c"
                              height="24px"
                            />
                          </ToggleButton>
                        ) : null}

                        {this.props.post.cpp ? (
                          <ToggleButton id="langBTN" value="cpp">
                            <img
                              draggable="false"
                              src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/cpp_logo.png?alt=media&token=8389d1bd-c9f0-4542-a274-1a33d9922e6f"
                              height="24px"
                            />
                          </ToggleButton>
                        ) : null}
                      </ToggleButtonGroup>
                      <IconButton
                        onClick={this.handleExpand}
                        className="codeBoxingCrop"
                      >
                        <CropFreeIcon />
                      </IconButton>
                      <div style={{ clear: "both" }}></div>
                    </div>
                  </Grid>
                </Grid>

                <div id="codeBox" className="codeInputs">
                  {this.state.currentCode === "" ? (
                    <Highlight language={"java"}>
                      {`
|===============================================|
|                                               |
|   /* Choose desired programming language */   |
|                                               |
|===============================================| `}
                    </Highlight>
                  ) : null}

                  {this.props.post.java && this.state.currentCode === "java" ? (
                    <Highlight language={"java"}>
                      {this.props.post.java}
                    </Highlight>
                  ) : null}

                  {this.props.post.python &&
                  this.state.currentCode === "python" ? (
                    <Highlight language={"python"}>
                      {this.props.post.python}
                    </Highlight>
                  ) : null}

                  {this.props.post.cpp && this.state.currentCode === "cpp" ? (
                    <Highlight language={"c++"}>
                      {this.props.post.cpp}
                    </Highlight>
                  ) : null}
                </div>
              </div>
            ) : null}

            {(!this.props.UI.loading && this.props.UI.success !== null ? (
              this.props.post.images
            ) : null) ? (
              <div className="DialogIMG-flexContainer">
                {(() => {
                  const arr =
                    !this.props.UI.loading && this.props.UI.success !== null
                      ? this.props.post.images
                      : null;

                  console.log(arr);

                  const imgs = [];

                  if (arr) {
                    for (
                      let i = 0;
                      i <
                      (!this.props.UI.loading && this.props.UI.success !== null
                        ? this.props.post.images.length
                        : null);
                      i++
                    ) {
                      imgs.push(
                        <DialogIMG
                          value={
                            !this.props.UI.loading &&
                            this.props.UI.success !== null
                              ? this.props.post.images[i]
                              : null
                          }
                        />
                      );
                    }
                  }
                  return imgs;
                })()}
              </div>
            ) : null}
          </Paper>
                <p>dodawanie postów form</p>
<Comments comments={comments} currentUserHandle={this.props.user.credentials.handle} />
</div>

        ) : (
          <LinearProgress color="primary" />
        )}
      </div>
    );
  }
}

posts.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,

  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,

  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.data.post,
  UI: state.UI,
  user: state.user
});

const mapActionsToProps = {
  getPost,
  likePost,
  unlikePost,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(posts));
