export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

export const getRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
