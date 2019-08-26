import {removeComponent, renderComponent} from "./util";
import {Position} from "./util";
import Card from "./components/card";
import Button from "./components/button";
import FilmList from "./components/films-list";
import Popup from "./components/details";
import {ESC_KEY} from "./util";

const FILMLIST_CARD_COUNT = 5;
const FILMLIST_ON_CLICK_BUTTON_CARDS_COUNT = 5;
const CATEGORY_CARD_COUNT = 2;

class PageController {
  constructor(mainContainer, cards) {
    this._container = mainContainer;
    this._cards = cards;
    this._buttonShowMore = new Button();
    this._filmList = new FilmList();
    this._copyCards = cards.slice();
  }

  init() {

    renderComponent(this._container, this._filmList.getElement(), Position.BEFOREEND);

    const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

    const filmsListElement = this._filmList.getElement().querySelector(`.films-list`);

    this._renderCards(this._cards, FILMLIST_CARD_COUNT);

    filmsListExtraElements.forEach((item) => {
      this._renderCardInCharts(this._copyCards, item, CATEGORY_CARD_COUNT);
    });

    renderComponent(filmsListElement, this._buttonShowMore.getElement(), Position.BEFOREEND);

    const onLoadClick = () => {
      this._renderCards(this._cards, FILMLIST_ON_CLICK_BUTTON_CARDS_COUNT);
    };

    this._buttonShowMore.getElement().addEventListener(`click`, onLoadClick);
  }


  _renderFilmCard(container, filmCard) {
    const cardComponent = new Card(filmCard);

    renderComponent(container, cardComponent.getElement(), Position.BEFOREEND);

    const clickCardHandler = () => {
      this._renderPopupCard(this._copyCards, this._container);
    };

    cardComponent.getElement().addEventListener(`click`, clickCardHandler);
  }


  _renderCards(films, count) {
    const filmsContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);
    let cards = films;

    if (count >= cards.length) {
      count = cards.length;
      removeComponent(this._buttonShowMore.getElement());
      this._buttonShowMore.removeElement();
    }

    let clippedCards = cards.splice(0, count);

    clippedCards.forEach((item) => this._renderFilmCard(filmsContainerElement, item));
  }


  _renderCardInCharts(cards, container, count) {
    const clippedCards = cards.splice(0, count);

    clippedCards.forEach((item) => this._renderFilmCard(container, item));
  }


  _getPopupCard(container, filmCard) {
    const popupCard = new Popup(filmCard);
    const commentTextarea = popupCard.getElement().querySelector(`.film-details__comment-input`);

    const removeCardDetails = () => {
      removeComponent(popupCard.getElement());
      popupCard.removeElement();
      document.removeEventListener(`keydown`, pressEscPopupHandler);
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

    renderComponent(container, popupCard.getElement(), Position.BEFOREEND);
    popupCard.getElement().querySelector(`.film-details__close`).addEventListener(`click`, removeCardDetails);
    document.addEventListener(`keydown`, pressEscPopupHandler);
  }


  _renderPopupCard(cards, container) {
    const clippedCards = cards.splice(0, 1);

    clippedCards.forEach((item) => this._getPopupCard(container, item.popup));
  }
}

export default PageController;
