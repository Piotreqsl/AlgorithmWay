import React, { Component } from 'react'
import { connect } from 'react-redux';
import { deleteComment } from '../redux/actions/dataActions';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import IconButton from '@material-ui/core/IconButton'
import PropTypes from "prop-types";



export class delete_comment extends Component {

    handleCommentDelete = () => {
        this.props.deleteComment(this.props.comId);
        //console.log(this.props.comId);

    };

    render() {

        const { comId } = this.props;

        return (
            <IconButton onClick={this.handleCommentDelete} style={{ backgroundColor: 'transparent', padding: "0px" }}>
                <DeleteOutlineIcon className="comment-del-icon" />
            </IconButton>
        )
    }
}

delete_comment.propTypes = {
    comId: PropTypes.string.isRequired,
    deleteComment: PropTypes.func.isRequired,

}



export default connect(null, { deleteComment })(delete_comment)
