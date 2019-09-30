import {Actions} from "../utils/constants";
import {removeElement, render} from "../utils/utils";
import CommentsController from "./comments";
import FilmCard from "../components/film-card";
import FilmDetails from "../components/film-details";
import UserRatingController from "./user-rating";
import moment from "moment";

export default class FilmController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this._filmCard = new FilmCard(this._data);
    this._filmDetails = new FilmDetails(this._data);
  }

  init() {
    const hideFilmDetails = () => {
      removeElement(this._filmDetails.getElement());
      this._filmDetails.removeElement();
    };

    const renderCommentsForm = () => {
      const commentsContainer = this._filmDetails.getElement().querySelector(`.form-details__bottom-container`);
      const commentsController = new CommentsController(commentsContainer, this._data.id, onEscKeyDown, this._onDataChange.bind(this));
      commentsController.init();
    };

    const userRatingFormController = new UserRatingController(this._filmDetails.getElement(), this._data, this._onDataChange.bind(this));
    userRatingFormController.init();
    let ratingFormShown;

    const showRatingForm = () => {
      userRatingFormController.show(this._data);
      ratingFormShown = true;
    };

    const hideRatingForm = () => {
      userRatingFormController.hide();
      ratingFormShown = false;
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        hideFilmDetails();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onControlButtonClick = (evt) => {
      if (evt.target.tagName === `BUTTON`) {
        evt.preventDefault();
        evt.target.classList.toggle(`film-card__controls-item--active`);
      }

      switch (evt.target.dataset.action) {
        case Actions.ADD_TO_WATCHLIST.TYPE:
          this._data.inWatchlist = !this._data.inWatchlist;
          this._onDataChange(this._data.id);
          break;
        case Actions.MARK_AS_WATCHED.TYPE:
          this._data.isWatched = !this._data.isWatched;
          this._data.watchingDate = this._data.watchingDate ? null : moment().toISOString();

          if (ratingFormShown) {
            hideRatingForm();
          } else {
            showRatingForm();
          }

          this._onDataChange(this._data.id);
          break;
        case Actions.ADD_TO_FAVORITES.TYPE:
          this._data.isFavorite = !this._data.isFavorite;
          this._onDataChange(this._data.id);
          break;
      }
    };

    const renderFilmDetails = () => {
      this._onChangeView();
      render(document.body, this._filmDetails.getElement());
      renderCommentsForm();
      this._filmDetails.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, () => {
        hideFilmDetails();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
      document.addEventListener(`keydown`, onEscKeyDown);
      this._filmDetails.getElement().querySelector(`.film-details__controls`).addEventListener(`click`, (evt) => onControlButtonClick(evt));
    };

    if (this._data.isWatched) {
      showRatingForm();
    }

    this._filmCard.getElement().querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`).forEach((element) => element.addEventListener(`click`, renderFilmDetails));
    this._filmCard.getElement().querySelector(`.film-card__controls`).addEventListener(`click`, (evt) => onControlButtonClick(evt));
    render(this._container, this._filmCard.getElement());
  }

  setDefaultView() {
    if (document.body.contains(this._filmDetails.getElement())) {
      removeElement(this._filmDetails.getElement());
      this._filmDetails.removeElement();
    }
  }
}
