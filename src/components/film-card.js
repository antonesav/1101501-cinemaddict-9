import {Actions} from "../utils/constants";
import AbstractComponent from "./abstract-component";

export default class FilmCard extends AbstractComponent {
  constructor({title, rating, year, duration, genre, poster, description, commentsAmount, inWatchlist, isWatched, isFavorite}) {
    super();
    this._title = title;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genre = genre;
    this._poster = poster;
    this._description = description;
    this._commentsAmount = commentsAmount;
    this._inWatchlist = inWatchlist;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
          <h3 class="film-card__title">${this._title}</h3>
          <p class="film-card__rating">${this._rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${this._year}</span>
            <span class="film-card__duration">${Math.floor(this._duration / 60)}h ${this._duration % 60}m</span>
            <span class="film-card__genre">${this._genre}</span>
          </p>
          <img src=${this._poster} alt="" class="film-card__poster">
          <p class="film-card__description">${this._description}</p>
          <a class="film-card__comments">${this._commentsAmount} comments</a>
          <form class="film-card__controls">
            <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._inWatchlist ? `film-card__controls-item--active` : ``}" data-action="${Actions.ADD_TO_WATCHLIST.TYPE}">Add to watchlist</button>
            <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isWatched ? `film-card__controls-item--active` : ``}" data-action="${Actions.MARK_AS_WATCHED.TYPE}">Mark as watched</button>
            <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}" data-action="${Actions.ADD_TO_FAVORITES.TYPE}">Mark as favorite</button>
          </form>
        </article>`;
  }
}
