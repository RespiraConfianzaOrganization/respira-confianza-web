import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
} from "../actions/types";

const initialState = {
    access_token: localStorage.getItem("access_token"),
    isAuthenticated: null,
    isLoading: true,
    user: null,
    error: null,
};

function auth(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return { ...state, isLoading: true, error: null };
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                user: action.payload.user,
            };
        case LOGIN_SUCCESS:
            localStorage.setItem("access_token", action.payload.token);
            return {
                ...state,
                access_token: action.payload.token,
                user: action.payload.user,
                error: null,
                isAuthenticated: true,
                isLoading: false,
            };
        case LOGIN_FAIL:
            localStorage.removeItem("access_token");
            return {
                ...state,
                error: action.payload,
                access_token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case AUTH_ERROR:
            return {
                ...state,
                error: action.payload,
                access_token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case LOGOUT_SUCCESS:
            localStorage.removeItem("access_token");
            return {
                ...state,
                error: null,
                access_token: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        default:
            return state;
    }
}
export default auth;