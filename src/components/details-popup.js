import moment from 'moment';
import AbstractComponent from './abstract-component';
import {PERSONAL_RATING_COUNT} from '../constants';
import {getGenreTitle, getTransformRuntime} from '../utils';

class DetailsPopup extends AbstractComponent {
  constructor(card) {
    super();
    this._poster = card.poster;
    this._ageRating = card.ageRating;
    this._title = card.title;
    this._titleOriginal = card.titleOriginal;
    this._rating = card.rating;
    this._details = card.details;
    this._description = card.description;
    this._isWatchlist = card.isWatchlist;
    this._isViewed = card.isViewed;
    this._isFavorite = card.isFavorite;
    this._personalRating = card.personalRating;
  }

  getTemplate() {
    const {director, writers, actors, date, runtime, country, genres} = this._details;

    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./${this._poster}" alt="">

            <p class="film-details__age">${this._ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._titleOriginal}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating.toFixed(1)}</p>
                <p class="film-details__user-rating">${this._personalRating && this._isViewed ? `Your rate ${this._personalRating}` : ``}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">${director.name}</td>
                <td class="film-details__cell">${director.value}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${writers.name}</td>
                <td class="film-details__cell">${writers.value.map((cell) => cell).join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${actors.name}</td>
                <td class="film-details__cell">${actors.value.map((cell) => cell).join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${date.name}</td>
                <td class="film-details__cell">${moment(date.value).format(`D MMMM YYYY`)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${runtime.name}</td>
                <td class="film-details__cell">${getTransformRuntime(runtime.value)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${country.name}</td>
                <td class="film-details__cell">${country.value}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${getGenreTitle(genres)}</td>
                <td class="film-details__cell">${genres.value.map((cell) => cell).join(`, `)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${this._description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${this._isWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isViewed ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
      <div class="form-details__middle-container ${this._isViewed ? `` : `visually-hidden`}">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./${this._poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${this._title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${new Array(PERSONAL_RATING_COUNT).fill(``).map((_, id) => (`
                <input type="radio" name="score"
                  class="film-details__user-rating-input visually-hidden"
                  value="${id + 1}"
                  id="rating-${id + 1}"
                  ${Number(this._personalRating) === (id + 1) ? `checked` : ``}
                >
                <label class="film-details__user-rating-label" for="rating-${id + 1}">${id + 1}</label>
              `)).join(` `)}
            </div>
          </section>
        </div>
      </section>
    </div>

    <div class="form-details__bottom-container"></div>
    </form>
  </section>`;
  }
}

export default DetailsPopup;
