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
    usuario: null,
    error: null,
};

function auth(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return { ...state, isLoading: true, error: null };
        case USER_LOADED:
            localStorage.setItem("access_token", action.payload.access);
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                access_token: action.payload.access,
                usuario: action.payload.usuario,
            };
        case LOGIN_SUCCESS:
            localStorage.setItem("access_token", action.payload.access);
            return {
                ...state,
                access_token: action.payload.access,
                usuario: action.payload.usuario,
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
                usuario: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case AUTH_ERROR:
            return {
                ...state,
                error: action.payload,
                access_token: null,
                usuario: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case LOGOUT_SUCCESS:
            localStorage.removeItem("access_token");
            return {
                ...state,
                error: null,
                access_token: null,
                usuario: null,
                isAuthenticated: false,
                isLoading: false,
            };
        default:
            return state;
    }
}
export default auth;