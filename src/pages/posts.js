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
import Highlight from "react-highlight.js"




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
   

  };

  handleAlignment = event => {
    this.setState({ alignment: event.currentTarget.value });

    if (event.currentTarget.value == "js") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.java;
      //console.log(this.state.javaCode);
      this.setState({
          currentCode: "java",
      })
    }

    if (event.currentTarget.value == "py") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.python;
      // console.log(this.state.pythonCode);

      this.setState({
        currentCode: "python",
    })

    }

    if (event.currentTarget.value == "cpp") {
      //document.getElementById("codeBoxing").innerHTML = this.props.post.cpp;
      // console.log(this.state.cppCode);
      this.setState({
        currentCode: "cpp",
    })

    }
  };

  handleExpand = () => {
    console.log(this.state.expandedC);
    if (this.state.expandedC == false) {
      document.getElementById("codeBox").classList.add("blackBoxExpanded");
      this.setState({ expandedC: true });
    }
    if (this.state.expandedC == true) {
      document
        .getElementById("codeBox")
        .classList.remove("blackBoxExpanded");

      this.setState({ expandedC: false });
    }
  };

 




  componentWillMount() {
    console.log(document.location.href);
    let str = document.location.href;
    let arr = str.split("/");
    console.log(arr[4]);
    let loc = arr[4];

    this.props.getPost(loc);
  

   


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
        comments
      },
      UI: { loading }
    } = this.props;
    dayjs.extend(relativeTime);

    
    

    const handleChangePanel = event => {
      console.log("sdas");
      var ex = this.state.expanded;
      this.setState({
        expanded: !ex
      });
    
    };

   
    
    
    return (

      <div class="main-content-squeezed">
          
        {!loading ? (
           
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
            <Tooltip
              placement="left"
              title={dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
            >
              <Typography
                style={{ marginTop: "25px", float: "right" }}
                variant="caption"
              >
                {dayjs(createdAt).fromNow()}
              </Typography>
            </Tooltip>
            <div style={{ clear: "both" }}></div>

            <Typography style={{ marginTop: "15px", marginBottom: "25px" }} variant="body2">
              {desc}
            </Typography>
            

           









                
            {this.props.post.java || this.props.post.cpp || this.props.post.python ? (

               

                <div>
                <Grid container spacing={1}>
              <Grid item sm={12} md={12}>
                <div className="codeBoxNav">
                  <ToggleButtonGroup
                    value={this.state.alignment}
                    exclusive
                    onChange={this.handleAlignment}
                  >
                    
                    {this.props.post.java  ? (

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
                  <div style={{clear: "both"}}></div>
                </div>
              </Grid>
            </Grid>
            
           

            <div id="codeBox" className="codeInputs">
            
            {this.props.post.java && this.state.currentCode === "java" ?  (
                 <Highlight language={"java"}>
             {this.props.post.java}
            </Highlight>
            ) : null}
           
           {this.props.post.python && this.state.currentCode === "python" ? (

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

            



















          </Paper>
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
  UI: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  post: state.data.post,
  UI: state.UI
});

const mapActionsToProps = {
  getPost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(posts));
