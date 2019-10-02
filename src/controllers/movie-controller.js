import FilmCard from '../components/film-card';
import DetailsPopup from '../components/details-popup';
import CommentController from './comment-controller';
import {render} from '../utils';
import {AUTHORIZATION, SERVER, Animation, ActionType} from '../constants';
import API from '../api';

class MovieController {
  constructor(container, dataFilm, popupContainer, onDataChangeMain, onChangeView) {
    this._container = container;
    this._dataFilm = dataFilm;
    this._popupContainer = popupContainer;
    this._onDataChangeMain = onDataChangeMain;
    this._onChangeView = onChangeView;

    this._filmCard = new FilmCard(this._dataFilm);
    this._detailsPopup = new DetailsPopup(this._dataFilm);
    this._api = new API({authorization: AUTHORIZATION, server: SERVER});
    this._commentController = new CommentController(
        this._detailsPopup,
        this._dataFilm,
        this._getState,
        this._onDataChangeMain,
        this._queryAddComment.bind(this),
        this._queryDeleteComment.bind(this)
    );

    this._nodeRatingBlock = this._detailsPopup.getElement().querySelector(`.film-details__user-rating-wrap`);
    this._nodeRatingElements = this._detailsPopup.getElement().querySelectorAll(`.film-details__user-rating-input`);
    this._elemRating = null;
  }

  _getState() {
    return {
      isWatchlist: this._dataFilm.isWatchlist,
      isViewed: this._dataFilm.isViewed,
      isFavorite: this._dataFilm.isFavorite
    };
  }

  _getFormData() {
    const formData = new FormData(this._detailsPopup.getElement().querySelector(`.film-details__inner`));
    return {
      personalRating: formData.get(`score`),
    };
  }

  setDefaultView() {
    if (this._popupContainer.getElement().childNodes.length) {
      this._hideDetailsPopup();
    }
  }

  _hideDetailsPopup() {
    this._popupContainer.getElement().innerHTML = ``;
  }

  _renderCommentsBlock() {
    this._api.getMovieComments({movieId: this._dataFilm.id}).then((comments) => {
      this._commentController.show(comments);
    });
  }

  _queryAddComment() {
    this._api.getMovieComments({movieId: this._dataFilm.id}).then((comments) => {
      this._commentController.enableCommentTextarea();
      this._commentController.hide();
      this._commentController.show(comments);
    });
  }

  _queryDeleteComment() {
    this._api.getMovieComments({movieId: this._dataFilm.id}).then((comments) => {
      this._commentController.enableBtnDelete();
      this._commentController.hide();
      this._commentController.show(comments);
    });
  }

  _queryUpdateRating() {
    this._enableRatingBlock();
  }

  _queryUpdateRatingError() {
    this._shakeErrorComponent();
    this._viewErrorRating();
    this._enableRatingBlock();
  }

  _viewErrorRating() {
    this._elemRating.classList.add(`film-details__user-rating-input--error`);
  }

  _shakeErrorComponent() {
    this._nodeRatingBlock.style.animation = Animation.STYLE;
    setTimeout(() => {
      this._nodeRatingBlock.style.animation = ``;
    }, Animation.TIMEOUT);
  }

  _disableRatingBlock() {
    this._nodeRatingElements.forEach((elem) => {
      elem.disabled = true;
    });
  }

  _enableRatingBlock() {
    this._nodeRatingElements.forEach((elem) => {
      elem.disabled = false;
    });
  }

  _resetCheckRating() {
    this._detailsPopup.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((elem) => {
      elem.checked = false;
    });
  }

  _closeRatingBlock() {
    this._detailsPopup.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((elem) => {
      elem.checked = false;
    });
    this._detailsPopup.getElement().querySelector(`.form-details__middle-container`).classList.toggle(`visually-hidden`);
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        this._hideDetailsPopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onPosterClick = () => {
      this._onChangeView();
      this._renderCommentsBlock();
      render(this._popupContainer.getElement(), this._detailsPopup.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onTitleClick = () => {
      this._onChangeView();
      this._renderCommentsBlock();
      render(this._popupContainer.getElement(), this._detailsPopup.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onCommentsClick = () => {
      this._onChangeView();
      this._renderCommentsBlock();
      render(this._popupContainer.getElement(), this._detailsPopup.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onWatchlistBtnClick = (evt) => {
      evt.preventDefault();
      const newState = Object.assign(this._getState(), {isWatchlist: !this._dataFilm.isWatchlist});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(this._dataFilm, newState), () => {});
    };

    const onViewedBtnClick = (evt) => {
      evt.preventDefault();
      const isViewed = !this._dataFilm.isViewed;
      if (isViewed === false) {
        this._detailsPopup.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((elem) => {
          elem.checked = false;
        });
      }
      const newState = Object.assign(this._getState(), {isViewed});
      const newData = Object.assign(this._dataFilm, {personalRating: null});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(newData, newState), () => {});
    };

    const onFavoriteBtnClick = (evt) => {
      evt.preventDefault();
      const newState = Object.assign(this._getState(), {isFavorite: !this._dataFilm.isFavorite});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(this._dataFilm, newState), () => {});
    };

    const onCloseBtnClick = () => {
      this._hideDetailsPopup();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onWatchlistPopupBtnClick = () => {
      const newState = Object.assign(this._getState(), {isWatchlist: !this._dataFilm.isWatchlist});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(this._dataFilm, newState), () => {});
    };

    const onViewedPopupBtnClick = () => {
      const isViewed = !this._dataFilm.isViewed;
      this._detailsPopup.getElement().querySelector(`.film-details__user-rating`).textContent = ``;
      const newState = Object.assign(this._getState(), {isViewed});
      const newData = Object.assign(this._dataFilm, {personalRating: null});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(newData, newState), this._closeRatingBlock.bind(this));
    };

    const onFavoritePopupBtnClick = () => {
      const newState = Object.assign(this._getState(), {isFavorite: !this._dataFilm.isFavorite});
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(this._dataFilm, newState), () => {});
    };

    const onUserRatingInputClick = (evt) => {
      const newData = Object.assign(this._dataFilm, this._getFormData());
      this._disableRatingBlock();
      this._elemRating = evt.target;
      this._elemRating.classList.remove(`film-details__user-rating-input--error`);
      this._detailsPopup.getElement().querySelector(`.film-details__user-rating`).textContent = `Your rate ${evt.target.value}`;
      this._onDataChangeMain(ActionType.UPDATE_RATING, Object.assign(newData, this._getState()), this._queryUpdateRating.bind(this), this._queryUpdateRatingError.bind(this));
    };

    const onUserRatingResetBtnClick = () => {
      const newData = Object.assign(this._dataFilm, {personalRating: null});
      this._detailsPopup.getElement().querySelector(`.film-details__user-rating`).textContent = ``;
      this._onDataChangeMain(ActionType.UPDATE, Object.assign(newData, this._getState()), this._resetCheckRating.bind(this));
    };

    this._filmCard.getElement()
    .querySelector(`.film-card__poster`)
    .addEventListener(`click`, onPosterClick);

    this._filmCard.getElement()
      .querySelector(`.film-card__title`)
      .addEventListener(`click`, onTitleClick);

    this._filmCard.getElement()
      .querySelector(`.film-card__comments`)
      .addEventListener(`click`, onCommentsClick);

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, onWatchlistBtnClick);

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, onViewedBtnClick);

    this._filmCard.getElement()
      .querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, onFavoriteBtnClick);

    this._detailsPopup.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, onCloseBtnClick);

    this._detailsPopup.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, onWatchlistPopupBtnClick);

    this._detailsPopup.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, onViewedPopupBtnClick);

    this._detailsPopup.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, onFavoritePopupBtnClick);

    this._detailsPopup.getElement().querySelectorAll(`.film-details__user-rating-input`).forEach((elem) => {
      elem.addEventListener(`click`, onUserRatingInputClick);
    });

    if (this._detailsPopup.getElement().querySelector(`.film-details__watched-reset`) !== null) {
      this._detailsPopup.getElement().querySelector(`.film-details__watched-reset`)
      .addEventListener(`click`, onUserRatingResetBtnClick);
    }

    render(this._container.getElement().querySelector(`.films-list__container`), this._filmCard.getElement());
  }
}

export default MovieController;
