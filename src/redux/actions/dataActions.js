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
  FILTER_POSTS,
  RESTORE_POSTS,
  SET_POST,
  STOP_LOADING_UI,
  
} from "../types";

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

export const pushPosts = (posts) => dispatch => {
  dispatch({
    type: ADD_POSTS,
    payload: posts
  })

}

export const filterPosts = (posts) => dispatch => {
  dispatch({
    type: FILTER_POSTS,
    payload: posts
  })
}

export const restorePosts = (data) => dispatch => {
  dispatch({
    type: RESTORE_POSTS,
    payload: data
  })
}

export const getPost = postId => dispatch => {
    dispatch({type: LOADING_UI});
    axios.get(`/posts/${postId}`)
    .then(res => {
      dispatch({
        type: SET_POST,
        payload: res.data,
      });
      dispatch({type: STOP_LOADING_UI})
    }) 
    .catch(err => console.log(err));
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

    })
    .catch(err => {
      if (err.response) {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,


        });
      } else {
        history.push("/");
        dispatch({
          type: CLEAR_ERRORS
        });
        dispatch({
          type: CLEAR_SUCCESS
        });

      }


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