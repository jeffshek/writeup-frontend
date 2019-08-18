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

export const registerAPI = ({ usernameOrEmail, password }) => {
  const isEmail = usernameOrEmail.includes("@");

  const serializedPostDetails = {
    username: usernameOrEmail,
    password1: password,
    password2: password
  };

  if (isEmail) {
    serializedPostDetails["email"] = usernameOrEmail;
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
