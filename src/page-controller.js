import {renderComponent} from "./util";
import {Position} from "./util";
import Card from "./components/card";
import Button from "./components/button";
import FilmList from "./components/films-list";
import Popup from "./components/details";
import Sort from "./components/sort";
import {ESC_KEY} from "./util";

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
  }

  init() {

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

    const clickCardHandler = () => {
      this._renderPopupCard(filmCard, this._container);
    };

    cardComponent.getElement().addEventListener(`click`, clickCardHandler);
  }


  _renderCards(films, count) {
    const filmsContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);

    if (count >= (films.length - this._cardsShownInList)) {
      count = films.length;
      this._buttonShowMore.removeElement();
    }

    const clippedCards = films.slice(this._cardsShownInList, (this._cardsShownInList + count));
    clippedCards.forEach((item) => this._renderFilmCard(filmsContainerElement, item));
    this._cardsShownInList += count;
  }


  _renderCardInCharts(cards, container, count) {
    const clippedCards = cards.slice(this._cardsShownInCategory, (this._cardsShownInCategory + count));

    clippedCards.forEach((item) => this._renderFilmCard(container, item));
    this._cardsShownInCategory += count;
  }


  _getPopupCard(container, filmCard) {
    const popupCard = new Popup(filmCard);
    const commentTextarea = popupCard.getElement().querySelector(`.film-details__comment-input`);

    const removeCardDetails = () => {
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
    this._getPopupCard(container, cards.popup);
  }


  _sortLinkClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A`) {
      const filmListContainer = this._filmList.getElement().querySelector(`.films-list__container`);
      filmListContainer.innerHTML = ``;

      const renderSortCards = (cards) => {
        cards.forEach((item, index) => {
          if (index < this._cardsShownInList) {
            this._renderFilmCard(filmListContainer, item);
          }
        });
      };

      switch (evt.target.dataset.sortType) {
        case `date`:
          let sortByDateCards = this._cards.sort((a, b) => a.year - b.year);
          renderSortCards(sortByDateCards);
          break;
        case `rating`:
          let sortByRatingCards = this._cards.sort((a, b) => b.rating - a.rating);
          renderSortCards(sortByRatingCards);
          break;
        case `default`:
          this._cards = this._copyCards.slice();
          renderSortCards(this._cards);
          break;
      }
    }
  }
}

export default PageController;
