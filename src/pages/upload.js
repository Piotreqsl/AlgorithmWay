import React, { Component } from 'react'
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";

import {postPost} from '../redux/actions/dataActions'


//mui
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';



import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CropFreeIcon from '@material-ui/icons/CropFree';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
paper: {
padding: "25px",

},

head1: {
    marginBottom: "25px",
},
input: {
    marginBottom: "15px"
},
blackBox: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
},


});

export class upload extends Component {
    state = {
        body: '',
        errors: {},
        alignment: "js",
        javaCode: " ",
        pythonCode: " ",
        cppCode: " ",
        expanded: false,


    };
     
    handleAlignment = (event) => {
        this.setState({alignment: event.currentTarget.value});
        
        if(event.currentTarget.value == "js") {
          
          
          document.getElementById("codeBoxing").value = this.state.javaCode;
          //console.log(this.state.javaCode);
        }

        if(event.currentTarget.value == "py") {
          
          document.getElementById("codeBoxing").value = this.state.pythonCode;
         // console.log(this.state.pythonCode);
        }

        if(event.currentTarget.value == "cpp") 
      {
        
          document.getElementById("codeBoxing").value = this.state.cppCode;
         // console.log(this.state.cppCode);
      }
    }

    handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value,
          
        });
        

            
        event.target.parentElement.parentElement.querySelector('p').innerHTML = event.target.value.toString().length + "/" + event.target.maxLength;
      };
      handleCodeChange = (event) => {
        
        if(this.state.alignment == "js") {
          this.setState({javaCode: event.target.value});
          
        }

        if(this.state.alignment == "py") {
          this.setState({pythonCode: event.target.value});
          
        }

        if(this.state.alignment == "cpp") 
      {
        this.setState({cppCode: event.target.value});
        
      }

      }

      handleExpand = () => {
        console.log(this.state.expanded);
        if(this.state.expanded == false) {
        document.getElementById("codeBoxing").classList.add("blackBoxExpanded");
        this.setState({expanded: true});
        } 
        if(this.state.expanded == true) {
          document.getElementById("codeBoxing").classList.remove("blackBoxExpanded");
         
          this.setState({expanded: false});
        }
      }
     

    render() {
        const { errors } = this.state;
        const {classes, UI: {loading}} = this.props;
           
            


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
                   name="shortDesc"
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

<Grid container spacing={1}>
        <Grid item sm={12} md={6}>
        <div className="">
          <ToggleButtonGroup
            value={this.state.alignment}
            exclusive
            onChange={this.handleAlignment}
            
          >
            <ToggleButton value="js" >
              <img draggable="false" src={"java_logo.png"} height="24px" />
            </ToggleButton>
            <ToggleButton value="py" >
              <img draggable="false" src={"python_logo.png"} height="24px" />
            </ToggleButton>
            <ToggleButton value="cpp" >
              <img draggable="false" src={"cpp_logo.png"} height="24px" />
            </ToggleButton>
            
          </ToggleButtonGroup>
          <IconButton onClick={this.handleExpand} className="codeBoxingCrop">
        <CropFreeIcon />
      </IconButton>
        </div>
        
      </Grid> 
      
      
      </Grid>
      


                    <div className="codeInputs">
                   <textarea id="codeBoxing" onChange={this.handleCodeChange} type="text" className="blackBox"/>
                   
                   
                   
                  
                   
                   </div>

           
                  
               </form>

           </Paper>


            </div>  
        )
    }
}

upload.propTypes = {
    postPost: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,

};

const mapStateToProps = state => ({
    UI: state.UI,
});

export default connect(mapStateToProps, {postPost})(withStyles(styles)(upload));
