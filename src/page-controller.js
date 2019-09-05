import {renderComponent} from "./util";
import {Position} from "./util";
import Card from "./components/card";
import Button from "./components/button";
import FilmList from "./components/films-list";
import Sort from "./components/sort";
import MovieController from "./movie-controller";
import Menu from "./components/menu";

const FILMLIST_CARD_COUNT = 5;
const FILMLIST_ON_CLICK_BUTTON_CARDS_COUNT = 5;
const CATEGORY_CARD_COUNT = 2;

class PageController {
  constructor(mainContainer, cards) {
    this._container = mainContainer;
    this._cards = cards;
    this._copyCards = cards.slice();
    this._cardsShownInList = 0;
    this._cardsShownInCategory = 0;
    this._buttonShowMore = new Button();
    this._filmList = new FilmList();
    this._sort = new Sort();
    this._menu = new Menu(this._cards);
    this._filmListContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
  }

  init() {

    renderComponent(this._container, this._menu.getElement(), Position.BEFOREEND);

    renderComponent(this._container, this._sort.getElement(), Position.BEFOREEND);

    renderComponent(this._container, this._filmList.getElement(), Position.BEFOREEND);

    const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

    const filmsListElement = this._filmList.getElement().querySelector(`.films-list`);

    this._renderCards(this._cards, FILMLIST_CARD_COUNT);

    filmsListExtraElements.forEach((item) => {
      this._renderCardInCharts(this._cards, item, CATEGORY_CARD_COUNT);
    });

    renderComponent(filmsListElement, this._buttonShowMore.getElement(), Position.BEFOREEND);

    const onLoadClick = () => {
      this._renderCards(this._cards, FILMLIST_ON_CLICK_BUTTON_CARDS_COUNT);
    };

    this._buttonShowMore.getElement().addEventListener(`click`, onLoadClick);

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortLinkClickHandler(evt));
  }


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
            return Object.assign({}, filmCard, {isWatched: !filmCard.isWatched});
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


  _renderCards(films, cardsQuantity) {
    const residualCards = films.length - this._cardsShownInList;

    if (cardsQuantity >= residualCards) {
      cardsQuantity = films.length;
      this._buttonShowMore.removeElement();
    }

    const addedCardsQuantity = this._cardsShownInList + cardsQuantity;
    const clippedCards = films.slice(this._cardsShownInList, addedCardsQuantity);

    clippedCards.forEach((item) => this._renderFilmCard(this._filmListContainerElement, item));
    this._cardsShownInList += cardsQuantity;
  }


  _renderCardInCharts(cards, container, cardsQuantity) {
    const addedCardsQuantity = this._cardsShownInCategory + cardsQuantity;
    const clippedCards = cards.slice(this._cardsShownInCategory, addedCardsQuantity);

    clippedCards.forEach((item) => this._renderFilmCard(container, item));
    this._cardsShownInCategory += cardsQuantity;
  }


  _dataChangeHandler(newData, oldData) {
    this._cards[this._cards.findIndex((it) => it === oldData)] = newData;
    this._copyCards[this._copyCards.findIndex((it) => it === oldData)] = newData;
    this._reRenderCards(this._cards, this._filmListContainerElement);
    this._menu.removeElement();
    renderComponent(this._container, this._menu.getElement(), Position.AFTERBEGIN);
  }


  _renderPopupCard(card, container) {
    const popupCard = new MovieController(container, card, this._dataChangeHandler);
    popupCard.init();
  }

  _reRenderCards(cards, container) {
    this._filmListContainerElement.innerHTML = ``;
    cards.forEach((item, index) => {
      if (index < this._cardsShownInList) {
        this._renderFilmCard(container, item);
      }
    });
  }


  _sortLinkClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {

      switch (evt.target.dataset.sortType) {
        case `date`:
          let sortByDateCards = this._cards.sort((a, b) => a.year - b.year);
          this._reRenderCards(sortByDateCards, this._filmListContainerElement);
          break;
        case `rating`:
          let sortByRatingCards = this._cards.sort((a, b) => b.rating - a.rating);
          this._reRenderCards(sortByRatingCards, this._filmListContainerElement);
          break;
        case `default`:
          this._cards = this._copyCards.slice();
          this._reRenderCards(this._cards, this._filmListContainerElement);
          break;
      }
    }
  }
}

export default PageController;
