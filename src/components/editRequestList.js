import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

//Material-UI imports

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Tooltip from "@material-ui/core/Tooltip";
import { NONAME } from "dns";



const styles = {
    card: {
        display: "flex"
    },


};

class EditRequestList extends Component {


    render() {



        dayjs.extend(relativeTime);
        const {
            classes,
            post: {
                title,
                userHandle,
                createdAt,
                id
            }
        } = this.props;



        return (



            <div className="post-margin-edit">
                <Card>

                    <CardContent>
                        <Typography
                            className="post-title"
                            component={Link}
                            to={`/editRequests/${id}`}
                            variant="h6"
                        >
                            {title}
                        </Typography>



                        <div className="post-userhandle">
                            <Typography
                                component={Link}
                                to={`/users/${userHandle}`}
                                variant="overline"
                                color="inherit"
                            >
                                {userHandle}
                            </Typography>
                        </div>
                    </CardContent>
                </Card>



            </div>
        );
    }
}

export default withStyles(styles)(EditRequestList);
