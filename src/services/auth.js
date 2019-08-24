import { loginURL, registerURL } from "services/backendURLs";
import { openBackendAPI } from "services/api";

export const loginAPI = ({ username, password }) => {
  const postDetails = {
    username: username,
    password: password
  };

  return openBackendAPI.post(loginURL, postDetails).then(response => {
    return response;
  });
};

export const registerAPI = ({ username, email, password }) => {
  const serializedPostDetails = {
    username: username,

    password1: password,
    password2: password
  };

  if (email) {
    serializedPostDetails["email"] = email;
  }

  return openBackendAPI
    .post(registerURL, serializedPostDetails)
    .then(details => {
      return details;
    })
    .catch(error => {
      console.log(error.response);
      throw error;
    });
};
