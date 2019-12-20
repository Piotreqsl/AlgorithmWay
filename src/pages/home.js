import React, { Component } from 'react'

import Grid from '@material-ui/core/Grid';
import axios from 'axios';

import Post from '../components/post';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import { withSnackbar } from 'notistack';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

import { getPosts } from '../redux/actions/dataActions'

export class home extends Component {
    state = {
        data: [],
        active: false,
        categories: {
            string: true,
            int: true,
            array: true,
            char: true,
        },
        offset: 0,

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

    toggleClass = () => {
        var currentState = this.state.active;
        this.setState({ ...this.state, active: !currentState });
        console.log(this.state)

    };

    handleChange = name => event => {
        this.setState({ categories: { ...this.state.categories, [name]: event.target.checked } });
    };

    handleSubmitFilters = (event) => {
        event.preventDefault();
        console.log("submitted");
        this.toggleClass();
        /// tu filtrować 

    }


    render() {
        const { posts, loading } = this.props.data;

        let recentPostsMarkup = !loading ? (
            posts.map((post) => <Post key={post.postId} post={post} />)
        ) : (<div><center>
            <CircularProgress color="primary" /></center></div>);

        return (


            <div className="main-content">
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


export default connect(mapStateToProps, { getPosts })(withSnackbar(home));
