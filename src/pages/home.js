import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';


import {getPosts} from '../redux/actions/dataActions'

export class home extends Component {
    state = {
        posts: null
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.authenticated !== this.props.user.authenticated && this.props.user.authenticated === true) {
            console.log("change");

            this.props.enqueueSnackbar('Successfully logged in', {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 3000,

            });
        }
    }

    componentDidMount() {
       
this.props.getPosts();


    }
    render() {
        const { posts, loading} = this.props.data;

        console.log(this.props.user.authenticated);

        let recentPostsMarkup = !loading ? (
            posts.map((post) => <Post key={post.postId} post={post} />)
        ) : (<div><center>
            <CircularProgress color="primary" /></center></div>);

        return (


            <div className="main-content" >
                <Grid container spacing={16}>


                    <Grid item sm={9} xs={12}>
                        <div className="feed">
                            {recentPostsMarkup}
                        </div>
                    </Grid>

                    <Grid item sm={3} xs={12}>
                        <p>HISZPAN</p>
                    </Grid>

                </Grid>

            </div>
        )
    }
}

// eslint-disable-next-line react/no-typos
home.PropTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    data: state.data,

});


export default connect(mapStateToProps, {getPosts})(withSnackbar(home));
