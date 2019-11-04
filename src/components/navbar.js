import React, { Component } from 'react'

//Material-UI 


import { fade, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Avatar from '@material-ui/core/Avatar';

//Icons

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';

import Home from '@material-ui/icons/Home';
import Add from '@material-ui/icons/Add';
import SignOut from '@material-ui/icons/ExitToApp';
import LogIn from '@material-ui/icons/VpnKey';





const useStyles = makeStyles(theme => ({
  
    

    grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  marginLeft: {
    marginLeft: theme.spacing(2),
   
  },
  marginRight: {
      marginRight: theme.spacing(1),},
//for logo
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },


  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    
    [theme.breakpoints.up('md')]: {
      width: 300,
    },
  },
  sectionDesktop: {
      marginLeft: theme.spacing(2),
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));




export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
      <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">

            <AccountCircle/>

          </Badge>
        </IconButton>
        <p>My profile</p>
          
        </MenuItem>

      <MenuItem onClick={handleMenuClose}>
      <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">

            <SignOut/>

          </Badge>
        </IconButton>
        <p>Log out</p>
          
         </MenuItem>

    </Menu>
  );




  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (

   

    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
       

      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">
            <Home/>
          </Badge>
        </IconButton>
        <p>Home</p>
      </MenuItem>



      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">
            <Add></Add>
          </Badge>
        </IconButton>
        <p>Create a post</p>
      </MenuItem>
      

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>

  );


//Wersja PC
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          
          
          
          <Avatar className={classes.bigAvatar} src="logo192.png"></Avatar>

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          


          <div className={classes.sectionDesktop}>

            <IconButton className={classes.marginRight} color="inherit">
              <Badge badgeContent={0} color='secondary'>
                <Home />
              </Badge>
            </IconButton>


            <IconButton  color="inherit">
              <Badge badgeContent={0} color="secondary">
                <Add />
              </Badge>
            </IconButton>

          </div>


        <div className={classes.grow}/>

          
         

          <div className={classes.sectionDesktop} >
            
          <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            > 
            
                <AccountCircle />
            </IconButton>
lub
            <IconButton  color="inherit">
          <Badge  color="secondary">
          <LogIn />
          </Badge>
          </IconButton>

          </div>


          <div className={classes.marginLeft}>

          <IconButton color="inherit">
          <Badge badgeContent={1} color="secondary">
          <NotificationsIcon />
          </Badge>
          </IconButton>
          </div>

          
          
         



          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

