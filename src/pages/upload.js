import React, { Component } from 'react'
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";

import {postPost} from '../redux/actions/dataActions'


export class upload extends Component {
    state = {
        body: '',
        errors: {},
    };
    
    render() {

            const { errors } = this.state;
            const {classes, UI: {loading}} = this.props;
            


        return (
            <div className="main-content-squeezed">

            </div>
        )
    }
}

upload.propTypes = {
    postPost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
    UI: state.UI,
});

export default connect((mapStateToProps, {postPost}))(withStyles(upload));
