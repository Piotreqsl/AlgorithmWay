import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";

import { postPost } from "../redux/actions/dataActions";

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

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import ImageIcon from "@material-ui/icons/Image";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { withSnackbar } from "notistack";
import { uploadPostImage } from "../redux/actions/dataActions";

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
    images: []
  };

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
        this.props.uploadPostImage(formData);
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
      console.log("need to delete " + event.target.value);
      var arr = [...this.state.categories];
      var index = arr.indexOf(event.target.value);
      if (index !== -1) {
        arr.splice(index, 1);
        this.setState({ categories: arr });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors && !nextProps.UI.loading) {
      console.log(nextProps.UI.errors);
      this.props.enqueueSnackbar("Fatal error occurred", {
        preventDuplicate: true,
        variant: "error",
        autoHideDuration: 3000
      });
    }

    if (nextProps.UI.success && !nextProps.UI.loading) {
      this.props.enqueueSnackbar("Successfully added image", {
        preventDuplicate: true,
        variant: "success",
        autoHideDuration: 1000
      });

      this.setState({
        images: [...this.state.images, nextProps.UI.success.name]
      });
      console.log(nextProps.UI.success.url);
      console.log(this.state.images);
    }
  }

  handleSubmit = event => {
    event.preventDefault();

    const postStruct = {
      title: this.state.title,
      shortDesc: this.state.shortDesc,
      desc: this.state.desc,
      java: this.state.javaCode,
      python: this.state.pythonCode,
      cpp: this.state.cppCode,
      //categories
      categories: this.state.categories
    };
    this.props.postPost(postStruct, this.props.history);
  };

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
    console.log(this.state.expanded);
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
          <form>
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
                      checked={this.state.categories.string}
                      onChange={this.handleFormChange("string")}
                      value="string"
                    />
                  }
                  label="Strings"
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

            <div className="codeInputs">
              <textarea
                id="codeBoxing"
                onChange={this.handleCodeChange}
                type="text"
                className="blackBox"
              />
            </div>
          </form>

          <div class="imageUploadBox">
            {this.state.images.length !== 0 ? (
             
             <div id="imagesHolder" className="imagesHolder">
               
              
               
                <div className="imagesUploadPreview">
                  <div className="containerIU">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/${this.state.images[0]}?alt=media`} />
                    <div className="overlayIU">
                      <IconButton
                        onClick={null}
                        className="iconIU"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <HighlightOffIcon fontSize="large" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                {this.state.images.length !== 2 ? (<div className="imagesUploadPreview">
                  <div className="containerIU">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/${this.state.images[1]}?alt=media`} />
                    <div className="overlayIU">
                      <IconButton
                        onClick={null}
                        className="iconIU"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <HighlightOffIcon fontSize="large" />
                      </IconButton>
                    </div>
                  </div>
                </div>) : null}
                
                {this.state.images.length !== 3? (<div className="imagesUploadPreview">
                  <div className="containerIU">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/${this.state.images[2]}?alt=media`} />
                    <div className="overlayIU">
                      <IconButton
                        onClick={null}
                        className="iconIU"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <HighlightOffIcon fontSize="large" />
                      </IconButton>
                    </div>
                  </div>
                </div>) : null}

                {this.state.images.length !== 4 ? (<div className="imagesUploadPreview">
                  <div className="containerIU">
                    <img src={`https://firebasestorage.googleapis.com/v0/b/algorithmway-420.appspot.com/o/${this.state.images[3]}?alt=media`} />
                    <div className="overlayIU">
                      <IconButton
                        onClick={null}
                        className="iconIU"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <HighlightOffIcon fontSize="large" />
                      </IconButton>
                    </div>
                  </div>
                </div>) : null}



                  {this.state.images.length<4 ? (
    /*
              <div>
                <IconButton onClick={this.handleOpenInput}>
                  <ImageIcon fontSize="large" />
                </IconButton>
                <input
                  type="file"
                  id="imageInput"
                  hidden="hidden"
                  onChange={this.handleImageUpload}
                />
              </div> */ null

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

          <Tooltip placement="left" title="Upload">
            <IconButton
              onClick={this.handleSubmit}
              type="submit"
              style={{
                backgroundColor: "#ebebeb",
                float: "right",
                marginTop: "5px"
              }}
              disabled={loading}
            >
              <PublishIcon color="primary" />
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
