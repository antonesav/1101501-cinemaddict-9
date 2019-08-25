export const ESC_KEY = 27;
export const getRandomNumber = (count) => {
  return Math.floor(Math.random() * count);
};

export const getRandomRating = (count) => {
  return parseFloat((Math.random() * count).toFixed(1));
};

export const getRandomNumberInRange = (min, max) => {
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

export const getRandomValue = (arr) => {
  const currentArrLength = arr.length;
  return arr[getRandomNumber(currentArrLength)];
};

export const getRandomList = (arr) => {
  const currentArrLength = arr.length;
  return arr.slice(0, getRandomNumberInRange(1, currentArrLength));
};

export const getRandomRealise = () => {
  const randomDay = new Date(getRandomNumberInRange(1900, 2019), getRandomNumberInRange(0, 11), getRandomNumberInRange(1, 31)
  ).toLocaleDateString(`en-GB`, {
    day: `numeric`,
    month: `short`,
    year: `numeric`
  }).split(` `).join(` `);
  return randomDay;
};

export const renderItemQuantity = (count, word) => {
  return `${word}${(count % 10 === 1) ? `` : `s`}`;
};

export const getRandomBoolean = () => Boolean(Math.round(Math.random()));

export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

// Рендер и анрендер для компонент
export const renderComponent = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const removeComponent = (element) => {
  if (element) {
    element.remove();
  }
};
