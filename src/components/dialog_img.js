import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function ResponsiveDialog(value) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));

  const _imgURL = value;


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>



      <div id="DialogIMG-btn" onClick={handleClickOpen} className="DialogIMG-btn" style={{ backgroundImage: `url('${_imgURL.value}')` }} >

      </div>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        className="DialogIMG"
      >

        <DialogContent>
          <div className="DialogIMG-imgcontainer">
            <img className="DialogIMG-img" src={_imgURL.value}></img>
          </div>
        </DialogContent>
        <DialogActions>

          <IconButton onClick={handleClose} className="DialogIMG-closeBTN">
            <CloseIcon style={{ color: "white" }} fontSize="large" />
          </IconButton>

        </DialogActions>
      </Dialog>
    </div>
  );
}