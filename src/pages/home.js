import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post';

export class home extends Component {
    state = {
        posts: null
    }

    componentDidMount(){
        axios.get('/posts')
        .then(res => {

            console.log(res.data)

            this.setState({
                posts: res.data
            })
        } )
        .catch(err => console.log(err));
    }
    render() {

        let recentPostsMarkup = this.state.posts ? (
            this.state.posts.map((post) => <Post post={post}/>)
        ) : (<p>Loading...</p>);

        return (
           

                <div className="main-content" > 
            <Grid container spacing={16}>


                <Grid item sm={9} xs={12}>
                    {recentPostsMarkup}
                </Grid>

                <Grid item sm={3} xs={12}>
                    <p>HISZPAN</p>
                </Grid>

            </Grid>

            </div>
        )
    }
}

export default home
