import {Description, Position, UserRank} from "./constants";


const trimString = (string) => {
  return string.length < Description.LENGTH.MAX ? string : `${string.slice(0, Description.LENGTH.TO_DISPLAY).trim()}…`;
};
const createElement = (template) => {
  const containerElement = document.createElement(`div`);
  containerElement.innerHTML = template;
  return containerElement.firstChild;
};
const render = (container, element, position = Position.BEFOREEND) => {
  switch (position) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};
const removeElement = (element) => {
  if (element) {
    element.remove();
  }
};
const getUserTitle = (countWatchedFilms) => {
  return countWatchedFilms > 0 ? UserRank.filter((item) => item.minRating <= countWatchedFilms).pop().title : ``;
};
const countDuplicateElements = (list) => {
  let counts = {};
  list.forEach((element) => {
    counts[element] = (counts[element] || 0) + 1;
  });
  return counts;
};
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};
const toJSON = (response) => {
  return response.json();
};
const isOnline = () => {
  return window.navigator.onLine;
};
const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export {trimString, createElement, render, removeElement, getUserTitle, countDuplicateElements, checkStatus, toJSON, isOnline, objectToArray};
