import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  SET_SUCCESS,
  CLEAR_SUCCESS,


} from "../types";
import axios from "axios";
import { useSnackbar } from 'notistack';





export const loginUser = (userData, history) => dispatch => {


  dispatch({
    type: LOADING_UI
  });
  dispatch({
    type: CLEAR_SUCCESS
  });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);

      dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS
      });
      history.push("/");


    }).then(() => {
      dispatch({
        type: CLEAR_SUCCESS
      });
      dispatch({
        type: CLEAR_ERRORS
      });


    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });




};

export const resetPassword = (resetPassword) => dispatch => {

  dispatch({
    type: LOADING_USER
  });
  axios.post('/passwordReset', resetPassword)
    .then(res => {
      dispatch({
        type: SET_SUCCESS,
        payload: res.data
      });


    })

    .catch(err => {

      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });



    });

  dispatch({
    type: CLEAR_SUCCESS
  });
  dispatch({
    type: CLEAR_ERRORS
  });

}

export const getUserData = () => dispatch => {
  dispatch({
    type: LOADING_USER
  });
  axios
    .get("/user")
    .then(res => {
      
      dispatch({
        type: SET_USER,
        payload: res.data
      });
      
    })
    .catch(err => console.log(err));
};

//signup

export const signupUser = (newUserData, history) => dispatch => {
  dispatch({
    type: LOADING_UI
  });
  axios
    .post("/signup", newUserData)
    .then(res => {
     // setAuthorizationHeader(res.data.token);

     // dispatch(getUserData());
      dispatch({
        type: CLEAR_ERRORS
      });
      history.push("/login");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
      
    });
};



export const editUserDetails = (userDetails) => (dispatch) => {
  dispatch({
    type: LOADING_USER
  });
  axios.post('/user', userDetails)
    .then(() => {
      dispatch(getUserData());
      

    })
    .catch(err => console.log(err));
}


export const uploadImage = (formData) => (dispatch) => {
  dispatch({type: LOADING_USER});
  axios.post('/user/image', formData)
  .then(res => {
    dispatch(getUserData());

  })
  .catch(err=>console.log(err));
}




const setAuthorizationHeader = token => {

  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({
    type: SET_UNAUTHENTICATED
  });
};