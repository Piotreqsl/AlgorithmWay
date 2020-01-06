import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//redux
import { Provider } from "react-redux";
import store from "./redux/store";
import CircularProgress from '@material-ui/core/CircularProgress';
import { SET_AUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import MuiThemeProvider from "@material-ui/styles/ThemeProvider";
import Typography from "@material-ui/core/Typography";
import jwtDecode from "jwt-decode";
import withStyles from '@material-ui/core/styles/withStyles'
import AuthRoute from "./utils/AuthRoute";
import PropTypes from 'prop-types'
// Pages:
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import upload from "./pages/upload";
import profile from "./pages/profile";
import admin from "./pages/admin";
import posts from './pages/posts'
import edit from './pages/edit'

import getEdit from './pages/getEdit'


import users from './pages/users'

//Components:
import Navbar from "./components/navbar";
import axios from "axios";
import { SnackbarProvider } from 'notistack';

const font = "'Source Sans Pro', sans-serif";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2E2E3A",
      dark: "#202028",
      light: "#575761"
    },
    secondary: {
      main: "#6F6F8C",
      dark: "#4d4d62",
      light: "#8b8ba3"
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: font
  }
});


const Page404 = ({location}) => (
<div className="main-content-squeezed">
  <div style={{height: "200px"}}></div>
      <div style={{postition: "relative"}}> <CircularProgress style={{position: "absolute", overflow: "hidden", left: "38.3%", top:"16.5%"}} thickness={1} size={450} color="primary" /> 
                   {window.history.pushState('404', 'Algorithm Way', '/404')}
                   <div className="notfoundflex">
                    <Typography color="primary" variant="h1">
                    404
                    </Typography>
                    
                    <div>
                    <Typography color="secondary" variant="button">
                    Page not found
                    </Typography>
                    <Typography color="primary" variant="body2">
                        This is not the page you are looking for!
                    </Typography>
                    </div>

                    </div>
                    </div>
                
            </div>
)

const token = localStorage.FBIdToken;
let UIauth;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    store.dispatch(logoutUser());
    UIauth = false;
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });

    axios.defaults.headers.common["Authorization"] = token;

    store.dispatch(getUserData());
    UIauth = true;
  }
}
const styles = {
  success: { backgroundColor: '#2E2E3A' },
  error: { backgroundColor: '#202028' },
  warning: { backgroundColor: 'red' },
  info: { backgroundColor: '#4d4d62' },
};

function App(props) {
  const { classes } = props;


  return (

    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarProvider
          classes={{
            variantSuccess: classes.success,
            variantError: classes.error,
            variantWarning: classes.warning,
            variantInfo: classes.info,
          }}
          maxSnack={3}>
          <div className="App">
            <Router>
              <Navbar />

              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/upload" component={upload} />
                <Route exact path="/user" component={profile} />
                <Route exact path="/admin" component={admin} />
                <Route path="/posts/" component={posts} />
                <Route path="/editPost/" component={edit} />
                <Route path="/editRequests/" component={getEdit} />

                <Route path="/users/" component={users} />
                <Route  component={Page404} />
                <Route exact path="/404"  component={Page404} />
              </Switch>
            </Router>
          </div>
        </SnackbarProvider>
      </Provider>
    </MuiThemeProvider>
  );
}
App.propTypes = {

  classes: PropTypes.object.isRequired,

};
export { UIauth };
export default withStyles(styles)(App);
