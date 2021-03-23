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
        .get(process.env.REACT_APP_API_URL + '/auth/user', tokenConfig(getState))
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
export const login = (email, password) => async (dispatch) => {
    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Request Body
    const body = {
        email: email,
        password: password,
    };

    await axios
        .post(process.env.REACT_APP_API_URL + "/login/", body, config)
        .then((res) => {
            if (res.data.statusCode === 200) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data,
                });
            } else {
                dispatch({
                    type: LOGIN_FAIL,
                    payload: "Usuario y/o contraseña incorrectos",
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: LOGIN_FAIL,
                payload: "Usuario y/o contraseña incorrectos",
            });
        });
};

// LOGOUT USER
export const logout = () => async (dispatch, getState) => {
    await axios
        .post(`${process.env.REACT_APP_API_URL}/logout/`)
        .then((res) => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        })
        .catch((err) => {
            console.log(err);
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