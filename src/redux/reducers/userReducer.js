import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_POST,
  UNLIKE_POST,
  REDUCE_EDIT_REQUEST_LIST,
  MARK_NOTIFICATIONS_READ
} from "../types";

const initialState = {
  authenticated: false,
  credentials: {},
  loading: false,
  likes: [],
  notifications: [],
  adminPrivileges: false,
  userPrivileges: false,
  editRequests: []
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };

    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
          ...action.payload,
          loading: false
      };

    case LOADING_USER:
      return {
        ...state,
        loading: true
      };

    case LIKE_POST:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.handle,
            postId: action.payload.postId
          }
        ]
      };

    case REDUCE_EDIT_REQUEST_LIST:

      let secondindex1 = state.editRequests.findIndex(
        post => post.id === action.payload
      );
      state.editRequests.splice(secondindex1, 1);
      return {
        ...state
      }

      case UNLIKE_POST:
        return {
          ...state,
          likes: state.likes.filter(like => like.postId !== action.payload.postId)
        };




        case MARK_NOTIFICATIONS_READ:
          state.notifications.forEach(not => not.read = true);
          return {
            ...state,
            
          }

      default:
        return state;
  }
}