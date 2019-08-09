import { openAPI } from "services/api";

export const publishPrompt = ({
  text,
  instagram,
  title,
  email,
  twitter,
  website,
  share_state
}) => {
  const url = "api/writeup/v1/prompts/";
  const postParams = {
    text: text,
    instagram: instagram,
    title: title,
    email: email,
    twitter: twitter,
    website: website,
    share_state: share_state
  };
  return openAPI
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
