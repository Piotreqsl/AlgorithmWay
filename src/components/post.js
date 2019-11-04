import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles';


//Material-UI imports

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography'
import { Link } from '@material-ui/core';

const styles = {
    card: {
        display: 'flex'
    }
}

 class post extends Component {
    render() {

        const {classes, post : {title, shortDesc, userHandle, createdAt, userImage, postId, java, python, cpp}} = this.props;
//https://youtu.be/m_u6P5k0vP0?list=WL&t=18473
        return (
            <div className="post-margin">
           <Card>
               <CardMedia image={userImage} title="User image" />
               <CardContent>
                   <Typography className="post-title" component={Link} to={`/posts/${postId}`} variant="h6">{title}</Typography>
                   <div className="post-langs">java,cpp,python</div>
                   <br/> <br/>
                   <Typography variant="body2">{shortDesc}</Typography>
                  
                
                    <div className="post-date">
                         <Typography  variant="caption" color="inherit">{createdAt}</Typography>
                    </div>

                    <div className="post-userhandle">
                    <Typography component={Link} to={`/users/${userHandle}`}  variant="overline" color="inherit">{userHandle}</Typography> 
                    </div>
               
               </CardContent>
           </Card>
           </div>
        )
    }
}

export default withStyles(styles)(post);
