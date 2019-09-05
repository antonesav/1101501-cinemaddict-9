import Popup from "./components/details";
import {ESC_KEY, Position, renderComponent} from "./util";

class MovieController {
  constructor(container, data, dataChangeHandler) {
    this._container = container;
    this._data = data;
    this._popupCard = new Popup(this._data);
    this._dataChangeHandler = dataChangeHandler;

    this.init();
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
      if (evt.keyCode === ESC_KEY) {
        removeCardDetails();
      }
    };

    commentTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, pressEscPopupHandler);
    });

    commentTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, pressEscPopupHandler);
    });

    renderComponent(this._container, this._popupCard.getElement(), Position.BEFOREEND);
    this._popupCard.getElement().querySelector(`.film-details__close`).addEventListener(`click`, removeCardDetails);
    document.addEventListener(`keydown`, pressEscPopupHandler);
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

}

export default MovieController;
