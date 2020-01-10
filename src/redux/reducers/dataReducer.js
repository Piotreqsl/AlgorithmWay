import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  LOADING_DATA,
  DELETE_POST,
  UPLOAD_POST,
  ADD_POSTS,
  FILTER_POSTS,
  SET_POST,
  SET_NO_MORE,
  LOAD_MORE_POSTS,
  GET_UNAPPROVED_POSTS,
  SUBMIT_COMMENT,
  DELETE_COMMENT,
  APPROVE_POST,
  SET_FOREIGN_USER,
  GET_EDIT_REQUEST,
  SYNC_POSTS,


} from "../types";

const initialState = {
  posts: [],
  backupdata: [],
  post: {},
  editPost: {},
  loading: false,
  noMore: false,
  admin: {
    unapprovedPosts: []
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: state.posts.concat(action.payload),
          backupdata: state.backupdata.concat(action.backupdata),
          lastId: action.backupdata[action.backupdata.length - 1].postId
      };

    case FILTER_POSTS:
      return {
        ...state,
        posts: action.payload
      };

    case SET_NO_MORE:
      return {
        ...state,
        noMore: true
      };
    case GET_UNAPPROVED_POSTS:
      return {
        ...state,
        admin: {
          ...state.admin,
          unapprovedPosts: action.payload
        }
      };
    case SYNC_POSTS:
      return {
        ...state,
        posts: action.payload,
          noMore: false,
          loading: false,
          lastId: action.payload[action.payload.length - 1].postId,
          backupdata: action.payload,
          posts: state.backupdata
      };



    case GET_EDIT_REQUEST:
      return {
        ...state,
        post: action.payload,
          editPost: action.edit
      }

      case SET_POSTS:
        return {
          ...state,
          posts: action.payload,
            noMore: false,
            loading: false,
            lastId: action.payload[action.payload.length - 1].postId,
            backupdata: action.backupdata
        };

      case ADD_POSTS:
        return {
          ...state,
          posts: state.posts.concat(action.payload)
        };

      case SET_POST:
        return {
          ...state,
          post: action.payload
        };

      case UNLIKE_POST:
      case LIKE_POST:
        let index = state.posts.findIndex(
          post => post.postId === action.payload.postId
        );
        state.posts[index] = action.payload;

        let secondIndex = state.backupdata.findIndex(
          post => post.postId === action.payload.postId
        );
        state.backupdata[secondIndex] = action.payload;

        let thirdIndex = state.admin.unapprovedPosts.findIndex(
          post => post.postId === action.payload.postId
        );
        if (thirdIndex >= 0)
          state.admin.unapprovedPosts[thirdIndex] = action.payload;

        if (state.post.postId === action.payload.postId) {
          state.post.likeCount = action.payload.likeCount;
        }
        return {
          ...state
        };

      case DELETE_POST:
        let index1 = state.posts.findIndex(
          post => post.postId === action.payload
        );
        state.posts.splice(index1, 1);

        let secondindex1 = state.backupdata.findIndex(
          post => post.postId === action.payload
        );
        state.backupdata.splice(secondindex1, 1);

        let thirdindex1 = state.admin.unapprovedPosts.findIndex(
          post => post.postId === action.payload
        );
        if (thirdindex1 >= 0) state.admin.unapprovedPosts.splice(thirdindex1, 1);

        return {
          ...state
        };

      case UPLOAD_POST:
        return {
          ...state,
          posts: [action.payload.resPost, ...state.posts]
        };

      case SUBMIT_COMMENT:
        return {
          ...state,
          post: {
            ...state.post,
            comments: [action.payload, ...state.post.comments],
            commentCount: state.post.commentCount + 1
          }
        };

      case DELETE_COMMENT:
        let comIndex = state.post.comments.findIndex(
          comment => comment.id === action.payload
        );
        state.post.comments.splice(comIndex, 1);
        return {
          ...state,
          post: {
            ...state.post,
            comments: [...state.post.comments],
            commentCount: state.post.commentCount - 1
          }
        };

      case APPROVE_POST:
        let indexA = state.posts.findIndex(
          post => post.postId === action.payload
        );
        state.posts[indexA].verified = true;

        let secondIndexA = state.backupdata.findIndex(
          post => post.postId === action.payload
        );
        state.backupdata[secondIndexA].verified = true;

        let thirdIndexA = state.admin.unapprovedPosts.findIndex(
          post => post.postId === action.payload
        );
        if (thirdIndexA >= 0) state.admin.unapprovedPosts.splice(thirdIndexA, 1);

        return {
          ...state
        };


      case SET_FOREIGN_USER:
        return {
          ...action.payload,
            loading: false,
            ...state

        }


        default:
          return state;

  }
}