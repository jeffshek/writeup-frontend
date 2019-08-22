import { backendAPI } from "services/api";
import { upvotePromptURL } from "services/backendURLs";

export const publishPrompt = ({
  text,
  instagram,
  title,
  email,
  twitter,
  website,
  content,
  share_state
}) => {
  const url = "api/writeup/v1/prompts/";
  const postParams = {
    text: text,
    instagram: instagram,
    title: title,
    email: email,
    twitter: twitter,
    content: content,
    website: website,
    share_state: share_state
  };
  const api = backendAPI();

  return api
    .post(url, postParams)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error.response.status === 429) {
        alert("Too Many Requests. Please Try Again In An Hour.");
        console.log(
          "The API's request limit has been exceeded. Please try again in the next hour."
        );
      }

      throw error.response;
    });
};

export const getPublishedPrompts = () => {
  const url = "api/writeup/v1/prompts/";

  const api = backendAPI();

  return api
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
  const api = backendAPI();

  return api
    .get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error.response);
    });
};

export const upvotePrompt = ({ prompt_uuid, value }) => {
  const url = upvotePromptURL.replace(":prompt_uuid", prompt_uuid);
  const api = backendAPI();

  const postDetails = {
    value: value
  };

  return api.post(url, postDetails);
};
