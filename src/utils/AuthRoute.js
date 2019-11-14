import React from 'react'
import {Route, Redirect} from 'react-router-dom';
const AuthRoute = ({component: Component, auth, ...rest}) => (

<Route {...rest}
render={(props) => auth === true ? <Redirect to='/'/> : <Component {...props}/>}
/>
)

export default AuthRoute