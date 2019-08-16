import { PROMPTS_TO_USE } from "components/MainComponent/constants";

export const getRandomItemFromArray = array => {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};

export const getItemToLoadTextEditor = () => {
  const lastText = localStorage.getItem("lastText");
  if (!lastText) {
    return getRandomItemFromArray(PROMPTS_TO_USE);
  } else {
    return lastText;
  }
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
