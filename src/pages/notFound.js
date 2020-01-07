import React, { Component } from 'react'
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

export class notFound extends Component {
    render() {
        

        return (
            <div className="main-content-squeezed">
              <div style={{height: "200px"}}></div>
                  <div>  
                              
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
    }
}

export default notFound
