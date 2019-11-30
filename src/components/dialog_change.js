import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from '@material-ui/core/Tooltip'

export default function FormDialog() {
  
 
 
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Edit profile" placement="left">
      <EditIcon color="primary" onClick={handleClickOpen} className="editIco" />
      </Tooltip>


      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Change your profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is the place where you can change information about your profile.
          </DialogContentText>
          <TextField
            variant="outlined"
            
            margin="dense"
            id="bio"
            label="Bio"
            type="text"
            fullWidth
            multiline="true"
            defaultValue="bio stare"

           

          />

            <TextField
             variant="outlined"
            
            margin="dense"
            id="location"
            label="Location"
            type="text"
            fullWidth
            multiline="true"
            defaultValue="location stare"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}