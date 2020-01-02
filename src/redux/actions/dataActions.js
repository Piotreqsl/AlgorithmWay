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
  ADD_POSTS,
  SET_NO_MORE,

  SET_POST,
  STOP_LOADING_UI,
  LOAD_MORE_POSTS,
  FILTER_POSTS,
  GET_UNAPPROVED_POSTS

} from "../types";

import store from '../store';

import axios from "axios";
import delete_post from "../../components/delete_post";

export const getPosts = () => dispatch => {
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



export const loadMorePosts = (categoryFilters, codeFilters, approvedOnly) => dispatch => {
  var link = "/posts/next/" + store.getState().data.lastId;
  console.log(link + "redux");

  axios.get(link).then((res) => {



    let filtered = [];

    for (var i = 0; i < res.data.length; i++) {
      if (approvedOnly === true && res.data[i].verified === true) {
        filtered.push(res.data[i])
      } else {
        filtered = res.data
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
    console.log('dopiero lołdin')
    axios.get(`/posts/${postId}`)
      .then(res => {


        dispatch({
          type: SET_POST,
          payload: res.data,
        });
        dispatch({
          type: SET_SUCCESS,
          payload: "Git majonezizk: " + postId
        })
      })
      .catch(err => console.log(err));
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

  axios.post(link).then(res => {

    console.log(res.status)


  }).catch(err => {
    console.log(err)
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
        payload: err.response.data,


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
        payload: err.response.data,
      });

      dispatch({
        type: CLEAR_SUCCESS
      });
      dispatch({
        type: CLEAR_ERRORS
      });

    })
}