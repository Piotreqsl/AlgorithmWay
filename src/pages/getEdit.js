import React, { Component } from "react";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";

import { postPost, createEditRequest } from "../redux/actions/dataActions";

//mui
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Redirect } from 'react-router'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from '@material-ui/core/Button';

import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import LikeIcon from '@material-ui/icons/FavoriteBorder';
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import CropFreeIcon from "@material-ui/icons/CropFree";
import IconButton from "@material-ui/core/IconButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import PublishIcon from "@material-ui/icons/Publish";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Highlight from "react-highlight.js";
import DialogIMG from "../components/dialog_img";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from "@material-ui/core/Checkbox";
import axios from 'axios';
import ImageIcon from "@material-ui/icons/Image";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { withSnackbar } from "notistack";
import { approveEditRequest, rejectEditRequest } from "../redux/actions/dataActions";
import { width } from "@material-ui/system";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { getEditRequest } from "../redux/actions/dataActions";
import Avatar from "@material-ui/core/Avatar";
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
    paper: {
        padding: "25px"
    },

    head1: {
        marginBottom: "25px"
    },
    input: {
        marginBottom: "15px"
    },
    blackBox: {
        backgroundColor: "#000000",
        color: "#FFFFFF"
    },

    progress: {
        position: "absolute"
    }
});

export class getEdit extends Component {
    state = {
        body: "",
        errors: {},
        alignment: "js",
        javaCode: "",
        pythonCode: "",
        cppCode: "",
        expanded1: false,
        expanded: false,
        expanded2: false,
        categories: [],
        images: [],
        urls: [],
        formdatas: [],
        sent: false,
        currentCode: "js",
        active: false,
        imgOptions: "keep"

    };


    componentDidMount() {
        let str = this.props.location.pathname;
        let arr = str.split("/");
        let loc = arr[2];
        this.setState({ originalID: loc })
        this.props.getEditRequest(loc);



    }

    toggleClass = () => {
        var currentState = this.state.active;
        this.setState({ ...this.state, active: !currentState });
    };


    handleAlignment = event => {
        this.setState({
            alignment: event.currentTarget.value,
        });





        if (event.currentTarget.value == "js") {
            document.getElementById("codeBoxing").value = this.props.editPost.java;

            //console.log(this.state.javaCode);
        }

        if (event.currentTarget.value == "py") {
            document.getElementById("codeBoxing").value = this.props.editPost.python;

            // console.log(this.state.pythonCode);
        }

        if (event.currentTarget.value == "cpp") {
            document.getElementById("codeBoxing").value = this.props.editPost.cpp;

            // console.log(this.state.cppCode);
        }
    };

    handleAlignment1 = event => {
        if (event.currentTarget.value === "js") this.setState({ currentCode: "java" })
        if (event.currentTarget.value === "py") this.setState({ currentCode: "python" })
        if (event.currentTarget.value === "cpp") this.setState({ currentCode: "cpp" })

        console.log(this.state)
    }

 

    componentDidUpdate(prevProps) {


        /// Ustawianie domyślnyhc tych
       

        if (this.props.UI.success === "Edit request approved" || this.props.UI.success === "Edit request rejected") {
            this.props.enqueueSnackbar(this.props.UI.success, {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 5000,

            });

            this.props.history.push("/posts/" + this.props.editPost.originalPostId);
        }

        if (this.props.UI.success === "Edit request created successfully") {


            this.props.enqueueSnackbar("Edit request created successfully. Now you need to wait for post owner or admin to approve your request.", {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 7000,

            });

        
            this.props.history.push("/");

        }

    }


    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        if (nextProps.UI.errors && !nextProps.UI.loading) {

            if (nextProps.UI.errors === "Internal Server Error") {
                this.props.enqueueSnackbar("Fatal error occured", {
                    preventDuplicate: true,
                    variant: "error",
                    autoHideDuration: 3000
                });
            } else {

                this.props.enqueueSnackbar(nextProps.UI.errors, {
                    preventDuplicate: true,
                    variant: "error",
                    autoHideDuration: 3000
                });
            }
        }


        if (nextProps.UI.success === "Successfully posted" && !nextProps.UI.loading) {
            this.props.enqueueSnackbar("Successfully uploaded,  your post needs to be approved", {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 3000
            });
        }
        if (nextProps.UI.success && !nextProps.UI.loading) {



            if (!this.state.images.includes(nextProps.UI.success.url) && nextProps.UI.success !== "Git majonezizk") {
                this.setState({
                    images: [...this.state.images, nextProps.UI.success.url]
                });
            }

            //console.log(nextProps.UI.success.url);

            if (this.state.urls.length === this.state.images.length && this.state.sent === false && this.state.urls.length !== 0) {
                this.setState({
                    sent: true,
                })
                this.handlePostUpload();

            }
        }




    }


    handleApprove = () => {
        this.props.approveEditRequest(this.state.originalID)

    }

    handleReject = () => {
        this.props.rejectEditRequest(this.state.originalID);

    }


    handleExpand = () => {
        //console.log(this.state.expanded);
        if (this.state.expanded == false) {
            document.getElementById("codeBoxing").classList.add("blackBoxExpanded");
            document.getElementById("codeBoxing1").classList.add("blackBoxExpanded");
            this.setState({ expanded: true });
        }
        if (this.state.expanded == true) {
            document
                .getElementById("codeBoxing")
                .classList.remove("blackBoxExpanded");

            document
                .getElementById("codeBoxing1")
                .classList.remove("blackBoxExpanded");

            this.setState({ expanded: false });
        }
    };

    handleOpenInput = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput.click();
    };

    renderEdit = () => {

        const {
            classes,
            editPost: {
                createdAt,
                shortDesc,
                desc,
                title,
                userHandle,
                userImage,
                java,
                python,
                cpp,
                comments,
                categories,
                images
            },
            user: {
                credentials: { handle },
                authenticated
            },
            UI: { loading, processing }
        } = this.props;

        const handleChangePanel = event => {
            var ex = this.state.expanded2;
            this.setState({
                expanded2: !ex
            });
        };


        return (


            <div className="main-content-edisdat">
                {!loading ? (

                    <div>

                        <Paper className={classes.paper}><Typography className={classes.head1} variant="h4" color="primary">
                            Edited post </Typography>
                            <ExpansionPanel
                                className={classes.expansion}
                                expanded={this.state.expanded2}
                                onChange={handleChangePanel}
                            >
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography color="primary" style={{ fontSize: "1.7rem" }}>
                                        {title}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography className={classes.marginUni} variant="body1">
                                        {shortDesc}
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <div className="prev-userhandle">
                                <div className="prev-avNhandle">
                                    <Avatar src={userImage} style={{ width: "30px", height: "30px" }} component={Link}
                                        to={
                                            !loading
                                                ? this.props.user.credentials.handle === this.props.post.userHandle
                                                    ? `/user`
                                                    : `/users/${userHandle}`
                                                : null
                                        } />
                                    <Typography style={{ marginLeft: "5px" }}
                                        component={Link}
                                        to={
                                            !loading
                                                ? this.props.user.credentials.handle === this.props.post.userHandle
                                                    ? `/user`
                                                    : `/users/${userHandle}`
                                                : null
                                        }
                                        variant="caption"
                                    >
                                        {userHandle}

                                    </Typography>
                                </div>

                                <div>


                                </div>



                                <Tooltip
                                    placement="left"
                                    title={dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                                >
                                    <Typography
                                        style={{ float: "right" }}
                                        variant="caption"
                                    >
                                        {dayjs(createdAt).fromNow()}
                                    </Typography>
                                </Tooltip>

                            </div>



                            <div style={{ clear: "both" }}></div>

                            <Typography
                                style={{ marginTop: "15px", marginBottom: "25px" }}
                                variant="body2"
                            >
                                {desc}
                            </Typography>

                            {this.props.editPost.java ||
                                this.props.editPost.cpp ||
                                this.props.editPost.python ? (
                                    <div>
                                        <Grid container spacing={1}>
                                            <Grid item sm={12} md={12}>
                                                <div className="codeBoxNav">
                                                    <ToggleButtonGroup
                                                        value={this.state.alignment}
                                                        exclusive
                                                        onChange={this.handleAlignment}
                                                    >
                                                        {this.props.editPost.java ? (
                                                            <ToggleButton id="langBTN" value="java">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/java_logo.png?alt=media&token=03067a8a-721b-4f69-ad32-ef2df63a9584"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}

                                                        {this.props.editPost.python ? (
                                                            <ToggleButton id="langBTN" value="py">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/python_logo.png?alt=media&token=7e7010bb-fa65-445d-be7a-7a429c703d2c"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}

                                                        {this.props.editPost.cpp ? (
                                                            <ToggleButton id="langBTN" value="cpp">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/cpp_logo.png?alt=media&token=8389d1bd-c9f0-4542-a274-1a33d9922e6f"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}
                                                    </ToggleButtonGroup>
                                                    <IconButton
                                                        onClick={this.handleExpand}
                                                        className="codeBoxingCrop"
                                                    >
                                                        <CropFreeIcon />
                                                    </IconButton>
                                                    <div style={{ clear: "both" }}></div>
                                                </div>
                                            </Grid>
                                        </Grid>

                                        <div id="codeBoxing" className="codeInputs">
                                            {this.state.alignment === "js" ? (
                                                <Highlight language={"java"}>
                                                    {`
      |===============================================|
      |                                               |
      |   /* Choose desired programming language */   |
      |                                               |
      |===============================================| `}
                                                </Highlight>
                                            ) : null}

                                            {this.props.editPost.java && this.state.alignment === "java" ? (
                                                <Highlight language={"java"}>
                                                    {this.props.editPost.java}
                                                </Highlight>
                                            ) : null}

                                            {this.props.editPost.python &&
                                                this.state.alignment === "py" ? (
                                                    <Highlight language={"python"}>
                                                        {this.props.editPost.python}
                                                    </Highlight>
                                                ) : null}

                                            {this.props.editPost.cpp && this.state.alignment === "cpp" ? (
                                                <Highlight language={"c++"}>
                                                    {this.props.editPost.cpp}
                                                </Highlight>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                            {(!this.props.UI.loading && this.props.UI.success !== null ? (
                                this.props.editPost.images
                            ) : null) ? (
                                    <div className="DialogIMG-flexContainer">
                                        {(() => {
                                            const arr =
                                                !this.props.UI.loading && this.props.UI.success !== null
                                                    ? this.props.editPost.images
                                                    : null;



                                            const imgs = [];

                                            if (arr) {
                                                for (
                                                    let i = 0;
                                                    i <
                                                    (!this.props.UI.loading && this.props.UI.success !== null
                                                        ? this.props.editPost.images.length
                                                        : null);
                                                    i++
                                                ) {
                                                    imgs.push(
                                                        <DialogIMG
                                                            value={
                                                                !this.props.UI.loading &&
                                                                    this.props.UI.success !== null
                                                                    ? this.props.editPost.images[i]
                                                                    : null
                                                            }
                                                        />
                                                    );
                                                }
                                            }
                                            return imgs;
                                        })()}
                                    </div>
                                ) : null}

                        </Paper>


                        <Tooltip placement="top" title="Approve">
                    <IconButton
                        onClick={this.handleApprove}
                        type="submit"
                        style={{
                            backgroundColor: "#ebebeb",
                            float: "right",
                            marginTop: "5px",
                            marginLeft: "10px"
                        }}
                        disabled={processing}
                    >
                        <CheckIcon color="primary" />
                        {processing && (
                            <CircularProgress size={50} style={{ position: "absolute" }} />
                        )}
                    </IconButton>
                </Tooltip>


                <Tooltip placement="top" title="Reject">
                    <IconButton
                        onClick={this.handleReject}
                        type="submit"
                        style={{
                            backgroundColor: "#ebebeb",
                            float: "right",
                            marginTop: "5px",
                            marginLeft: "10px"
                        }}
                        disabled={processing}
                    >
                        <CloseIcon color="primary" />
                        {processing && (
                            <CircularProgress size={50} style={{ position: "absolute" }} />
                        )}
                    </IconButton>
                </Tooltip>
                <div style={{ clear: "both" }}></div>


                    </div>

                ) : (
                        <CircularProgress color="primary" />
                    )}
            </div>
        );
    }

    renderPost = () => {
        const {
            classes,
            post: {
                postId,
                createdAt,
                shortDesc,
                desc,
                title,
                userHandle,
                userImage,
                commentCount,
                likeCount,
                java,
                python,
                cpp,
                comments,
                categories,
                images
            },
            user: {
                credentials: { handle },
                authenticated
            },
            UI: { loading }
        } = this.props;

        const handleChangePanel = event => {
            var ex = this.state.expanded1;
            this.setState({
                expanded1: !ex
            });
        };


        dayjs.extend(relativeTime);

        return (


            <div className="main-content-edisdat">
                {!loading ? (

                    <div>

                        <Paper className={classes.paper}><Typography className={classes.head1} variant="h4" color="primary">
                            Original post </Typography>
                            <ExpansionPanel
                                className={classes.expansion}
                                expanded={this.state.expanded1}
                                onChange={handleChangePanel}
                            >
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography color="primary" style={{ fontSize: "1.7rem" }}>
                                        {title}
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography className={classes.marginUni} variant="body1">
                                        {shortDesc}
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <div className="prev-userhandle">
                                <div className="prev-avNhandle">
                                    <Avatar src={userImage} style={{ width: "30px", height: "30px" }} component={Link}
                                        to={
                                            !loading
                                                ? this.props.user.credentials.handle === this.props.post.userHandle
                                                    ? `/user`
                                                    : `/users/${userHandle}`
                                                : null
                                        } />
                                    <Typography style={{ marginLeft: "5px" }}
                                        component={Link}
                                        to={
                                            !loading
                                                ? this.props.user.credentials.handle === this.props.post.userHandle
                                                    ? `/user`
                                                    : `/users/${userHandle}`
                                                : null
                                        }
                                        variant="caption"
                                    >
                                        {userHandle}

                                    </Typography>
                                </div>

                                <div>


                                </div>



                                <Tooltip
                                    placement="left"
                                    title={dayjs(createdAt).format("YYYY.MM.DD HH:mm")}
                                >
                                    <Typography
                                        style={{ float: "right" }}
                                        variant="caption"
                                    >
                                        {dayjs(createdAt).fromNow()}
                                    </Typography>
                                </Tooltip>

                            </div>



                            <div style={{ clear: "both" }}></div>

                            <Typography
                                style={{ marginTop: "15px", marginBottom: "25px" }}
                                variant="body2"
                            >
                                {desc}
                            </Typography>

                            {this.props.post.java ||
                                this.props.post.cpp ||
                                this.props.post.python ? (
                                    <div>
                                        <Grid container spacing={1}>
                                            <Grid item sm={12} md={12}>
                                                <div className="codeBoxNav">
                                                    <ToggleButtonGroup
                                                        value={this.state.currentCode}
                                                        exclusive
                                                        onChange={this.handleAlignment1}
                                                    >
                                                        {this.props.post.java ? (
                                                            <ToggleButton id="langBTN" value="js">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/java_logo.png?alt=media&token=03067a8a-721b-4f69-ad32-ef2df63a9584"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}

                                                        {this.props.post.python ? (
                                                            <ToggleButton id="langBTN" value="py">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/python_logo.png?alt=media&token=7e7010bb-fa65-445d-be7a-7a429c703d2c"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}

                                                        {this.props.post.cpp ? (
                                                            <ToggleButton id="langBTN" value="cpp">
                                                                <img
                                                                    draggable="false"
                                                                    src="https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/cpp_logo.png?alt=media&token=8389d1bd-c9f0-4542-a274-1a33d9922e6f"
                                                                    height="24px"
                                                                />
                                                            </ToggleButton>
                                                        ) : null}
                                                    </ToggleButtonGroup>
                                                    <IconButton
                                                        onClick={this.handleExpand}
                                                        className="codeBoxingCrop"
                                                    >
                                                        <CropFreeIcon />
                                                    </IconButton>
                                                    <div style={{ clear: "both" }}></div>
                                                </div>
                                            </Grid>
                                        </Grid>

                                        <div id="codeBoxing1" className="codeInputs">
                                            {this.state.currentCode === "js" ? (
                                                <Highlight language={"java"}>
                                                    {`
      |===============================================|
      |                                               |
      |   /* Choose desired programming language */   |
      |                                               |
      |===============================================| `}
                                                </Highlight>
                                            ) : null}

                                            {this.props.post.java && this.state.currentCode === "java" ? (
                                                <Highlight language={"java"}>
                                                    {this.props.post.java}
                                                </Highlight>
                                            ) : null}

                                            {this.props.post.python &&
                                                this.state.currentCode === "python" ? (
                                                    <Highlight language={"python"}>
                                                        {this.props.post.python}
                                                    </Highlight>
                                                ) : null}

                                            {this.props.post.cpp && this.state.currentCode === "cpp" ? (
                                                <Highlight language={"c++"}>
                                                    {this.props.post.cpp}
                                                </Highlight>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}

                            {(!this.props.UI.loading && this.props.UI.success !== null ? (
                                this.props.post.images
                            ) : null) ? (
                                    <div className="DialogIMG-flexContainer">
                                        {(() => {
                                            const arr =
                                                !this.props.UI.loading && this.props.UI.success !== null
                                                    ? this.props.post.images
                                                    : null;



                                            const imgs = [];

                                            if (arr) {
                                                for (
                                                    let i = 0;
                                                    i <
                                                    (!this.props.UI.loading && this.props.UI.success !== null
                                                        ? this.props.post.images.length
                                                        : null);
                                                    i++
                                                ) {
                                                    imgs.push(
                                                        <DialogIMG
                                                            value={
                                                                !this.props.UI.loading &&
                                                                    this.props.UI.success !== null
                                                                    ? this.props.post.images[i]
                                                                    : null
                                                            }
                                                        />
                                                    );
                                                }
                                            }
                                            return imgs;
                                        })()}
                                    </div>
                                ) : null}
                        </Paper>


                    </div>

                ) : (
                        <CircularProgress color="primary" />
                    )}
            </div>
        );




    }



    render() {
        const { errors } = this.state;
        const {
            classes,
            UI: { loading, processing }
        } = this.props;

        dayjs.extend(relativeTime);
        return (


            <div className="main-content-edit">
                {!loading && !this.props.user.loading ? (this.props.UI.errors === "Original post not found" || this.props.UI.errors === "Edit request not found" || this.props.UI.errors === "You cant view this edit request" ? (<p>{this.props.UI.errors}</p>) : (this.props.user.authenticated ? (this.props.user.credentials.isEmailVerified ?
                    /// Tutaj po sprawdzeniu można se renderować
                    (
                        <div>
                        <Grid container spacing={3}>
                            <Grid item xs>{this.renderPost()}</Grid>
                            <Grid item xs>{this.renderEdit()}</Grid>
                        </Grid>
           
</div>

       

                    )
                    : <p>Please verify your email</p>) : <Redirect to="/login" />)) : (<div className="post-margin"><center>
                        <CircularProgress color="primary" /> </center></div>)}
            </div>
        );
    }
}

getEdit.propTypes = {
    rejectEditRequest: PropTypes.func.isRequired,
    getEdit: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    editPost: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    approveEditRequest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    UI: state.UI,
    post: state.data.post,
    user: state.user,
    editPost: state.data.editPost
});

export default connect(mapStateToProps, { postPost, approveEditRequest, getEditRequest, rejectEditRequest })(
    withStyles(styles)(withSnackbar(getEdit))
);
