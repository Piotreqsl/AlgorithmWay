import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';


import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { LinearProgress } from '@material-ui/core';
import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

import {
    List, AutoSizer, CellMeasurerCache,
    CellMeasurer, InfiniteLoader
} from "react-virtualized";
import 'react-virtualized/styles.css'; // only needs to be imported once

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

import Tooltip from '@material-ui/core/Tooltip';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


import { Waypoint } from 'react-waypoint';
import { getPosts, loadMorePosts, filterPosts, synchronizePosts } from '../redux/actions/dataActions'

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
            graphs: true,
            AI: true,
            DS: true
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



    loadMorePosts = () => {


        if (!this.props.data.noMore) this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly)

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
        }



        //
        if (this.list) {
            this.list.forceUpdateGrid();
            this.list.recomputeRowHeights()
        }








        if ((prevProps.data.backupdata !== this.props.data.backupdata && this.props.data.posts.length <= 5 && !this.props.data.noMore && !this.props.noMore) || (prevProps.data.backupdata !== this.props.data.backupdata && this.props.data.posts === prevProps.data.posts && !this.props.data.noMore && !this.props.noMore)) {

            console.log("udpejt");
            this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly);
        }



    }





    componentDidMount() {
        this.props.getPosts();
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



        var approvedOnly = false;
        if (this.state.all) approvedOnly = false;
        if (this.state.appr) approvedOnly = true;

        this.setState({
            approvedOnly: approvedOnly
        })


        /// Filtry na kategorie
        let arrayFilters = [];
        if (this.state.categories.char && this.state.categories.string && this.state.categories.int && this.state.categories.array && this.state.categories.DS && this.state.categories.AI && this.state.categories.crypt && this.state.categories.graphs) {

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

            if (this.state.categories.graphs) {
                arrayFilters.push('graphs');
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




        this.setState({
            approvedOnly: approvedOnly,
            codeFilters: codeFilters,
            categoryFilters: arrayFilters

        }, () => this.props.filterPosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly))




    }

    bindListRef = ref => {
        this.list = ref;
    };


    isRowLoaded = ({ index }) => {
        return !!this.props.data.posts[index];
    }

    loadMoreRows = ({ startIndex, stopIndex }) => {

        console.log("łejpojnt " + startIndex + stopIndex);
        if (!this.props.UI.processing && !this.props.data.noMore) this.props.loadMorePosts(this.state.categoryFilters, this.state.codeFilters, this.state.approvedOnly)
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
        const { loading } = this.props.data;

        return (


            <div className="main-content" >
                <Grid container spacing={16}>


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
                                                <Checkbox checked={this.state.categories.graphs} onChange={this.handleChange('graphs')} value="graphs" />
                                            }
                                            label="Graphs"
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
                                        <FormControlLabel value="all" control={<Radio checked={this.state.all ? true : false} onChange={this.handleChangeGlobal("all")} />} label="All" />
                                        <FormControlLabel value="appr" control={<Radio checked={this.state.appr ? true : false} onChange={this.handleChangeGlobal("appr")} />} label="Approved" />
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



                            {(!loading && this.props.data.posts.length > 0) ?

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
                                                        overscanRowCount={3}
                                                        onRowsRendered={onRowsRendered}

                                                    />
                                                </div>
                                            )}
                                        </AutoSizer>
                                    )}
                                </InfiniteLoader>





                                : <div className="post-margin"><center>
                                    <CircularProgress color="primary" /> </center></div>}

                        </div>


                    </Grid>

                    <Grid className="ndgrid" item sm={3} xs={12}>
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
    loadMorePosts: PropTypes.func.isRequired,
    filterPosts: PropTypes.func.isRequired,
    synchronizePosts: PropTypes.func.isRequired,
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


export default connect(mapStateToProps, { getPosts, loadMorePosts, filterPosts, synchronizePosts })(withSnackbar(home));
