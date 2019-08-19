import axios from "axios";

import {
  checkTokenKeyInLocalStorage,
  TOKEN_KEY_CONSTANT
} from "services/storage";

const JSON_APPLICATION_TYPE = "application/json";

export const openBackendAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": JSON_APPLICATION_TYPE
  }
});

export const loggedInBackendAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: `Token ${localStorage.getItem(TOKEN_KEY_CONSTANT)}`,
    "Content-Type": JSON_APPLICATION_TYPE,
    Accept: JSON_APPLICATION_TYPE
  }
});

// choose proper API based on logged in or not
export const backendAPI = () => {
  if (checkTokenKeyInLocalStorage()) {
    return loggedInBackendAPI;
  } else {
    return openBackendAPI;
  }
};
