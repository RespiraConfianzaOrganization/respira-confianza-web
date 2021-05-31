import axios from "axios";

import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    USER_LOADING
} from "./types";

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });

    axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/isAuthenticatedAdmin`, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: AUTH_ERROR,
            });
        });
};

// LOGIN USER
export const login = (username, password) => async (dispatch) => {
    // Request Body
    const data = {
        username,
        password,
    };

    await axios
        .post(`${process.env.REACT_APP_API_URL}/api/auth/login`, data)
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data,
                });
            } else {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: res.data.message
                });
            }
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: err.response.data.message,
                });
            }
            else {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: 'Hubo un error con la conexión',
                });
            }
        });
};

// LOGOUT USER
export const logout = () => async (dispatch, getState) => {
    dispatch({
        type: LOGOUT_SUCCESS,
    });

};

// Setup config with token
export const tokenConfig = (getState) => {
    // Get token from state
    const access_token = getState().auth.access_token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // If token, add to headers config
    if (access_token) {
        config.headers["Authorization"] = `Token ${access_token}`;
    }

    return config;
};