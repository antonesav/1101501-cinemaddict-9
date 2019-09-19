import Card from "../components/card";
import {Position} from "../util";
import {renderComponent} from "../util";
import MovieController from "./movie-controller";

class FilmController {
  constructor(container, cards, dataChangeHandler) {
    this._container = container;
    this._cards = cards;
    // this._quantity = quantity;
    this._dataChangeHandler = dataChangeHandler;
    // this._cardsShownInList = 0;
    this.init();
  }

  init() {
    this._renderCards(this._cards);
  }


  // Отрисовка одной карточки в контейнер, вешаем на неё слушатели и dataChange
  _renderFilmCard(container, filmCard) {
    const cardComponent = new Card(filmCard);

    renderComponent(container, cardComponent.getElement(), Position.BEFOREEND);

    const onControlButtonClick = (evt) => {
      evt.preventDefault();
      evt.target.classList.toggle(`film-card__controls-item--active`);

      const getNewData = () => {
        switch (evt.target.dataset.action) {
          case `watchlist`:
            return Object.assign({}, filmCard, {isWatchlist: !filmCard.isWatchlist});
          case `watched`:
            return Object.assign({}, filmCard, {isWatched: !filmCard.isWatched, userRating: false});
          case `favorite`:
            return Object.assign({}, filmCard, {isFavorite: !filmCard.isFavorite});
        }
        return null;
      };

      this._dataChangeHandler(getNewData(), filmCard);
    };

    cardComponent.getElement().querySelectorAll(`.film-card__controls-item`).forEach((button) => {
      button.addEventListener(`click`, onControlButtonClick);
    });

    const clickCardHandler = (evt) => {
      if (!evt.target.classList.contains(`film-card__controls-item`)) {
        this._renderPopupCard(filmCard, this._container);
      }
    };

    cardComponent.getElement().addEventListener(`click`, clickCardHandler);
  }


  // Отрисовываем все карточки в контейнер
  _renderCards(films) {
    // const residualCards = films.length - this._cardsShownInList;

    // if (cardsQuantity >= residualCards) {
      // cardsQuantity = films.length;
      // this._buttonShowMore.removeElement();
    // }

    // const addedCardsQuantity = this._cardsShownInList + cardsQuantity;
    // const clippedCards = films.slice(this._cardsShownInList, addedCardsQuantity);

    films.forEach((item) => this._renderFilmCard(this._container, item));
    // this._cardsShownInList += cardsQuantity;
  }


  // Показываем попап
  _renderPopupCard(card, container) {
    const popupCard = new MovieController(container, card, this._dataChangeHandler);
    popupCard.init();
  }

}

export default FilmController;
