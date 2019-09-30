import {AUTHORIZATION, CARDS_STORE_KEY, END_POINT, ErrorTypes} from "../utils/constants";
import {isOnline, removeElement, render} from "../utils/utils";
import UserRating from "../components/user-film-rating";
import API from "../api";
import Store from "../store";
import Provider from "../provider";
import ModelCard from "../models/film";

export default class UserRatingController {
  constructor(container, card, onDataChange) {
    this._container = container;
    this._card = card;
    this._onDataChange = onDataChange;

    this._userRatingForm = new UserRating(this._card);
    this._userRatingElement = this._container.querySelector(`.film-details__user-rating`);
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._store = new Store({key: CARDS_STORE_KEY, storage: localStorage});
    this._provider = new Provider({api: this._api, store: this._store, isOnline});
  }

  init() {
    this._renderUserRatingForm();
  }

  show(card) {
    if (this._card !== card) {
      this._setFilmCard(card);
    }

    if (this._card.userRating) {
      this._userRatingElement.textContent = `Your rate ${this._card.userRating}`;
    }

    this._userRatingForm.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._userRatingForm.getElement().classList.add(`visually-hidden`);
    this._resetUserRating();
  }

  _renderUserRatingForm() {
    removeElement(this._userRatingForm.getElement());
    this._userRatingForm.removeElement();
    this._userRatingForm = new UserRating(this._card);
    const ratingFormContainer = this._container.querySelector(`.form-details__middle-container`);
    render(ratingFormContainer, this._userRatingForm.getElement());

    if (!this._card.isWatched) {
      this._userRatingForm.getElement().classList.add(`visually-hidden`);
    }

    const ratingInputs = this._userRatingForm.getElement().querySelectorAll(`.film-details__user-rating-input`);
    ratingInputs.forEach((input) => {
      input.addEventListener(`change`, (evt) => this._onRatingInputChange(evt));

      if (Number(input.value) === this._card.userRating) {
        input.checked = true;
      }
    });
    const undoButton = this._userRatingForm.getElement().querySelector(`.film-details__watched-reset`);
    undoButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._resetUserRating();
    });
  }

  _setFilmCard(card) {
    this._card = card;
    this._renderUserRatingForm();
  }

  _onRatingInputChange(evt) {
    this._userRatingElement.textContent = `Your rate ${evt.target.value}`;
    const errorInput = this._userRatingForm.getElement().querySelector(`.${ErrorTypes.RATING_INPUT}`);

    if (errorInput) {
      errorInput.classList.remove(ErrorTypes.RATING_INPUT);
    }

    if (this._userRatingForm.getElement().classList.contains(ErrorTypes.RATING_FORM)) {
      this._userRatingForm.getElement().classList.remove(ErrorTypes.RATING_FORM);
    }

    this._card.userRating = Number(evt.target.value);
    this._provider.updateCard({
      id: this._card.id,
      data: ModelCard.toRAW(this._card),
    })
      .then(() => {
        this._onDataChange(this._card.id);
      })
      .catch(() => {
        this._resetUserRating();
        const ratingInputLabel = this._userRatingForm.getElement().querySelector(`[for="${evt.target.id}"]`);
        ratingInputLabel.classList.add(ErrorTypes.RATING_INPUT);
        this._userRatingForm.getElement().classList.add(ErrorTypes.RATING_FORM);
      });
  }

  _resetUserRating() {
    this._userRatingElement.textContent = ``;

    if (this._card.userRating) {
      this._card.userRating = 0;
      this._onDataChange(this._card.id);
    }

    const chosenRating = this._container.querySelector(`.film-details__user-rating-input:checked`);

    if (chosenRating) {
      chosenRating.checked = false;
    }
  }
}
