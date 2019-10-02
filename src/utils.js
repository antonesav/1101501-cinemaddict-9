import moment from 'moment';
import {
  SHORT_DESCRIPTION_LENGTH,
  COUNT_GENRES,
  HOUR,
  LESS_MINUTES,
  NoviceCount,
  FanCount,
  MIN_COUNT_BUFF,
  Position,
  FilterTitle,
  Rang,
  StatusSuccess,
  MomentSettings} from './constants';

moment.updateLocale(MomentSettings.LANGUAGE, {
  week: {
    dow: MomentSettings.START_DAY_WEEK
  }
});

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = Position.BEFOREEND) => {
  switch (place) {
    case Position.BEFOREBEGIN:
      container.before(element);
      break;
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
    case Position.AFTEREND:
      container.after(element);
      break;
    default:
      throw new Error(`Add the corresponding position value of the DOM element.`);
  }
};

export const remove = (element) => {
  if (element) {
    element.remove();
  }
};

export const checkStatus = (response) => {
  if (response.status >= StatusSuccess.MIN && response.status < StatusSuccess.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export const toJSON = (response) => {
  return response.json();
};

export const getShortDescription = (description) => {
  return description.length >= SHORT_DESCRIPTION_LENGTH ? `${description.slice(0, SHORT_DESCRIPTION_LENGTH - 1)}...` : description;
};

export const getTransformRuntime = (runtime) => {
  const hours = parseInt(runtime / HOUR, 10);
  let minutes = runtime % HOUR;
  if (minutes === 0) {
    minutes = `00`;
  } else if (minutes < LESS_MINUTES) {
    minutes = `0${minutes}`;
  }
  return hours !== 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const getCorrectGenre = (genre) => {
  return genre ? genre : ``;
};

export const getGenreTitle = (genres) => {
  return genres.value.length > COUNT_GENRES ? `Genres` : `Genre`;
};

export const getRang = (countFilms) => {
  if (countFilms >= NoviceCount.MIN && countFilms <= NoviceCount.MAX) {
    return Rang.NOVICE;
  } else if (countFilms >= FanCount.MIN && countFilms <= FanCount.MAX) {
    return Rang.FAN;
  } else if (countFilms >= MIN_COUNT_BUFF) {
    return Rang.BUFF;
  }

  return ``;
};

export const getDataFilter = (filterName, dataFilms) => {
  let filteredData;
  const {title, href} = filterName;
  switch (title) {
    case FilterTitle.ALL:
      filteredData = dataFilms;
      break;
    case FilterTitle.WATCHLIST:
      filteredData = dataFilms.filter((task) => task.isWatchlist);
      break;
    case FilterTitle.HISTORY:
      filteredData = dataFilms.filter((task) => task.isViewed);
      break;
    case FilterTitle.FAVORITES:
      filteredData = dataFilms.filter((task) => task.isFavorite);
      break;
    default:
      filteredData = 0;
      break;
  }

  return {
    title,
    href,
    count: filteredData.length
  };
};

export const flat = (input) => {
  const stack = [...input];
  const result = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      stack.push(...next);
    } else {
      result.push(next);
    }
  }
  return result.reverse();
};

export const screeningArray = (elements) => {
  if (elements.length === 0) {
    return [];
  }
  return elements.map((elem) => {
    return elem;
  });
};
