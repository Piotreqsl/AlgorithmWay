import {
    SET_ERRORS,
    CLEAR_ERRORS,
    LOADING_UI,
    LOADING_SIMPLE,
    ENQUEUE_SNACKBAR,
    CLOSE_SNACKBAR,
    REMOVE_SNACKBAR,
    SET_SUCCESS,
    CLEAR_SUCCESS,
    STOP_LOADING_UI,
    PROCESSING,
    STOP_PROCESSING,
    LOAD_MORE_POSTS,
    SET_NO_MORE


} from '../types';
const initialState = {
    loading: false,
    errors: null,
    success: null,
    processing: false

};

export default function (state = initialState, action) {
    switch (action.type) {

        case PROCESSING:
            return {
                ...state,
                processing: true
            }

            case SET_NO_MORE:
                return {
                    ...state,
                    processing: false
                }
                case LOAD_MORE_POSTS:
                    return {
                        ...state,
                        processing: false
                    }

                    case STOP_PROCESSING:
                        return {
                            ...state,
                            processing: false
                        }


                        case SET_ERRORS:
                            return {
                                ...state,
                                loading: false,
                                    processing: false,
                                    errors: action.payload,
                            };

                        case SET_SUCCESS:
                            return {
                                ...state,
                                loading: false,
                                    processing: false,
                                    success: action.payload,
                            };

                        case CLEAR_SUCCESS:
                            return {
                                ...state,
                                success: null
                            };

                        case CLEAR_ERRORS:
                            return {
                                ...state,
                                loading: false,
                                    processing: false,
                                    errors: null,
                            };

                        case LOADING_UI:
                            return {
                                ...state,
                                loading: true,
                            }
                            case STOP_LOADING_UI:
                                return {
                                    ...state,
                                    loading: false,

                                }



                                default:
                                    return state;

    }
}