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
import { uploadPostImage, uploadPostImageEdit } from "../redux/actions/dataActions";
import { width } from "@material-ui/system";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { getPost } from "../redux/actions/dataActions";
import Avatar from "@material-ui/core/Avatar";


const styles = theme => ({
    paper: {
        padding: "20px"
    },

expansion:{
margin: "-20px"
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

export class edit extends Component {
    state = {
        body: "",
        errors: {},
        alignment: "js",
        javaCode: "",
        pythonCode: "",
        cppCode: "",
        expanded1: false,
        expanded: false,
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
        this.props.getPost(loc);



    }

    toggleClass = () => {
        var currentState = this.state.active;
        this.setState({ ...this.state, active: !currentState });
    };

    handleImageDelete = event => {
       

        var arrForms = [...this.state.formdatas];
        var arrUrls = [...this.state.urls];
        var index = arrUrls.indexOf(event.currentTarget.parentElement.parentElement.querySelector('img').src);
        if (index !== -1) {
            arrForms.splice(index, 1);
            arrUrls.splice(index, 1);
            this.setState({ urls: arrUrls });
            this.setState({ formdatas: arrForms });
        
        }


    }

    handleImageUpload = event => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append("image", image, image.name);



        const isType = image.type;
        if (
            isType === "image/png" ||
            isType === "image/jpg" ||
            isType === "image/jpeg" ||
            isType === "image/bmp"
        ) {
            if (image.size < 5000000) {


                this.setState({
                    formdatas: [...this.state.formdatas, { formData }]
                });
               
                const objUrl = window.URL.createObjectURL(image);
                this.setState({
                    urls: [...this.state.urls, objUrl],
                })


                // this.props.uploadPostImage(formData);
            } else {
                this.props.enqueueSnackbar(`Selected file is too big (Max. 5MB)`, {
                    preventDuplicate: true,
                    variant: "error",
                    autoHideDuration: 5000
                });
            }
        } else {
            this.props.enqueueSnackbar(`Invalid file type`, {
                preventDuplicate: true,
                variant: "error",
                autoHideDuration: 3000
            });
        }
    };

    handleAlignment = event => {
        this.setState({
            alignment: event.currentTarget.value,

        });


  



        if (event.currentTarget.value == "js") {
            document.getElementById("codeBoxing").value = this.state.javaCode;

       
        }

        if (event.currentTarget.value == "py") {
            document.getElementById("codeBoxing").value = this.state.pythonCode;

            
        }

        if (event.currentTarget.value == "cpp") {
            document.getElementById("codeBoxing").value = this.state.cppCode;

        
        }
    };

    handleAlignment1 = event => {
        if (event.currentTarget.value === "js") this.setState({ currentCode: "java" })
        if (event.currentTarget.value === "py") this.setState({ currentCode: "python" })
        if (event.currentTarget.value === "cpp") this.setState({ currentCode: "cpp" })

       
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });

        event.target.parentElement.parentElement.querySelector("p").innerHTML =
            event.target.value.toString().length + "/" + event.target.maxLength;
    };

    handleFormChange = name => event => {
        if (event.target.checked == true) {
            this.setState({
                categories: [...this.state.categories, event.target.value]
            });
        }


        if (
            event.target.checked == false &&
            this.state.categories.includes(event.target.value)
        ) {
        
            var arr = [...this.state.categories];
            var index = arr.indexOf(event.target.value);
            if (index !== -1) {
                arr.splice(index, 1);
                this.setState({ categories: arr });
            }
        }

    };


    componentDidUpdate(prevProps) {


        /// Ustawianie domyślnyhc tych
        if (this.props.post !== null && this.props.post !== undefined && prevProps.post !== this.props.post) {
            this.setState({
                title: this.props.post.title,
                shortDesc: this.props.post.shortDesc,
                desc: this.props.post.desc
            })

            if (this.props.post.java) {
                this.setState({ javaCode: this.props.post.java })
            }
            if (this.props.post.python) {
                this.setState({ pythonCode: this.props.post.python })
            }
            if (this.props.post.cpp) {
                this.setState({ cppCode: this.props.post.cpp })
            }

        

            this.setState({ images: this.props.post.images })






            this.setState({
                categories: this.props.post.categories
            })
        }

        if (this.props.UI.success === "Edited immediately by owner" || this.props.UI.success === "Edited immediately by admin") {
            this.props.enqueueSnackbar(this.props.UI.success, {
                preventDuplicate: true,
                variant: "success",
                autoHideDuration: 5000,

            });

            this.props.history.push("/posts/" + this.state.originalID);
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

          

            if (this.state.urls.length === this.state.images.length && this.state.sent === false && this.state.urls.length !== 0) {
                this.setState({
                    sent: true,
                })
                this.handlePostUpload();

            }
        }




    }


    handleSubmit = event => {
        event.preventDefault();




        if (this.state.formdatas.length === 0 && document.getElementById("postTitle").value.length !== 0 && document.getElementById("shortDesc").value.length !== 0) {
            this.handlePostUpload();
        } else {


            if (document.getElementById("postTitle").value.length !== 0 && document.getElementById("shortDesc").value.length !== 0 && this.state.imgOptions === "new") {

                const arr = this.state.formdatas;
                for (let i = 0; i < arr.length; i++) {
                    const formData = this.state.formdatas[i].formData;
                    this.props.uploadPostImageEdit(formData);
                    
                }
            }


            else if ((this.state.imgOptions === "keep" || this.state.imgOptions === "empty") && document.getElementById("postTitle").value.length !== 0 && document.getElementById("shortDesc").value.length !== 0) this.handlePostUpload();


            else {
                this.props.enqueueSnackbar(`"Title" and "Short description" cannot be empty`, {
                    preventDuplicate: true,
                    variant: "error",
                    autoHideDuration: 2000
                });
            }

        }



    };

    handlePostUpload = () => {


        const postStruct = {
            title: this.state.title,
            shortDesc: this.state.shortDesc,
            desc: this.state.desc,
            java: this.state.javaCode,
            python: this.state.pythonCode,
            cpp: this.state.cppCode,
            originalPostId: this.state.originalID,
            categories: this.state.categories,
        };

        if (this.state.images !== undefined) postStruct.images = this.state.images




        this.props.createEditRequest(postStruct, this.props.history);


    }

    handleCodeChange = event => {



        if (this.state.alignment == "js") {
            this.setState({ javaCode: event.target.value });
        }

        if (this.state.alignment == "py") {
            this.setState({ pythonCode: event.target.value });
        }

        if (this.state.alignment == "cpp") {
            this.setState({ cppCode: event.target.value });
        }
    };

    handleExpand = () => {
     
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

        const { errors } = this.state;
        const {
            classes,
            UI: { loading, processing }
        } = this.props;


        const handleRadioChange = (event) => {
          
            this.setState({
                imgOptions: event.target.value
            })
            if (event.target.value === "new") {
                this.setState({ active: true, images: [] })
            }
            else if (event.target.value === "empty") this.setState({ active: false, images: [] })
            else if (event.target.value === "keep") this.setState({ active: false, images: this.props.post.images })


        }


        return (
            <div>
                <Typography className={classes.head1} variant="h4" color="primary">
                    Edit post
            </Typography>
            <Paper className={classes.paper}>
                

                <TextField
                    name="title"
                    type="text"
                    label="Post title*"
                    variant="outlined"
                    error={errors.body ? true : false}
                    fullWidth
                    helperText="0/50"
                    onChange={this.handleChange}
                    inputProps={{ maxLength: 50 }}
                    className={classes.input}
                    id="postTitle"
                    defaultValue={this.props.post !== null && this.props.post !== undefined ? this.props.post.title : null}
                />

                <TextField
                    name="shortDesc"
                    type="text"
                    label="Short description*"
                    variant="outlined"
                    error={errors.body ? true : false}
                    fullWidth
                    helperText="0/250"
                    onChange={this.handleChange}
                    inputProps={{ maxLength: 250 }}
                    className={classes.input}
                    multiline="true"
                    rows="3"
                    id="shortDesc"
                    defaultValue={this.props.post !== null && this.props.post !== undefined ? this.props.post.shortDesc : null}
                />
                <TextField
                    name="desc"
                    type="text"
                    label="Description"
                    variant="outlined"
                    error={errors.body ? true : false}
                    fullWidth
                    helperText="0/750"
                    onChange={this.handleChange}
                    inputProps={{ maxLength: 750 }}
                    className={classes.input}
                    multiline="true"
                    rows="7"
                    id="desc"
                    defaultValue={this.props.post !== null && this.props.post !== undefined ? this.props.post.desc : null}
                />
                <div>
                    <div> Categories: </div>
                    <FormGroup
                        className="formGroup"
                        column
                        style={{ marginLeft: 10, marginTop: 5 }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.includes("string")}
                                    onChange={this.handleFormChange("string")}
                                    value="string"
                                />
                            }
                            label="Strings"
                            style={{ paddingLeft: 10 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.includes("int")}
                                    onChange={this.handleFormChange("int")}
                                    value="int"
                                />
                            }
                            label="Integers"
                            style={{ paddingLeft: 10 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.includes("array")}
                                    onChange={this.handleFormChange("array")}
                                    value="array"
                                />
                            }
                            label="Arrays"
                            style={{ paddingLeft: 10 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.includes("char")}
                                    onChange={this.handleFormChange("char")}
                                    value="char"
                                />
                            }
                            label="Characters"
                            style={{ paddingLeft: 10 }}
                        />
                    </FormGroup>

                    <FormGroup
                        className="formGroup"
                        column
                        style={{ marginLeft: 10, marginTop: 5 }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.crypt}
                                    onChange={this.handleFormChange("crypt")}
                                    value="crpyt"
                                />
                            }
                            label="Cryptography"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.graphs}
                                    onChange={this.handleFormChange("graphs")}
                                    value="graphs"
                                />
                            }
                            label="Graphs"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.AI}
                                    onChange={this.handleFormChange("AI")}
                                    value="AI"
                                />
                            }
                            label="Artificial Intelligence"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.categories.DS}
                                    onChange={this.handleFormChange("DS")}
                                    value="DS"
                                />
                            }
                            label="Data Structures"
                        />
                    </FormGroup>
                </div>

                <Grid container spacing={1}>
                    <Grid item sm={12} md={12}>
                        <div className="codeBoxNav">
                            <ToggleButtonGroup
                                value={this.state.alignment}
                                exclusive
                                onChange={this.handleAlignment}
                            >
                                <ToggleButton value="js">
                                    <img
                                        draggable="false"
                                        src={"/java_logo.png"}
                                        height="24px"
                                    />
                                </ToggleButton>
                                <ToggleButton value="py">
                                    <img
                                        draggable="false"
                                        src={"/python_logo.png"}
                                        height="24px"
                                    />
                                </ToggleButton>
                                <ToggleButton value="cpp">
                                    <img
                                        draggable="false"
                                        src={"/cpp_logo.png"}
                                        height="24px"
                                    />
                                </ToggleButton>
                            </ToggleButtonGroup>
                            <IconButton
                                onClick={this.handleExpand}
                                className="codeBoxingCrop"
                            >
                                <CropFreeIcon />
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>

                <div>
                    <textarea
                        id="codeBoxing"
                        onChange={this.handleCodeChange}
                        type="text"
                        className="blackBox"
                        spellcheck="false"
                        defaultValue={this.state.alignment === "js" ? (

                            `
|===============================================|
|                                               |
|   /* Choose desired programming language */   |
|                                               |
|===============================================| `

                        ) : null}

                    >

                    </textarea>
                </div>

                <Typography> Image options </Typography>

                <RadioGroup aria-label="Image options" onChange={handleRadioChange}>

                    {this.props.post.images.length > 0 ? <FormControlLabel
                        value="keep"
                        control={<Radio color="primary" />}
                        label="Keep exsisting images"
                        checked={this.state.imgOptions === "keep"}
                    /> : null}

                    <FormControlLabel
                        value="new"
                        control={<Radio color="primary" />}
                        label="Upload new images"
                        checked={this.state.imgOptions === "new"}

                    />
                    <FormControlLabel
                        value="empty"
                        control={<Radio color="primary" />}
                        label="Leave empty"
                        checked={this.state.imgOptions === "empty"}
                    />
                </RadioGroup>




                <div className={this.state.active ? "imageUploadBoxEdit isOpenEdit" : "imageUploadBoxEdit"} >
                    {
                        this.state.urls.length !== 0 ? (

                            <div id="imagesHolder" className="imagesHolder">



                                <div className="imagesUploadPreview">
                                    <div className="containerIU">
                                        <img src={this.state.urls[0]} />
                                        <div className="overlayIU">
                                            <IconButton
                                                onClick={this.handleImageDelete}
                                                className="iconIU"
                                                style={{ backgroundColor: "transparent" }}
                                            >
                                                <HighlightOffIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>

                                {this.state.urls.length >= 2 ? (<div className="imagesUploadPreview">
                                    <div className="containerIU">
                                        <img src={this.state.urls[1]} />
                                        <div className="overlayIU">
                                            <IconButton
                                                onClick={this.handleImageDelete}
                                                className="iconIU"
                                                style={{ backgroundColor: "transparent" }}
                                            >
                                                <HighlightOffIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>) : null}

                                {this.state.urls.length >= 3 ? (<div className="imagesUploadPreview">
                                    <div className="containerIU">
                                        <img src={this.state.urls[2]} />
                                        <div className="overlayIU">
                                            <IconButton
                                                onClick={this.handleImageDelete}
                                                className="iconIU"
                                                style={{ backgroundColor: "transparent" }}
                                            >
                                                <HighlightOffIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>) : null}

                                {this.state.urls.length >= 4 ? (<div className="imagesUploadPreview">
                                    <div className="containerIU">
                                        <img src={this.state.urls[3]} />
                                        <div className="overlayIU">
                                            <IconButton
                                                onClick={this.handleImageDelete}
                                                className="iconIU"
                                                style={{ backgroundColor: "transparent" }}
                                            >
                                                <HighlightOffIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>) : null}



                                {this.state.urls.length < 4 ? (

                                    <div className="additionalIconDiv" >
                                        <IconButton onClick={this.handleOpenInput}>
                                            <AddCircleOutlineIcon fontSize="large" />
                                        </IconButton>
                                        <input
                                            type="file"
                                            id="imageInput"
                                            hidden="hidden"
                                            onChange={this.handleImageUpload}
                                        />
                                    </div>

                                ) : null}



                            </div>
                        ) : (
                                <div className="imageUploadBtn">
                                    <IconButton onClick={this.handleOpenInput}>
                                        <ImageIcon fontSize="large" />
                                    </IconButton>
                                    <input
                                        type="file"
                                        id="imageInput"
                                        hidden="hidden"
                                        onChange={this.handleImageUpload}
                                    />{" "}
                                    <br></br>
                                    <Typography variant="button">Upload up to 4 images</Typography>
                                </div>
                            )
                    }
                </div>

                <Tooltip placement="left" title="Upload">
                    <IconButton
                        onClick={this.handleSubmit}
                        type="submit"
                        style={{
                            backgroundColor: "#ebebeb",
                            float: "right",
                            marginTop: "5px"
                        }}
                        disabled={processing}
                    >
                        <PublishIcon color="primary" />
                        {processing && (
                            <CircularProgress size={50} style={{ position: "absolute" }} />
                        )}
                    </IconButton>
                </Tooltip>
                <div style={{ clear: "both" }}></div>

            </Paper>
            </div>
        )
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
<Typography className={classes.head1} variant="h4" color="primary">
                            Original post </Typography>
                        <Paper className={classes.paper}>
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
                {!loading && !this.props.user.loading ? (this.props.UI.errors === "Post not found" ? (<p>Post not found</p>) : (this.props.user.authenticated ? (this.props.user.credentials.isEmailVerified ?
                    /// Tutaj po sprawdzeniu można se renderować
                    (
                        <Grid container spacing={3}>
                            <Grid item xs>{this.renderPost()}</Grid>
                            <Grid item xs>{this.renderEdit()}</Grid>
                        </Grid>

                    )
                    : <p>Please verify your email</p>) : <Redirect to="/login" />)) : (<div className="post-margin"><center>
                        <CircularProgress color="primary" /> </center></div>)}
            </div>
        );
    }
}

edit.propTypes = {
    createEditRequest: PropTypes.func.isRequired,
    getPost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    uploadPostImageEdit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    UI: state.UI,
    post: state.data.post,
    user: state.user
});

export default connect(mapStateToProps, { postPost, uploadPostImageEdit, getPost, createEditRequest })(
    withStyles(styles)(withSnackbar(edit))
);
