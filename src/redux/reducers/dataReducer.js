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
    LOAD_MORE_POSTS
} from '../types'

const initialState = {
    posts: [],
    backupdata: [],
    post: {},
    loading: false,
    noMore: false

};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            }
            case LOAD_MORE_POSTS:
                return {
                    ...state,
                    posts: state.posts.concat(action.payload),
                        backupdata: state.backupdata.concat(action.backupdata),
                        lastId: action.backupdata[action.backupdata.length - 1].postId
                }

                case FILTER_POSTS:
                    return {
                        ...state,
                        posts: action.payload
                    }

                    case SET_NO_MORE:
                        return {
                            ...state,
                            noMore: true
                        }



                        case SET_POSTS:
                            return {
                                ...state,
                                posts: action.payload,
                                    loading: false,
                                    lastId: action.payload[action.payload.length - 1].postId,
                                    backupdata: action.payload
                            }

                            case ADD_POSTS:
                                return {
                                    ...state,
                                    posts: state.posts.concat(action.payload),
                                }


                                case UNLIKE_POST:
                                case LIKE_POST:
                                    let index = state.posts.findIndex((post) => post.postId === action.payload.postId);
                                    state.posts[index] = action.payload;

                                    let secondIndex = state.backupdata.findIndex((post) => post.postId === action.payload.postId);
                                    state.backupdata[secondIndex] = action.payload;
                                    return {
                                        ...state,
                                        posts: [
                                            action.payload,
                                            ...state.posts
                                        ]
                                    }
                                    case SET_POST:
                                        return{
                                            ...state,
                                            post: action.payload,
                                        }

                                    case DELETE_POST:
                                        let index1 = state.posts.findIndex(post => post.postId === action.payload);
                                        state.posts.splice(index1, 1);

                                        let secondindex1 = state.backupdata.findIndex(post => post.postId === action.payload);
                                        state.backupdata.splice(secondindex1, 1);


                                        return {
                                            ...state
                                        };

                                    case UPLOAD_POST:
                                        return {
                                            ...state,
                                            posts: [
                                                action.payload.resPost,
                                                ...state.posts
                                            ]
                                        }

                                    

                                        default:
                                            return state;






    }
}