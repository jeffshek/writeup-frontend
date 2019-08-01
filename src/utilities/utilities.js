export const getRandomItemFromArray = array => {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
