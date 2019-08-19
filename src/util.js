export const getRandomNumber = (count) => {
  return Math.floor(Math.random() * count);
};

export const getRandomRating = (count) => {
  return parseFloat((Math.random() * count).toFixed(1));
};

export const getRandomDate = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
};

export const getRandomDuration = () => {
  const hourRandom = Math.round(1 - 0.5 + Math.random() * (2 - 1 + 1));
  const minuteRandom = Math.round(10 - 0.5 + Math.random() * (59 - 10 + 1));
  return `${hourRandom}h ${minuteRandom}m`;
};

export const generateDescription = (string) => {
  const str = string.split(`.`);
  str.pop();
  return str[getRandomNumber(str.length)];
};

export const getRandomValue = (obj, key) => {
  const currentKey = obj[key];
  const currentKeyLength = currentKey.length;
  return currentKey[getRandomNumber(currentKeyLength)];
};

export const getRandomWriters = (obj, key) => {
  const currentKey = obj[key];
  const currentKeyLength = currentKey.length;
  return currentKey.slice(getRandomNumber(1), getRandomNumber(currentKeyLength)).join(`, `);
};

export const getRandomGenres = (obj, key) => {
  const currentKey = obj[key];
  const currentKeyLength = currentKey.length;
  return currentKey.slice(getRandomNumber(1), getRandomNumber(currentKeyLength));
};

export const getRandomRealise = () => {
  const randomDay = new Date(getRandomDate(1900, 2019), getRandomDate(0, 11), getRandomDate(1, 31)
  ).toLocaleDateString(`en-GB`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`
  }).split(` `).join(` `);
  return randomDay;
};

export const getRandomBoolean = () => Boolean(Math.round(Math.random()));
