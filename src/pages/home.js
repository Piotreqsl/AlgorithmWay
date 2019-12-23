import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SaveIcon from '@material-ui/icons/Save';
//import ReactPaginate from 'react-paginate';
import Tooltip from '@material-ui/core/Tooltip';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


import { Waypoint } from 'react-waypoint';
import { getPosts } from '../redux/actions/dataActions'

export class home extends Component {


    state = {
        data: [],
        backupdata: [],
        active: false,
        categories: {
            string: true,
            int: true,
            array: true,
            char: true,
        },
        noMore: false,
        all: true,
        appr: false,
        unappr: false


    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.authenticated !== this.props.user.authenticated && this.props.user.authenticated === true) {


            this.props.enqueueSnackbar('Successfully logged in', {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 3000,

            });
        }

        if ((prevProps.data.posts !== this.props.data.posts) && this.props.data.posts !== undefined) {
            this.setState({
                data: this.props.data.posts,
                backupdata: this.props.data.posts
            });

            var lastId = this.props.data.posts[this.props.data.posts.length - 1].postId;


            this.setState({
                lastid: lastId
            });
        }


    }



    componentDidMount() {
        this.props.getPosts();

    }




    loadMorePosts = () => {
        var link = "/posts/next/" + this.state.lastid;
        axios.get(link).then(res => {


            res.data = this.filterUpcomingData(res.data);


            this.setState({
                data: this.state.data.concat(res.data),
                backupdata: this.state.data.concat(res.data)
            })

            this.setState({
                lastid: res.data[res.data.length - 1].postId
            })



        }).catch(err => {



            this.setState({
                noMore: true
            })


        })
    }


    filterCurrentData = () => {
        let filtered = [];

        if (this.state.all) filtered = this.state.backupdata;
        if (this.state.appr) {
            for (var i = 0; i < this.state.backupdata.length; i++) {
                if (this.state.backupdata[i].verified === true) {

                    filtered.push(this.state.backupdata[i])
                }
            }
        }
        if (this.state.unappr) {
            for (var j = 0; j < this.state.backupdata.length; j++) {
                if (this.state.backupdata[j].verified === false || this.state.backupdata[j].verified === undefined) {
                    filtered.push(this.state.backupdata[j])
                }
            }
        }

        console.log(filtered);

        this.setState({
            data: filtered
        })

    }


    filterUpcomingData = (response) => {

        let filtered = [];

        if (this.state.all) filtered = response
        if (this.state.appr) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].verified === true) {

                    filtered.push(response[i])
                }
            }
        }
        if (this.state.unappr) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].verified === false || response[i].verified === undefined) {

                    filtered.push(response[i])
                }
            }
        }

        console.log(filtered)

        return filtered;
    }


    renderWaypoint = () => {
        if (this.props.user.loading === false && this.state.data.length > 0) {
            return (
                <Waypoint
                    onEnter={this.loadMorePosts}

                />
            )

        }
    }


    toggleClass = () => {
        var currentState = this.state.active;
        this.setState({ ...this.state, active: !currentState });
        console.log(this.state);


    };

    handleChange = name => event => {
        this.setState({ categories: { ...this.state.categories, [name]: event.target.checked } });
    };


    handleChangeGlobal = name => event => {

        this.setState({
            all: false,
            appr: false,
            unappr: false
        })
        this.setState({ [name]: event.target.checked });
    };

    handleSubmitFilters = (event) => {
        event.preventDefault();

        this.toggleClass();
        this.filterCurrentData();

    }


    render() {
        const { loading } = this.props.data;

        let recentPostsMarkup = (!loading && this.state.data.length > 0) ? (
            this.state.data.map((post) => <Post key={post.postId} post={post} />)

        ) : (<div className="post-margin"><center>
            <CircularProgress color="primary" /> </center></div>);



        return (


            <div className="main-content" >
                <Grid container spacing={16}>


                    <Grid item sm={9} xs={12}>

                        <Button variant="contained" className="filtersButton" color="primary" disabled={this.props.user.loading ? true : false} onClick={this.toggleClass}>
                            Filters
                        </Button>

                        <div className={this.state.active ? "filtersDiv isOpen" : "filtersDiv"}>
                            <form onSubmit={this.handleSubmitFilters}>
                                <div className="formWrapper">

                                    <FormGroup className="formGroup" column style={{ marginLeft: 10, marginTop: 5 }}>
                                        <Typography color="primary" variant="button"> Categories: </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.string} onChange={this.handleChange('string')} value="string" />
                                            }
                                            label="Strings"
                                            style={{ paddingLeft: 10 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.int} onChange={this.handleChange('int')} value="int" />
                                            }
                                            label="Integers"
                                            style={{ paddingLeft: 10 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.array} onChange={this.handleChange('array')} value="array" />
                                            }
                                            label="Arrays"
                                            style={{ paddingLeft: 10 }}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.char} onChange={this.handleChange('char')} value="char" />
                                            }
                                            label="Characters"
                                            style={{ paddingLeft: 10 }}
                                        />
                                    </FormGroup>


                                    <FormGroup className="formGroup" column style={{ marginLeft: 10, marginTop: 5, }}>
                                        <Typography color="primary" variant="button"> Kutafiarz: </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.string} onChange={this.handleChange('string')} value="string" />
                                            }
                                            label="Strings"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.int} onChange={this.handleChange('int')} value="int" />
                                            }
                                            label="Integers"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.array} onChange={this.handleChange('array')} value="array" />
                                            }
                                            label="Arrays"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.char} onChange={this.handleChange('char')} value="char" />
                                            }
                                            label="Characters"
                                        />
                                    </FormGroup>

                                    <div className="clearer"></div>

                                </div>
                                <FormLabel component="legend">Gender</FormLabel>

                                <RadioGroup aria-label="Post status" name="postStatus">
                                    <FormControlLabel value="all" control={<Radio checked={this.state.all ? true : false} onChange={this.handleChangeGlobal("all")} />} label="All" />
                                    <FormControlLabel value="appr" control={<Radio checked={this.state.appr ? true : false} onChange={this.handleChangeGlobal("appr")} />} label="Approved" />
                                    <FormControlLabel value="unappr" control={<Radio checked={this.state.unappr ? true : false} onChange={this.handleChangeGlobal("unappr")} />} label="Unapproved" />
                                </RadioGroup>


                                <Tooltip placement="left" title="Save">
                                    <IconButton
                                        disabled={loading}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className="filterBtn"
                                    >
                                        <SaveIcon />
                                    </IconButton>
                                </Tooltip>

                            </form>
                        </div>
                        <br />



                        <div className="feed" >
                            {recentPostsMarkup}
                            <div className="infinite-scroll-example__waypoint">
                                {this.renderWaypoint()}

                                {!loading ? this.state.noMore ? null : (<div className="post-margin"><center>
                                    <LinearProgress color="primary" style={{ width: "100%" }} /></center></div>) : null}


                            </div>

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
    onEnter: PropTypes.func, // function called when waypoint enters viewport
    onLeave: PropTypes.func, // function called when waypoint leaves viewport
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    data: state.data,

});


export default connect(mapStateToProps, { getPosts })(withSnackbar(home));
