import axios from "axios";
import store from "../store/store";

export const getToken = () => {
    return store.getState().auth.access_token;
};

export const getRequest = async (url, params) => {
    const token = getToken();
    const response = await axios.get(url, {
        params,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const postRequest = async (url, body) => {
    const token = getToken();
    const response = await axios.post(url, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const putRequest = async (url, body) => {
    const token = getToken();
    const response = await axios.put(url, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};

export const deleteRequest = async (url) => {
    const token = getToken();
    const response = await axios.delete(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response;
};
