import moment from "moment";

const FILMS_AMOUNT = 5;
const CATEGORY_FILMS_AMOUNT = 2;
const MIN_SEARCH_STRING_LENGTH = 3;
const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/cinemaddict`;
const CARDS_STORE_KEY = `Cinemaddict Film Cards`;
const COMMENTS_STORE_KEY = `Cinemaddict Comments`;

const Emojis = [
  {
    id: `smile`,
    value: `sleeping`,
    source: `./images/emoji/smile.png`,
  },
  {
    id: `sleeping`,
    value: `neutral-face`,
    source: `./images/emoji/sleeping.png`,
  },
  {
    id: `puke`,
    value: `grinning`,
    source: `./images/emoji/puke.png`,
  },
  {
    id: `angry`,
    value: `grinning`,
    source: `./images/emoji/angry.png`
  }
];
const Description = {
  SENTENCES: {
    MIN: 1,
    MAX: 3,
  },
  LENGTH: {
    MAX: 140,
    TO_DISPLAY: 139,
  },
};
const UserRating = {
  MILESTONES: {
    FIRST: 1,
    SECOND: 10,
    THIRD: 11,
    FOURTH: 20,
    FIFTH: 21,
  },
  TITLES: {
    FIRST: `Novice`,
    SECOND: `Fan`,
    THIRD: `Movie Buff`,
  },
};
const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};
const ListTitles = {
  GENERAL: `All movies. Upcoming`,
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};
const Sorting = {
  BY_DEFAULT: {
    TYPE: `default`,
    METHOD: undefined,
  },
  BY_DATE: {
    TYPE: `date`,
    METHOD: (a, b) => b.year - a.year,
  },
  BY_RATING: {
    TYPE: `rating`,
    METHOD: (a, b) => b.rating - a.rating,
  },
  BY_COMMENTS: {
    TYPE: `comments`,
    METHOD: (a, b) => b.commentsAmount - a.commentsAmount,
  },
};
const Actions = {
  ADD_TO_WATCHLIST: {
    TYPE: `add to watchlist`,
  },
  MARK_AS_WATCHED: {
    TYPE: `mark as watched`,
  },
  ADD_TO_FAVORITES: {
    TYPE: `add to favorites`,
  },
};
const Screens = {
  FILMS: {
    TYPE: `films`,
  },
  STATS: {
    TYPE: `stats`,
  },
};
const States = {
  VIEW: `view`,
  SEARCH: `search`,
  STATISTIC: `statistic`
};
const Filters = {
  ALL: {
    TYPE: `all`,
    METHOD: (n) => n,
  },
  IN_WATCHLIST: {
    TYPE: `in watchlist`,
    METHOD: (n) => n.inWatchlist,
  },
  IS_WATCHED: {
    TYPE: `is watched`,
    METHOD: (n) => n.isWatched,
  },
  IS_FAVORITE: {
    TYPE: `is favorite`,
    METHOD: (n) => n.isFavorite,
  },
  TODAY: {
    TYPE: `today`,
    METHOD: (n) => moment(n.watchingDate).isoWeekday() === moment().isoWeekday(),
  },
  WEEK: {
    TYPE: `week`,
    METHOD: (n) => moment(n.watchingDate).isoWeek() === moment().isoWeek(),
  },
  MONTH: {
    TYPE: `month`,
    METHOD: (n) => moment(n.watchingDate).month() === moment().month(),
  },
  YEAR: {
    TYPE: `year`,
    METHOD: (n) => moment(n.watchingDate).year() === moment().year(),
  },
};
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};
const ErrorTypes = {
  INPUT: `input-error`,
  RATING_FORM: `rating-form-error`,
  RATING_INPUT: `rating-input-error`,
};

export {FILMS_AMOUNT, CATEGORY_FILMS_AMOUNT, MIN_SEARCH_STRING_LENGTH, AUTHORIZATION, END_POINT, CARDS_STORE_KEY, COMMENTS_STORE_KEY, Emojis, Description, UserRating, Position, ListTitles, Sorting, Actions, Screens, States, Filters, Method, ErrorTypes};
