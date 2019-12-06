import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

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
        axios.get('/posts')
            .then(res => {

                console.log(res.data)

                this.setState({
                    posts: res.data
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        console.log(this.props.user.authenticated);

        let recentPostsMarkup = this.state.posts ? (
            this.state.posts.map((post) => <Post key={post.postId} post={post} />)
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

    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,

});


export default connect(mapStateToProps)(withSnackbar(home));
