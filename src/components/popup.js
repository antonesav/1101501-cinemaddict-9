import {Position, removeComponent, renderComponent, renderItemQuantity} from "../util";
import AbstractComponent from "./abstract-component";
import DetailsRating from "./details-rating";

const getGenresQuantity = (genres) => {
  const genreList = genres.map((item) => {
    return `<span class="film-details__genre">${item}</span>`;
  }).join(``);
  return `
    <td class="film-details__term">${renderItemQuantity(genres.length, `Genre`)}</td>
    <td class="film-details__cell">
        ${genreList}
    </td>
  `;
};

const getComment = (comments) => {
  return comments.map((item) => {
    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${item.avatar}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${item.text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${item.name}</span>
          <span class="film-details__comment-day">${item.date} days ago</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  });
};

class Popup extends AbstractComponent {
  constructor({title, original, director, writers, actors,
    rating, userRating, release, duration, country, genres, poster,
    description, isWatchlist, isWatched, isFavorite,
    comments, age}) {
    super();
    this._title = title;
    this._original = original;
    this._director = director;
    this._writers = writers;
    this._actors = actors;
    this._rating = rating;
    this._userRating = userRating;
    this._release = release;
    this._duration = duration;
    this._country = country;
    this._genres = genres;
    this._poster = poster;
    this._description = description;
    this._isWatchlist = isWatchlist;
    this._isWatched = isWatched;
    this._isFavorite = isFavorite;
    this._comments = comments;
    this._age = age;
    this._ratingElement = new DetailsRating(this._poster, this._title);
    this._changeRatingHandler = this._changeRatingHandler.bind(this);
    this._changeWatchedStatusHandler = this._changeWatchedStatusHandler.bind(this);
    this._removeUserRatingElement = this._removeUserRatingElement.bind(this);
    this._changeEmojiHandler = this._changeEmojiHandler.bind(this);
    this._addCommentEnterKey = this._addCommentEnterKey.bind(this);
    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);

    this._subscribeEvents();
  }


  _subscribeEvents() {
    this.getElement().querySelector(`#watched`).addEventListener(`change`, this._changeWatchedStatusHandler);

    if (this.getElement().querySelector(`.film-details__user-rating-score`)) {
      this._changedRating();
    }

    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._addCommentEnterKey);

    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._changeEmojiHandler);

    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.addEventListener(`click`, this._commentDeleteHandler);
    });
  }


  _changedRating() {
    this.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`change`, this._changeRatingHandler);
  }


  _changeWatchedStatusHandler() {
    const filmDetailsMiddle = this.getElement().querySelector(`.form-details__middle-container`);

    if (filmDetailsMiddle) {
      removeComponent(filmDetailsMiddle);
      this._removeUserRatingElement();
    } else {
      this._element.querySelector(`.form-details__top-container`).insertAdjacentHTML(`afterend`, this._ratingElement.getTemplate());
      this._changedRating();
      this._resetUserRating();
    }
  }


  _changeRatingHandler(evt) {
    this._userRating = evt.target.value;
    this._removeUserRatingElement();

    this.getElement().querySelector(`.film-details__rating`).
    insertAdjacentHTML(`beforeend`, `<p class="film-details__user-rating">Your rate ${this._userRating}</p>`);
  }


  _resetUserRating() {
    this.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._removeUserRatingElement);
  }


  _removeUserRatingElement() {
    const userRatingElement = this.getElement().querySelector(`.film-details__user-rating`);

    if (userRatingElement) {
      removeComponent(userRatingElement);
    }
  }

  _changeEmojiHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `IMG`) {
      const parentTarget = evt.target.parentElement.htmlFor;
      evt.currentTarget.querySelector(`#${parentTarget}`).checked = true;

      const labelEmojiElement = document.querySelector(`.film-details__add-emoji-label`);
      labelEmojiElement.innerHTML = `<img src="${evt.target.src}" width="55" height="55" alt="emoji">`;
    }
  }


  _removeCommentElements() {
    const quantityCommentElement = this.getElement().querySelector(`.film-details__comments-title`);
    const commentsContainer = this.getElement().querySelector(`.film-details__comments-list`);

    quantityCommentElement.remove();
    renderComponent(this.getElement().querySelector(`.film-details__comments-wrap`), `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>`, Position.BEFOREBEGIN);
    commentsContainer.remove();
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    evt.target.parentNode.parentNode.parentElement.remove();
  }


  _addCommentEnterKey(evt) {
    if (!(evt.key === `Enter` && (evt.ctrlKey || evt.metaKey))) {
      return;
    }

    evt.preventDefault();
    if (this.getElement().querySelector(`.film-details__emoji-list input:checked`) && evt.target.value) {
      const avatarElement = this.getElement().querySelector(`.film-details__add-emoji-label`).firstElementChild;
      this._comments.push({
        avatar: avatarElement.src,
        date: 0,
        name: `Петька`,
        text: evt.target.value
      });

      this._removeCommentElements();
      renderComponent(this.getElement().querySelector(`.film-details__new-comment`), `<ul class="film-details__comments-list">
          ${getComment(this._comments)}
          </ul>`, Position.BEFOREBEGIN);
    }
  }


  getTemplate() {
    return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="form-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${this._poster}" alt="">
  
            <p class="film-details__age">${this._age}+</p>
          </div>
  
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${this._title}</h3>
                <p class="film-details__title-original">Original: ${this._original}</p>
              </div>
  
              <div class="film-details__rating">
                <p class="film-details__total-rating">${this._rating}</p>
              </div>
            </div>
  
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${this._director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${this._writers.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${this._actors.join(`, `)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${this._release}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${this._duration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${this._country}</td>
              </tr>
              <tr class="film-details__row">
                ${getGenresQuantity(this._genres)}
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
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${this._isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
  
          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>
    
    ${this._isWatched && !this._userRating ? this._ratingElement.getTemplate() : ``}
  
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>
  
          <ul class="film-details__comments-list">
          ${getComment(this._comments)}
          </ul>
  
          <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>
  
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" minlength="5"></textarea>
            </label>
  
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
              <label class="film-details__emoji-label" for="emoji-gpuke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
  
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
  }
}

export default Popup;
