import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';


//Material-UI imports

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
    card: {
        display: 'flex'
    }
}

 class post extends Component {
    render() {

        const {classes, post : {title, shortDesc, userHandle, createdAt, userImage}} = this.props;
//https://youtu.be/m_u6P5k0vP0?list=WL&t=18344
        return (
           <Card>
               <CardContent>
                   
               </CardContent>
           </Card>
        )
    }
}

export default withStyles(styles)(post);
