import Popup from "../components/popup";
import {Position, removeComponent, renderComponent} from "../util";
import DetailsRating from "../components/details-rating";

class MovieController {
  constructor(container, data, dataChangeHandler) {
    this._container = container;
    this._data = data;
    this._popupCard = new Popup(this._data);
    this._changeRatingHandler = this._changeRatingHandler.bind(this);
    this._changeWatchedStatusHandler = this._changeWatchedStatusHandler.bind(this);
    this._removeUserRatingElement = this._removeUserRatingElement.bind(this);
    this._dataChangeHandler = dataChangeHandler;
  }

  init() {
    const commentTextarea = this._popupCard.getElement().querySelector(`.film-details__comment-input`);
    const removeCardDetails = () => {
      if (document.body.contains(this._popupCard.getElement())) {
        this._changeControlButtons();
        this._popupCard.removeElement();
        document.removeEventListener(`keydown`, pressEscPopupHandler);
      }
    };

    const pressEscPopupHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        removeCardDetails();
      }
    };

    commentTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, pressEscPopupHandler);
    });

    commentTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, pressEscPopupHandler);
    });

    if (!document.querySelector(`.film-details`)) {
      renderComponent(this._container, this._popupCard.getElement(), Position.BEFOREEND);
    }

    this._popupCard.getElement().querySelector(`.film-details__close`).addEventListener(`click`, removeCardDetails);
    document.addEventListener(`keydown`, pressEscPopupHandler);


    // Если Фильм отмечен просмотренным, то показываем блок рейтинга
    if (this._data.isWatched) {
      this._popupCard.getElement().querySelector(`.form-details__top-container`).insertAdjacentHTML(`afterend`, new DetailsRating(this._data.poster, this._data.title, this._data.userRating).getTemplate());
      this._popupCard.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._removeUserRatingElement);
    }


    // Вешаем слушатель на кнопку Watched в попапе
    this._popupCard.getElement().querySelector(`#watched`).addEventListener(`change`, this._changeWatchedStatusHandler);


    // Если у нас имеется блок с выставлением рейтинга, то обрабатываем выставление оценки
    if (this._popupCard.getElement().querySelector(`.film-details__user-rating-score`)) {
      this._changedRating();
    }


    // Если оценка выставлена и фильм просмотрен, то отрисовываем userRating
    if (this._data.userRating && this._data.isWatched) {
      this._popupCard.getElement().querySelector(`.film-details__rating`).
      insertAdjacentHTML(`beforeend`, `<p class="film-details__user-rating">Your rate ${this._data.userRating}</p>`);
    }
  }


  _changeControlButtons() {
    const formData = new FormData(this._popupCard.getElement().querySelector(`.film-details__inner`));
    const entry = {
      isWatchlist: formData.get(`watchlist`) === `on`,
      isWatched: formData.get(`watched`) === `on`,
      isFavorite: formData.get(`favorite`) === `on`,
    };

    this._dataChangeHandler(Object.assign({}, this._data, entry), this._data);
  }


  // Вешаем Change на кнопки выбора рейтинга
  _changedRating() {
    this._popupCard.getElement().querySelector(`.film-details__user-rating-score`).addEventListener(`change`, this._changeRatingHandler);
  }


  // Обрабатываем событие показа блока рейтинга
  _changeWatchedStatusHandler() {
    const filmDetailsMiddle = this._popupCard.getElement().querySelector(`.form-details__middle-container`);

    if (filmDetailsMiddle) {
      removeComponent(filmDetailsMiddle);
      this._removeUserRatingElement();
    } else {
      this._data.userRating = false;
      this._popupCard.getElement().querySelector(`.form-details__top-container`).insertAdjacentHTML(`afterend`, new DetailsRating(this._data.poster, this._data.title, this._data.userRating).getTemplate());
      this._changedRating();
      this._resetUserRating();
    }
  }


  // Фиксируем выбранную оценку
  _changeRatingHandler(evt) {
    this._removeUserRatingElement();
    this._data.userRating = +(evt.target.value);
    evt.target.checked = true;
    this._popupCard.getElement().querySelector(`.film-details__rating`).
    insertAdjacentHTML(`beforeend`, `<p class="film-details__user-rating">Your rate ${this._data.userRating}</p>`);
  }


  // Сбрасываем оценку
  _resetUserRating() {
    this._popupCard.getElement().querySelector(`.film-details__watched-reset`).addEventListener(`click`, this._removeUserRatingElement);
  }


  // Удаляем userRating
  _removeUserRatingElement() {
    const userRatingElement = this._popupCard.getElement().querySelector(`.film-details__user-rating`);
    const changedRatingElement = this._popupCard.getElement().querySelector(`.film-details__user-rating-input:checked`);

    this._data.userRating = false;
    if (userRatingElement) {
      removeComponent(userRatingElement);
    }

    if (changedRatingElement) {
      changedRatingElement.checked = false;
    }
  }

}

export default MovieController;
