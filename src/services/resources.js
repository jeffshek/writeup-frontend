import { openAPI } from "services/api";

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

export const getPublishedPrompts = () => {
  const url = "api/writeup/v1/prompts/";

  return openAPI
    .get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response);
    });
};

export const getPrompt = ({ prompt_uuid }) => {
  const url = `/api/writeup/v1/prompts/${prompt_uuid}/`;
  return openAPI
    .get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response);
    });
};
