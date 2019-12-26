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
import { getPosts, pushPosts, filterPosts, restorePosts } from '../redux/actions/dataActions'

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
        unappr: false,
        code: {
            java: true,
            cpp: true,
            python: true
        },
    }



    filterCurrentData = () => {



        let filtered = [];


        /// Ustawianie wszystkich postów, bez względu na filtry kategorii ale z uwzględnieniem approved i 
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




        let arrayFilters = [];


        if (this.state.categories.char && this.state.categories.string && this.state.categories.int && this.state.categories.array) {
            console.log("everything, no filtering");
        } else {


            if (this.state.categories.char) {
                arrayFilters.push('char');
            }

            if (this.state.categories.int) {
                arrayFilters.push('int');
            }

            if (this.state.categories.array) {
                arrayFilters.push('array');
            }

            if (this.state.categories.string) {
                arrayFilters.push('string');
            }

            console.log("filtry to " + arrayFilters);
            filtered = this.advancedFiltering(filtered, arrayFilters);
        }


        let codeFilters = [];

        if (this.state.code.java && this.state.code.cpp && this.state.code.python) {
            console.log("bez filtracji kodu");
        }
        else {
            if (this.state.code.java) {
                codeFilters.push("java")
            }

            if (this.state.code.cpp) {
                codeFilters.push("cpp")
            }

            if (this.state.code.python) {
                codeFilters.push("python")
            }

            filtered = this.advancedFilteringCode(filtered, codeFilters);
        }









        console.log(filtered);



        console.log("curretn")



        /// Jeśli waypoint jest za wysoko, to automatycznie ładuje

        this.setState({
            data: filtered
        }, () => {
            this.props.restorePosts(this.state.data)
            if (this.state.data.length <= 5 && !this.state.noMore) {
                this.loadMorePosts()
            }

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

        let arrayFilters = [];


        if (this.state.categories.char && this.state.categories.string && this.state.categories.int && this.state.categories.array) {
            console.log("everything, no filtering");
        } else {


            if (this.state.categories.char) {
                arrayFilters.push('char');
            }

            if (this.state.categories.int) {
                arrayFilters.push('int');
            }

            if (this.state.categories.array) {
                arrayFilters.push('array');
            }

            if (this.state.categories.string) {
                arrayFilters.push('string');
            }

            console.log("filtry to " + arrayFilters);
            filtered = this.advancedFiltering(filtered, arrayFilters);
        }


        let codeFilters = [];

        if (this.state.code.java && this.state.code.cpp && this.state.code.python) {
            console.log("bez filtracji kodu");
        }
        else {
            if (this.state.code.java) {
                codeFilters.push("java")
            }

            if (this.state.code.cpp) {
                codeFilters.push("cpp")
            }

            if (this.state.code.python) {
                codeFilters.push("python")
            }

            filtered = this.advancedFilteringCode(filtered, codeFilters);
        }







        console.log(filtered)

        return filtered;
    }

    loadMorePosts = () => {
        var link = "/posts/next/" + this.state.lastid;

        console.log("lołdowanie postów");
        axios.get(link).then(res => {

            //this.props.pushPosts(res.data);

            res.data = this.filterUpcomingData(res.data)
            if (res.data.length === 0) this.loadMorePosts();





            // Jeśli już nie ma wiecej postów (na cygana shandlowane :)))) 
        }).catch(err => {

            this.setState({
                noMore: true
            })


        })
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

            console.log("przeszedł drugi if")
            var lastId = this.props.data.posts[this.props.data.posts.length - 1].postId;





            this.setState({
                data: this.filterUpcomingData(this.props.data.posts),
                backupdata: this.props.data.posts,
                lastid: lastId,
            });

            this.props.restorePosts(this.filterUpcomingData(this.props.data.posts))
            console.log("updejt jakikolwiek");


        }









    }





    componentDidMount() {
        this.props.getPosts();
    }




    advancedFiltering = (mainArray, filters) => {
        let filtered = [];

        for (var i = 0; i < mainArray.length; i++) {
            if (mainArray[i].categories.some(r => filters.includes(r))) {
                filtered.push(mainArray[i])
            }
        }

        return filtered;

    }


    advancedFilteringCode = (mainArray, filters) => {

        let filtered = [];



        for (var i = 0; i < mainArray.length; i++) {
            let existingCode = [];

            if (mainArray[i].java !== undefined) existingCode.push("java")
            if (mainArray[i].cpp !== undefined) existingCode.push("cpp")
            if (mainArray[i].python !== undefined) existingCode.push("python")


            if (existingCode.some(r => filters.includes(r))) {
                filtered.push(mainArray[i]);
            }


        }

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

    handleChangeCode = name => event => {
        this.setState({ code: { ...this.state.code, [name]: event.target.checked } })
    }


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

        if (!loading && this.state.data.length === 0 && this.state.noMore === true) {
            recentPostsMarkup = <p>No posts found</p>;
        }





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
                                <div className="formWrapper">


                                    <RadioGroup className="formGroup" style={{ float: "left", }} aria-label="Post status" name="postStatus">
                                        <FormLabel component="legend">Gender</FormLabel>
                                        <FormControlLabel value="all" control={<Radio checked={this.state.all ? true : false} onChange={this.handleChangeGlobal("all")} />} label="All" />
                                        <FormControlLabel value="appr" control={<Radio checked={this.state.appr ? true : false} onChange={this.handleChangeGlobal("appr")} />} label="Approved" />
                                    </RadioGroup>

                                    <FormGroup column className="formGroup" style={{ float: "left" }}>
                                        <Typography color="primary" variant="button"> Kutafiarz: </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.code.java} onChange={this.handleChangeCode('java')} value="java" />
                                            }
                                            label="Java"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.code.cpp} onChange={this.handleChangeCode('cpp')} value="cpp" />
                                            }
                                            label="C++"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.code.python} onChange={this.handleChangeCode('python')} value="python" />
                                            }
                                            label="Python"
                                        />

                                    </FormGroup>



                                    <div className="clearer"></div>
                                </div>

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
    restorePosts: PropTypes.func.isRequired,
    pushPosts: PropTypes.func.isRequired,
    filterPosts: PropTypes.func.isRequired,
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


export default connect(mapStateToProps, { getPosts, pushPosts, filterPosts, restorePosts })(withSnackbar(home));
