import {
  SET_POSTS,
  UPLOAD_POST,
  LOADING_DATA,
  LIKE_POST,
  UNLIKE_POST,
  DELETE_POST,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_SUCCESS,
  CLEAR_SUCCESS,
  GET_EDIT_REQUEST,
  SET_NO_MORE,
  PROCESSING,
  SET_POST,

  LOAD_MORE_POSTS,
  FILTER_POSTS,
  GET_UNAPPROVED_POSTS,
  SUBMIT_COMMENT,
  DELETE_COMMENT,
  APPROVE_POST,
  STOP_PROCESSING,
  SET_FOREIGN_USER,
  SYNC_POSTS



} from "../types";

import store from '../store';

import axios from "axios";
import delete_post from "../../components/delete_post";

export const getPosts = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS
  })
  dispatch({
    type: CLEAR_SUCCESS
  })

  dispatch({
    type: LOADING_DATA
  });
  axios
    .get("/posts")
    .then(res => {
      dispatch({
        type: SET_POSTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_POSTS,
        payload: []
      });
    });
};

const advancedFiltering = (mainArray, filters) => {
  let filtered = [];

  for (var i = 0; i < mainArray.length; i++) {
    if (mainArray[i].categories.some(r => filters.includes(r))) {
      filtered.push(mainArray[i])
    }
  }

  return filtered;

}


const advancedFilteringCode = (mainArray, filters) => {

  let filtered = [];



  for (var i = 0; i < mainArray.length; i++) {
    let existingCode = [];

    if (mainArray[i].java !== undefined) existingCode.push("java")
    if (mainArray[i].cpp !== undefined) existingCode.push("cpp")
    if (mainArray[i].python !== undefined) existingCode.push("python")


    if (existingCode.some(r => filters.includes(r))) {
      filtered.push(mainArray[i]);
    }


  }

  return filtered;


}

export const synchronizePosts = () => dispatch => {
  dispatch({
    type: SYNC_POSTS
  })
}


export const loadMorePosts = (categoryFilters, codeFilters, approvedOnly) => dispatch => {



  var link = "/posts/next/" + store.getState().data.lastId;
  console.log(link + " redux");

  axios.get(link).then((res) => {



    let filtered = [];

    for (var i = 0; i < res.data.length; i++) {
      if (approvedOnly === true && res.data[i].verified === true) {
        filtered.push(res.data[i])
      } else {
        filtered[i] = res.data[i];
      }
    }

    if (categoryFilters.length > 0) filtered = advancedFiltering(filtered, categoryFilters);
    if (codeFilters.length > 0) filtered = advancedFilteringCode(filtered, codeFilters);


    console.log(filtered.length)


    if (filtered.length === 0) {
      loadMorePosts(categoryFilters, codeFilters, approvedOnly);
      console.log("przeszedł" + "tersad")
    }



    dispatch({
      type: LOAD_MORE_POSTS,
      payload: filtered,
      backupdata: res.data
    })



  }).catch(err => {
    dispatch({
      type: SET_NO_MORE
    })

  })






}


export const filterPosts = (categoryFilters, codeFilters, approvedOnly) => dispatch => {

  let filtered = [];

  for (var i = 0; i < store.getState().data.backupdata.length; i++) {
    if (approvedOnly === true && store.getState().data.backupdata[i].verified === true) {
      filtered.push(store.getState().data.backupdata[i])
    } else {
      filtered = store.getState().data.backupdata
    }
  }

  if (categoryFilters.length > 0) filtered = advancedFiltering(filtered, categoryFilters);
  if (codeFilters.length > 0) filtered = advancedFilteringCode(filtered, codeFilters);

  console.log(filtered);

  dispatch({
    type: FILTER_POSTS,
    payload: filtered
  })


}


export const getPost = postId => dispatch => {
  if (postId !== "logo192.png") {

    dispatch({
      type: LOADING_UI
    });

    axios.get(`/posts/${postId}`)
      .then(res => {


        dispatch({
          type: SET_POST,
          payload: res.data,
        });
        dispatch({
          type: SET_SUCCESS,
          payload: "Git majonezizk"
        })
      })
      .catch(err => {
        dispatch({
          type: SET_ERRORS,
          payload: err.response
        });
        console.log(err)
      });
  }
}


export const getUnapprovedPosts = () => dispatch => {
  axios.get('/allPosts')
    .then(res => {
      let filtered = [];

      res.data.forEach(req => {
        if (req.verified === false) {
          filtered.push(req);
        }
      })

      dispatch({
        type: GET_UNAPPROVED_POSTS,
        payload: filtered
      })
    })
    .catch(err => console.log(err + " z posta"));

}

export const approvePost = (postId) => dispatch => {
  var link = "/admin/" + postId + "/verify"

  dispatch({
    type: CLEAR_ERRORS
  })
  dispatch({
    type: CLEAR_SUCCESS
  })

  axios.post(link).then(res => {

    dispatch({
      type: APPROVE_POST,
      payload: postId
    })
    dispatch({
      type: SET_SUCCESS,
      payload: "Post approved"
    })


  }).catch(err => {
    dispatch({
      type: SET_ERRORS,
      payload: "Post already approved"
    })


  })


}

export const createEditRequest = (newPost, history) => dispatch => {


  dispatch({
    type: PROCESSING
  });

  var link = "/post/" + newPost.originalPostId + "/createEditRequest";

  axios.post(link, newPost)
    .then(res => {
      console.log(res)

      dispatch({
        type: CLEAR_ERRORS
      });
      dispatch({
        type: SET_SUCCESS,
        payload: res.data.success
      });


    }).catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.statusText,
      });
    });



}

export const getEditRequest = editID => dispatch => {
  dispatch({
    type: LOADING_UI
  });

  axios.get(`/post/${editID}/editRequest`)
    .then(res => {

      console.log(res.data);

      dispatch({
        type: GET_EDIT_REQUEST,
        payload: res.data.originalPost,
        edit: res.data.editRequest
      })





      dispatch({
        type: SET_SUCCESS,
        payload: "Edit request success"
      })

    }).catch(err => {
      console.log(err);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data.error
      });
    })


}

export const approveEditRequest = editID => dispatch => {
  dispatch({
    type: PROCESSING
  });

  axios.post(`/post/${editID}/approveEditRequest`).then(res => {

    dispatch({
      type: SET_SUCCESS,
      payload: "Edit request approved"
    });
    getPosts();


  }).catch(err => {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data.error
    });
    console.log(err);
  })

}


export const rejectEditRequest = editID => dispatch => {
  dispatch({
    type: PROCESSING
  });

  axios.post(`/post/${editID}/rejectEditRequest`).then(res => {

    dispatch({
      type: SET_SUCCESS,
      payload: "Edit request rejected"
    });

  }).catch(err => {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data.error
    });
    console.log(err);
  })

}





export const postPost = (newPost, history) => dispatch => {
  dispatch({
    type: LOADING_UI
  });
  axios
    .post("/post", newPost)
    .then(res => {
      dispatch({
        type: UPLOAD_POST,
        payload: res.data
      });
      dispatch({
        type: CLEAR_ERRORS
      });
      dispatch({
        type: SET_SUCCESS,
        payload: "Successfully posted"
      });
      history.push("/");
    })
    .catch(err => {

      dispatch({
        type: SET_ERRORS,
        payload: err.response.statusText,
      });




    });

};

export const likePost = postId => dispatch => {
  axios
    .get(`/post/${postId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

export const unlikePost = postId => dispatch => {
  axios
    .get(`/post/${postId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_POST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};





export const submitComment = (postId, commentData) => dispatch => {
  axios.post(`/post/${postId}/comment`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      })
    })


}

export const deleteComment = (commentId) => dispatch => {
  axios.post(`/comment/${commentId}/delete`)
    .then(res => {
      dispatch({
        type: DELETE_COMMENT,
        payload: commentId
      })
    })
    .catch(err => console.log(err));
}




export const deletePost = postId => dispatch => {
  axios
    .delete(`/post/${postId}`)
    .then(() => {
      dispatch({
        type: DELETE_POST,
        payload: postId
      });
    })
    .catch(err => console.log(err));
};

export const uploadPostImage = (formData) => dispatch => {
  dispatch({
    type: LOADING_UI
  });

  dispatch({
    type: PROCESSING
  })
  axios.post("/post/uploadImage", formData)
    .then(res => {
      dispatch({
        type: SET_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });

      dispatch({
        type: CLEAR_SUCCESS
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
}

export const uploadPostImageEdit = (formData) => dispatch => {
  dispatch({
    type: PROCESSING
  });

  dispatch({
    type: PROCESSING
  })
  axios.post("/post/uploadImage", formData)
    .then(res => {
      dispatch({
        type: SET_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });

      dispatch({
        type: CLEAR_SUCCESS
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
}



export const getForeignUser = (username) => (dispatch) => {

  dispatch({
    type: LOADING_UI
  });

  axios.get(`/users/${username}`)
  .then(res => {
    dispatch({

      type: SET_FOREIGN_USER,
    
      payload: res.data,

    });
    dispatch({
      type: CLEAR_ERRORS
    });
    
    
  }).catch(err => {
    console.log(err);
    dispatch({
      type: SET_ERRORS,
      payload: err.response,
    });
  }
  
  
  )

}
