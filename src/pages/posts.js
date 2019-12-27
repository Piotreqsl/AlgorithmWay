import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import {getPost} from '../redux/actions/dataActions';
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'



const styles = {
    paper: {
      padding: "20px"
    },
  
   
  };



export class posts extends Component {

    state = {
        postId: "",


    }

    componentWillMount() {
        console.log(document.location.href);
        let str = document.location.href;
        let arr = str.split("/");
        console.log(arr[4]);
         let loc =  arr[4];
        this.setState({
            postId: loc
        });


    }
    
    render() {
        const {
            classes, post: {post: {postId, createdAt, shortDesc, desc, title, userHandle, userImage, commentCount, likeCount, java, python, cpp}}
            
          } = this.props;

        return (
            <div class="main-content-squeezed">
                <Paper className={classes.paper}>
                    <Typography>
                        aaa
                    </Typography>
                </Paper>
            </div>
        )
    }
}

posts.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    post: state.data.post,
    UI: state.UI
})

const mapActionsToProps = {
    getPost,

}

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(posts));
