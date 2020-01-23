import React, { Component } from "react";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";

import { postPost } from "../redux/actions/dataActions";
import ReCAPTCHA from "react-google-recaptcha";
//mui
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import Grid from "@material-ui/core/Grid";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import CropFreeIcon from "@material-ui/icons/CropFree";
import IconButton from "@material-ui/core/IconButton";

import PublishIcon from "@material-ui/icons/Publish";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from 'axios';
import ImageIcon from "@material-ui/icons/Image";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { withSnackbar } from "notistack";
import { uploadPostImage } from "../redux/actions/dataActions";
import { width } from "@material-ui/system";
import $ from "jquery";

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

export class upload extends Component {
  state = {
    body: "",
    errors: {},
    alignment: "js",
    javaCode: "",
    pythonCode: "",
    cppCode: "",
    expanded: false,
    categories: [],
    images: [],
    urls: [],
    formdatas: [],
    sent: false,
    reCaptched: false,

  };


  handleImageDelete = event => {
    //console.log(event.currentTarget.parentElement.parentElement.querySelector('img').src);

    var arrForms = [...this.state.formdatas];
    var arrUrls = [...this.state.urls];
    var index = arrUrls.indexOf(event.currentTarget.parentElement.parentElement.querySelector('img').src);
    if (index !== -1) {
      arrForms.splice(index, 1);
      arrUrls.splice(index, 1);
      this.setState({ urls: arrUrls });
      this.setState({ formdatas: arrForms });
      //console.log(this.state.urls);console.log(this.state.formdatas);
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


        // console.log(formData);
        this.setState({
          formdatas: [...this.state.formdatas, { formData }]
        });
        // console.log(this.state.formdatas);

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
    this.setState({ alignment: event.currentTarget.value });

    if (event.currentTarget.value == "js") {
      document.getElementById("codeBoxing").value = this.state.javaCode;
      //console.log(this.state.javaCode);
    }

    if (event.currentTarget.value == "py") {
      document.getElementById("codeBoxing").value = this.state.pythonCode;
      // console.log(this.state.pythonCode);
    }

    if (event.currentTarget.value == "cpp") {
      document.getElementById("codeBoxing").value = this.state.cppCode;
      // console.log(this.state.cppCode);
    }
  };

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
      //console.log("need to delete " + event.target.value);
      var arr = [...this.state.categories];
      var index = arr.indexOf(event.target.value);
      if (index !== -1) {
        arr.splice(index, 1);
        this.setState({ categories: arr });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps);
    if (nextProps.UI.errors && !nextProps.UI.loading) {
      // console.log(nextProps.UI.errors);
      this.props.enqueueSnackbar("Fatal error occurred", {
        preventDuplicate: true,
        variant: "error",
        autoHideDuration: 3000
      });
    }


    if (nextProps.UI.success === "Successfully posted" && !nextProps.UI.loading) {
      this.props.enqueueSnackbar("Successfully uploaded,  your post needs to be approved", {
        preventDuplicate: true,
        variant: "success",
        autoHideDuration: 3000
      });
    }
    if (nextProps.UI.success && !nextProps.UI.loading) {


      if (!this.state.images.includes(nextProps.UI.success.url)) {
        this.setState({
          images: [...this.state.images, nextProps.UI.success.url]
        });
      }

      //console.log(nextProps.UI.success.url);

      if (this.state.urls.length === this.state.images.length && this.state.sent === false && this.state.urls.length !== 0) {



        //console.log(this.state.urls);
        //console.log(this.state.images);
        //console.log("Wszystko załadowane");
        this.setState({
          sent: true,
        })
        this.handlePostUpload();

      }
    }




  }




  componentDidMount() {
    $("textarea").keydown(function (e) {
      if (e.keyCode === 9) {
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();

        // set textarea value to: text before caret + tab + text after caret
        $this.val(value.substring(0, start)
          + "\t"
          + value.substring(end));

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
      }
    });

  }






  handleSubmit = event => {
    event.preventDefault();


    if (this.state.javaCode.length < 10000 && this.state.pythonCode.length < 10000 && this.state.cppCode.length < 10000) {

      if (this.state.formdatas.length === 0 && document.getElementById("postTitle").value.length !== 0 && document.getElementById("shortDesc").value.length !== 0) {
        this.handlePostUpload();
      } else {


        if (document.getElementById("postTitle").value.length !== 0 && document.getElementById("shortDesc").value.length !== 0 && document.getElementById("longDesc").value.length <= 750
        
        && document.getElementById("postTitle").value.length <= 50 && document.getElementById("shortDesc").value.length <= 250
        ) {

          const arr = this.state.formdatas;
          for (let i = 0; i < arr.length; i++) {

            const formData = this.state.formdatas[i].formData;
            this.props.uploadPostImage(formData);
            //console.log(i);  
          }

        } else {
          this.props.enqueueSnackbar(`"Title" and "Short description" cannot be empty`, {
            preventDuplicate: true,
            variant: "error",
            autoHideDuration: 2000
          });
        }

      }

    } else {
      this.props.enqueueSnackbar(`Too much code! (Max. 10k char each)`, {
        preventDuplicate: true,
        variant: "error",
        autoHideDuration: 2000
      });
    }



  };

  handlePostUpload = () => {
    //console.log("Will post now!");
    const postStruct = {
      title: this.state.title,
      shortDesc: this.state.shortDesc,
      desc: this.state.desc,
      java: this.state.javaCode,
      python: this.state.pythonCode,
      cpp: this.state.cppCode,
      images: this.state.images,
      //categories
      categories: this.state.categories,
    };




    this.props.postPost(postStruct, this.props.history);


  }

  handleCodeChange = event => {

    //console.log(document.getElementById("postTitle").value.length);
    //console.log(document.getElementById("shortDesc").value.length);

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
    //console.log(this.state.expanded);
    if (this.state.expanded == false) {
      document.getElementById("codeBoxing").classList.add("blackBoxExpanded");
      this.setState({ expanded: true });
    }
    if (this.state.expanded == true) {
      document
        .getElementById("codeBoxing")
        .classList.remove("blackBoxExpanded");

      this.setState({ expanded: false });
    }
  };

  handleOpenInput = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
captchaChange = event => { 
  this.setState({
    reCaptched: true,
  })
}
  

  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;

    return (
      <div className="main-content-squeezed">
        <Paper className={classes.paper}>
          <Typography className={classes.head1} variant="h4" color="primary">
            Create a post
          </Typography>

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
            rowsMax="4"
            id="shortDesc"
          />
          <TextField
            name="desc"
            type="text"
            label="Description"
            variant="outlined"
            id="longDesc"
            error={errors.body ? true : false}
            fullWidth
            helperText="0/750"

            onChange={this.handleChange}
            inputProps={{ maxLength: 750 }}
            className={classes.input}
            multiline="true"
            rows="7"
            rowsMax="8"
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
                    checked={this.state.categories.string}
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
                    checked={this.state.categories.int}
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
                    checked={this.state.categories.array}
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
                    checked={this.state.categories.char}
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
                    value="crypt"
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
                      src={"java_logo.png"}
                      height="24px"
                    />
                  </ToggleButton>
                  <ToggleButton value="py">
                    <img
                      draggable="false"
                      src={"python_logo.png"}
                      height="24px"
                    />
                  </ToggleButton>
                  <ToggleButton value="cpp">
                    <img
                      draggable="false"
                      src={"cpp_logo.png"}
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
            />
          </div>


          <div class="imageUploadBox">
            {this.state.urls.length !== 0 ? (

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
              )}
          </div>
         <center> 
         
         <ReCAPTCHA
    sitekey="6LdSCdAUAAAAAOLYBA6ToCp4LyiCh_d9RaD3jnE0"
    onChange={this.captchaChange}
  />
     </center>
         
          <Tooltip placement="left" title="Upload">
            <IconButton
              onClick={this.handleSubmit}
              type="submit"
              style={{
                backgroundColor: "#ebebeb",
                float: "right",
                marginTop: "5px"
              }}
              disabled={loading, !this.state.reCaptched}
            >
              <PublishIcon  color="primary" />
              {loading && (
                <CircularProgress size={50} className={classes.progress} />
              )}
            </IconButton>
          </Tooltip>
          <div style={{ clear: "both" }}></div>

        </Paper>

      </div>
    );
  }
}

upload.propTypes = {
  postPost: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  uploadPostImage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

export default connect(mapStateToProps, { postPost, uploadPostImage })(
  withStyles(styles)(withSnackbar(upload))
);
