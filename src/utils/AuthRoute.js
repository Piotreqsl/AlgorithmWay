import React from 'react'

import {Route, Redirect} from 'react-router-dom';

import { connect} from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({component: Component, auth, ...rest}) => (

<Route {...rest}
render={(props) => auth === true ? <Redirect to='/'/> : <Component {...props}/>}
/>
);

const mapStateToProps = (state) => ({
    auth: state.user.authenticated,
})


AuthRoute.prototype = {
    user: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(AuthRoute);