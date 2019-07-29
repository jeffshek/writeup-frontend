export const getRandomItemFromArray = array => {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  return randomItem;
};
