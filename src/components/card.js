import {renderItemQuantity} from "../util";
import AbstractComponent from "./abstract-component";

class Card extends AbstractComponent {
  constructor({title, rating, year, duration, genre, poster, description, comments, isWatchlist, isWatched, isFavorite}) {
    super();
    this._title = title;
    this._rating = rating;
    this._year = year;
    this._duration = duration;
    this._genre = genre;
    this._poster = poster;
    this._description = description;
    this._comments = comments;
    this._isWatchlist = isWatchlist;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
        <h3 class="film-card__title">${this._title}</h3>
        <p class="film-card__rating">${this._rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${this._year}</span>
          <span class="film-card__duration">${this._duration}</span>
          <span class="film-card__genre">${this._genre}</span>
        </p>
        <img src="./images/posters/${this._poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${this._description}</p>
        <a class="film-card__comments">${this._comments.length} ${renderItemQuantity(this._comments.length, `comment`)}</a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isWatchlist ? `film-card__controls-item--active` : ``}" data-action="watchlist">Add to watchlist</button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  ${this._isWatched ? `film-card__controls-item--active` : ``}" data-action="watched">Mark as watched</button>
          <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}" data-action="favorite">Mark as favorite</button>
        </form>
      </article>`;
  }
}

export default Card;

// изменить ф-ю

