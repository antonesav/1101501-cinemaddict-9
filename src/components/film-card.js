import moment from 'moment';
import AbstractComponent from './abstract-component';
import {FIXED_RATING} from '../constants';
import {getShortDescription, getCorrectGenre, getTransformRuntime} from '../utils';

class FilmCard extends AbstractComponent {
  constructor(card) {
    super();
    this._title = card.title;
    this._rating = card.rating;
    this._date = card.date;
    this._runtime = card.runtime;
    this._genres = card.genres;
    this._poster = card.poster;
    this._description = card.description;
    this._comments = card.comments;
    this._isWatchlist = card.isWatchlist;
    this._isViewed = card.isViewed;
    this._isFavorite = card.isFavorite;
  }

  getTemplate() {
    return `<article class="film-card">
    <h3 class="film-card__title">${this._title}</h3>
    <p class="film-card__rating">${this._rating.toFixed(FIXED_RATING)}</p>
    <p class="film-card__info">
      <span class="film-card__year">${moment(this._date).format(`YYYY`)}</span>
      <span class="film-card__duration">${getTransformRuntime(this._runtime)}</span>
      <span class="film-card__genre">${getCorrectGenre(this._genres[0])}</span>
    </p>
    <img src="./${this._poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${getShortDescription(this._description)}</p>
    <a class="film-card__comments">${this._comments.length} comments</a>
    <form class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${this._isWatchlist ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${this._isViewed ? `film-card__controls-item--active` : ``}">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${this._isFavorite ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
    </form>
  </article>`;
  }
}

export default FilmCard;
