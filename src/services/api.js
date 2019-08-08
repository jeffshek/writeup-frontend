import axios from "axios";

export const openAPI = axios.create({
  //baseURL: "open.sernigan.io/",
  baseURL: "http://localhost:8008/",
  headers: {
    "Content-Type": "application/json"
  }
});

export const publishPrompt = ({ text, instagram, share_state }) => {
  const url = "api/writeup/v1/prompts/";
  const postParams = {
    text: text,
    instagram: instagram,
    share_state: share_state
  };
  return openAPI
    .post(url, postParams)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response);
    });
};
