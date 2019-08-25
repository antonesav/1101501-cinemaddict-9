import {removeComponent, renderComponent} from "./util";
import {Position} from "./util";
import Card from "./components/card";
import Button from "./components/button";
import FilmList from "./components/films-list";
import Popup from "./components/details";
import {ESC_KEY} from "./util";

const DEFAULT_CARD_SHOW = 5;
const CARDS_COUNT_ON_CLICK = 5;
const CARD_COUNT_CATEGORY = 2;

class PageController {
  constructor(mainContainer, cards) {
    this._container = mainContainer;
    this._cards = cards;
    this._buttonShowMore = new Button();
    this._filmList = new FilmList();
    this._copyCards = cards.slice();
  }

  init() {
    const cardsList = this._renderCards(this._cards);

    renderComponent(this._container, this._filmList.getElement(), Position.BEFOREEND);

    const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

    const filmsListElement = this._filmList.getElement().querySelector(`.films-list`);

    cardsList.render(DEFAULT_CARD_SHOW);

    filmsListExtraElements.forEach((item) => {
      this._renderCardInCharts(this._copyCards, item, CARD_COUNT_CATEGORY);
    });

    renderComponent(filmsListElement, this._buttonShowMore.getElement(), Position.BEFOREEND);

    const onLoadClick = () => {
      cardsList.render(CARDS_COUNT_ON_CLICK);
    };

    this._buttonShowMore.getElement().addEventListener(`click`, onLoadClick);
  }


  _renderFilmCard(container, filmCardMock) {
    const cardComponent = new Card(filmCardMock);

    renderComponent(container, cardComponent.getElement(), Position.BEFOREEND);

    const clickCardHandler = () => {
      this._renderPopupCard(this._copyCards, this._container, 1);
    };

    cardComponent.getElement().addEventListener(`click`, clickCardHandler);
  }


  _renderCards(arrayFilms) {
    const filmsContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);

    let cardsShow = 0;
    let cards = arrayFilms;

    return {
      render: (count) => {
        if (count >= cards.length) {
          count = cards.length;
          removeComponent(this._buttonShowMore.getElement());
          this._buttonShowMore.removeElement();
        }

        let arraySplice = cards.splice(0, count);

        arraySplice.forEach((item) => this._renderFilmCard(filmsContainerElement, item));
        cardsShow += count;
      },

      getVisible: () => cardsShow,

      getLength: () => cards.length,

      getAll: () => cards
    };
  }


  _renderCardInCharts(cards, container, count) {
    const arraySplice = cards.splice(0, count);

    arraySplice.forEach((item) => this._renderFilmCard(container, item));
  }


  _getPopupCard(container, filmCardMock) {
    const popupCard = new Popup(filmCardMock);
    const commentTextarea = popupCard.getElement().querySelector(`.film-details__comment-input`);

    const removePopup = () => {
      removeComponent(popupCard.getElement());
      popupCard.removeElement();
      document.removeEventListener(`keydown`, pressEscPopupHandler);
    };

    const pressEscPopupHandler = (evt) => {
      if (evt.keyCode === ESC_KEY) {
        removePopup();
      }
    };

    commentTextarea.addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, pressEscPopupHandler);
    });

    commentTextarea.addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, pressEscPopupHandler);
    });

    renderComponent(container, popupCard.getElement(), Position.BEFOREEND);
    popupCard.getElement().querySelector(`.film-details__close`).addEventListener(`click`, removePopup);
    document.addEventListener(`keydown`, pressEscPopupHandler);
  }


  _renderPopupCard(cards, container, count) {
    const arraySplice = cards.splice(0, count);

    arraySplice.forEach((item) => this._getPopupCard(container, item.popup));
  }
}

export default PageController;
