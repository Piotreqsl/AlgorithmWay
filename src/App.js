import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import MuiThemeProvider from '@material-ui/styles/ThemeProvider';


// Pages:
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import upload from "./pages/upload";
import profile from "./pages/profile";

//Components: 
import Navbar from './components/navbar';

const theme = createMuiTheme({

  palette: {
    primary: {
      main: '#2E2E3A',
      dark: '#202028',
      light: '#575761',
     
    },
    secondary: {
      main: '#6F6F8C',
      dark: '#4d4d62',
      light: '#8b8ba3',
    },

    
  },
  typography: {
    useNextVariants: true,
  }

})

function App() {
  return (
    <MuiThemeProvider theme={theme}>

<div className="App">

     <Router> 
      <Navbar />
      <Switch>
        <Route exact path="/" component={home}/>
        <Route exact path="/login" component={login}/>
        <Route exact path="/signup" component={signup}/>
        <Route exact path="/upload" component={upload}/>
        <Route exact path="/your_profile" component={profile}/>
      </Switch>

     </Router>

    </div>

    </MuiThemeProvider>
  );
}

export default App;
