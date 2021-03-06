import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';


import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import {
    List, AutoSizer, CellMeasurerCache,
    CellMeasurer, InfiniteLoader
} from "react-virtualized";
import EmailIcon from '@material-ui/icons/Email';
import 'react-virtualized/styles.css'; // only needs to be imported once
import GavelIcon from '@material-ui/icons/Gavel';

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
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip';
import FireplaceIcon from "@material-ui/icons/Fireplace";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Avatar from '@material-ui/core/Avatar'
import SecurityIcon from '@material-ui/icons/Security';

import { Waypoint } from 'react-waypoint';
import { getPosts, loadMorePosts, filterPosts, synchronizePosts, getUsersByRep } from '../redux/actions/dataActions'
import { flexbox } from '@material-ui/system';
import { Helmet } from 'react-helmet'

export class home extends Component {

    _cache = new CellMeasurerCache({ minHeight: 150, fixedWidth: true, defaultHeight: 190 });

    state = {
        data: [],
        backupdata: [],
        approvedOnly: false,
        categoryFilters: [],
        codeFilters: [],
        active: false,
        categories: {
            string: true,
            int: true,
            array: true,
            char: true,
            crypt: true,
            compression: true,
            AI: true,
            DS: true
        },
        noMore: false,
        apprOnly: true,
        code: {
            java: true,
            cpp: true,
            python: true
        },
    }





    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user.authenticated !== this.props.user.authenticated && this.props.user.authenticated === true) {


            this.props.enqueueSnackbar('Successfully logged in', {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 3000,

            });
        }

        if (prevProps.UI.success !== this.props.UI.success && this.props.UI.success === "Post approved") {
            this.props.enqueueSnackbar('Post successfully approved', {
                variant: "success",
                autoHideDuration: 3000,
                preventDuplicate: false,

            });
        }

        if (prevProps.UI.errors !== this.props.UI.errors && this.props.UI.errors === "Post already approved") {
            this.props.enqueueSnackbar("Post already approved", {
                variant: "error",
                autoHideDuration: 3000,
                preventDuplicate: false,

            });

        }

        if (prevProps.UI.success !== this.props.UI.success && this.props.UI.success === "Edited immediately by owner") {
            this.props.enqueueSnackbar("Edited immediately by owner", {
                variant: "success",
                autoHideDuration: 3000,
                preventDuplicate: false,

            });
        }

        if (prevProps.UI.success !== this.props.UI.success && this.props.UI.success === "Edited immediately by admin") {
            this.props.enqueueSnackbar("Edited immediately by admin", {
                variant: "success",
                autoHideDuration: 3000,
                preventDuplicate: false,

            });
        }


        if (this.props.UI.success === "Deleted succesfully" && prevProps.UI.success !== this.props.UI.success) {
            this.props.enqueueSnackbar("Deleted successfully", {
                variant: "success",
                autoHideDuration: 3000,
                preventDuplicate: false,

            });
            this._cache.clearAll();
            this.list.recomputeRowHeights();
            this.list.forceUpdateGrid();


        }



        //
        if (this.list) {
            this.list.forceUpdateGrid();
            this.list.recomputeRowHeights();
        }




        if (prevProps.data.posts.length !== this.props.data.posts.length && this.props.data.backupdata.length > 0 && this.props.data.posts.length > 0) {
            this._cache.clearAll();
            this.list.recomputeRowHeights();
            this.list.forceUpdateGrid();
        }





        if (this.props.data.filters.search.length > 0 && this.props.data.posts !== prevProps.data.posts && !this.props.data.noMore && this.props.data.posts.length <= 5) {
            this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly, this.props.data.filters.search);
        }








        if ((prevProps.data.backupdata !== this.props.data.backupdata && this.props.data.posts.length <= 5 && !this.props.data.noMore && !this.props.data.noMore) || (prevProps.data.backupdata !== this.props.data.backupdata && this.props.data.posts === prevProps.data.posts && !this.props.data.noMore)) {
            this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly, this.props.data.filters.search);
        }



    }


    componentDidMount() {
        this.props.getPosts();
        this.props.getUsersByRep();
    }


    toggleClass = () => {
        var currentState = this.state.active;
        this.setState({ ...this.state, active: !currentState });

    };

    handleChange = name => event => {
        this.setState({ categories: { ...this.state.categories, [name]: event.target.checked } });
    };

    handleChangeCode = name => event => {
        this.setState({ code: { ...this.state.code, [name]: event.target.checked } })
    }


    handleChangeGlobal = name => event => {


        if (name === "appr") {
            this.setState({ apprOnly: true })
        }
        else this.setState({ apprOnly: false })




    };

    handleSubmitFilters = (event) => {
        event.preventDefault();

        this.toggleClass();



        var approvedOnly = true;

        if (!this.state.apprOnly) approvedOnly = false;

        this.setState({
            approvedOnly: approvedOnly
        })


        /// Filtry na kategorie
        let arrayFilters = [];
        if (this.state.categories.char && this.state.categories.string && this.state.categories.int && this.state.categories.array && this.state.categories.DS && this.state.categories.AI && this.state.categories.crypt && this.state.categories.compression) {

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

            if (this.state.categories.crypt) {
                arrayFilters.push('crypt');
            }

            if (this.state.categories.AI) {
                arrayFilters.push('AI');
            }

            if (this.state.categories.DS) {
                arrayFilters.push('DS');
            }

            if (this.state.categories.compression) {
                arrayFilters.push('compression');
            }

        }

        /// Filtry na kod
        let codeFilters = [];
        if (this.state.code.java && this.state.code.cpp && this.state.code.python) {

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
        }

        console.log(this.state)




        this.setState({
            approvedOnly: approvedOnly,
            codeFilters: codeFilters,
            categoryFilters: arrayFilters

        }, () => this.props.filterPosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly, document.getElementById("searchBAR").value))




    }

    bindListRef = ref => {
        this.list = ref;
    };


    isRowLoaded = ({ index }) => {
        return !!this.props.data.posts[index];
    }

    loadMoreRows = ({ startIndex, stopIndex }) => {

        if (!this.props.UI.processing && !this.props.data.noMore) this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly, this.props.data.filters.search)
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

    //TODO: Usunac searchbara gdziekolwiek indziej niz na "/", ogarnac coz z tym backupdata/posts

    render() {
        const { loading } = this.props.data;

        return (


            <div className="main-content" >
                <Grid container spacing={16}>

                    <Helmet>
                        <title>{"CodeLimes"}</title>
                    </Helmet>


                    <Grid item sm={9} xs={12}>

                        <Button variant="contained" id={"filters"} className="filtersButton" color="primary" disabled={this.props.user.loading ? true : false} onClick={this.toggleClass}>
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
                                        <Typography color="primary" variant="button"> Check all to see everything </Typography>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.crypt} onChange={this.handleChange('crypt')} value="crypt" />
                                            }
                                            label="Cryptography"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.compression} onChange={this.handleChange('compression')} value="compression" />
                                            }
                                            label="Compression"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.AI} onChange={this.handleChange('AI')} value="AI" />
                                            }
                                            label="Artificial Intelligence"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={this.state.categories.DS} onChange={this.handleChange('DS')} value="DS" />
                                            }
                                            label="Data Structures"
                                        />
                                    </FormGroup>

                                    <div className="clearer"></div>

                                </div>
                                <div className="formWrapper">


                                    <RadioGroup className="formGroup" style={{ float: "left", }} aria-label="Post status" name="postStatus">
                                        <Typography color="primary" variant="button"> Posts status </Typography>
                                        <FormControlLabel value="appr" control={<Radio checked={this.state.apprOnly ? true : false} onChange={this.handleChangeGlobal("appr")} />} label="Approved only" />
                                        <FormControlLabel value="all" control={<Radio checked={this.state.apprOnly ? false : true} onChange={this.handleChangeGlobal("all")} />} label="All" />
                                    </RadioGroup>

                                    <FormGroup column className="formGroup" style={{ float: "left" }}>
                                        <Typography color="primary" variant="button"> Code implementation </Typography>
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



                            {(!loading) ?


                                this.props.data.posts.length > 0 ?

                                    <InfiniteLoader
                                        isRowLoaded={this.isRowLoaded}
                                        loadMoreRows={this.loadMoreRows}
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
                                                            overscanRowCount={30}
                                                            onRowsRendered={onRowsRendered}

                                                        />
                                                    </div>
                                                )}
                                            </AutoSizer>
                                        )}
                                    </InfiniteLoader>

                                    : this.props.data.noMore ?
                                        <Typography variant="body2">No posts found...</Typography> : <div className="post-margin"><center>
                                            <CircularProgress color="primary" /> </center></div>




                                : <div className="post-margin"><center>
                                    <CircularProgress color="primary" /> </center></div>}

                        </div>


                    </Grid>

                    <Grid className="ndgrid" item sm={3} xs={12}>
                        <div>
                            {this.props.data.userByREP ? (


                                <Paper>
                                    <div className="mostReputableUsers-header" > <Typography variant="button">Most Reputable Users</Typography> </div>
                                    <Grid container>
                                        {this.props.data.userByREP.map(user => {
                                            const { handle, imageUrl, reputation } = user;
                                            return (
                                                <div className="userByREP-singular">

                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <Avatar src={imageUrl}
                                                            component={Link}
                                                            to={
                                                                handle === this.props.user.credentials.handle
                                                                    ? `/user`
                                                                    : `/users/${handle}`
                                                            }

                                                            style={{ width: "30px", height: "30px", marginRight: "5px" }} /> <Typography style={{ textDecoration: "none", color: "#6F6F8C" }} variant="body2" component={Link}
                                                                to={
                                                                    handle === this.props.user.credentials.handle
                                                                        ? `/user`
                                                                        : `/users/${handle}`
                                                                } > {handle} </Typography>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <FireplaceIcon /> <Typography style={{ marginLeft: "7px" }} variant="body2"> {reputation} </Typography>
                                                    </div>


                                                </div>
                                            )

                                        })}
                                    </Grid>
                                </Paper>


                            ) : null}


                            <Paper style={{ marginTop: "20px" }}>

                                <div className="headerInfo" style={{ paddingBottom: "5px" }} >

                                    <div className="mostReputableUsers-header" style={{ display: "flex", flexDirection: "row", justifyContent: "center", }} >
                                        <Avatar src={"https://i.ibb.co/ZJ7QSYp/onionlogotp.png"}
                                            draggable={false}
                                            style={{ width: "30px", height: "30px" }} >
                                        </Avatar>

                                        <Typography variant="button">OnionMobile</Typography>
                                    </div>



                                    <div className="headear" style={{ marginTop: "10px", display: "flex", alignItems: "center", marginLeft: "15px", marginBottom: "10px" }}>
                                        <a href="https://play.google.com/store/apps/developer?id=Onion+Mobile">
                                            <Avatar src={"https://i.ibb.co/HF8ZqkY/google-play.png"}
                                                draggable={false}
                                                style={{ width: "15px", height: "15px", marginLeft: "5px", color: "#2E2E3A" }} >
                                            </Avatar>
                                        </a>

                                        <a className="ainfo" href="https://play.google.com/store/apps/developer?id=Onion+Mobile" style={{ textDecoration: 'none' }}>
                                            <Typography style={{ marginLeft: "7px", color: "rgb(111, 111, 140);", fontSize: "14px" }} variant="body2"> Google Play </Typography> </a>
                                    </div>



                                    <div className="headear" style={{ display: "flex", alignItems: "center", marginLeft: "15px", marginBottom: "10px" }}>

                                        <EmailIcon
                                            draggable={false}
                                            style={{ width: "15px", height: "15px", marginLeft: "5px", color: "#2E2E3A" }} />



                                        <Typography style={{ marginLeft: "7px", color: "rgb(111, 111, 140);" }} variant="body2">onionapps.info@gmail.com</Typography>
                                    </div>




                                    <div className="headear" style={{ display: "flex", alignItems: "center", marginLeft: "15px", marginBottom: "10px" }}>

                                        <SecurityIcon
                                            draggable={false}

                                            style={{ width: "15px", height: "15px", marginLeft: "5px", color: "#2E2E3A" }} />



                                        <Typography component={Link} to={"/privacyPolicy"} style={{ color: "black ", textDecoration: "none", marginLeft: "7px", }} variant="body2" >Privacy policy</Typography>
                                    </div>

                                    <div className="headear" style={{ display: "flex", alignItems: "center", marginLeft: "15px", marginBottom: "10px" }}>

                                        <GavelIcon
                                            draggable={false}

                                            style={{ width: "15px", height: "15px", marginLeft: "5px", color: "#2E2E3A" }} />



                                        <Typography component={Link} to={"/termsnConditions"} style={{ color: "black ", textDecoration: "none", marginLeft: "7px", }} variant="body2" >Terms and Conditions</Typography>
                                    </div>




                                </div>





                            </Paper>


                                            
                            <ins class="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-9541882283543234"
     data-ad-slot="5693780506"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>


                        </div>
                    </Grid>

                </Grid>

            </div>
        )
    }
}

// eslint-disable-next-line react/no-typos
home.PropTypes = {
    getPosts: PropTypes.func.isRequired,
    loadMorePosts: PropTypes.func.isRequired,
    filterPosts: PropTypes.func.isRequired,
    synchronizePosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    onEnter: PropTypes.func, // function called when waypoint enters viewport
    onLeave: PropTypes.func, // function called when waypoint leaves viewport
    getUsersByRep: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
    data: state.data,

});


export default connect(mapStateToProps, { getPosts, loadMorePosts, filterPosts, synchronizePosts, getUsersByRep })(withSnackbar(home));
