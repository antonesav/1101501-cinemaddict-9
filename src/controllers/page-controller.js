import {renderComponent} from "../util";
import {Position} from "../util";
import Card from "../components/card";
import Button from "../components/button";
import FilmList from "../components/films-list";
import Sort from "../components/sort";
import MovieController from "./movie-controller";
import Menu from "../components/menu";
import Statistic from "../components/statistic";
import FilmController from "./film-controller";

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
    this._statistic = new Statistic();
    this._filmListContainerElement = this._filmList.getElement().querySelector(`.films-list__container`);
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
  }

  init() {

    renderComponent(this._container, this._menu.getElement(), Position.BEFOREEND);

    renderComponent(this._container, this._sort.getElement(), Position.BEFOREEND);

    renderComponent(this._container, this._filmList.getElement(), Position.BEFOREEND);

    const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

    const filmsListElement = this._filmList.getElement().querySelector(`.films-list`);

    this._renderCardsInList(this._cards, FILMLIST_CARD_COUNT);

    // this._renderCards(this._cards, FILMLIST_CARD_COUNT);

    // filmsListExtraElements.forEach((item) => {
    //   this._renderCardInCharts(this._cards, item, CATEGORY_CARD_COUNT);
    // });

    renderComponent(filmsListElement, this._buttonShowMore.getElement(), Position.BEFOREEND);

    renderComponent(this._container, this._statistic.getElement(), Position.BEFOREEND);

    const onLoadClick = () => {
      this._renderCardsInList(this._cards, FILMLIST_CARD_COUNT);
    };

    this._buttonShowMore.getElement().addEventListener(`click`, onLoadClick);
    //
    // this._sort.getElement().addEventListener(`click`, (evt) => this._sortLinkClickHandler(evt));

    this._menu.getElement().querySelector(`.main-navigation__item--additional`).
    addEventListener(`click`, (evt) => {
      evt.preventDefault();
      this._statistic.getElement().classList.toggle(`visually-hidden`);
    });
  }

  // ОСТАВИМ МЕТОД ДЛЯ ОТРИСОВКИ КАРТОЧЕК В КАТЕГОРИЯХ С ПОМОЩЬЮ FILM-CONTROLLER
  // _renderCardInCharts(cards, container, cardsQuantity) {
  //   const addedCardsQuantity = this._cardsShownInCategory + cardsQuantity;
  //   const clippedCards = cards.slice(this._cardsShownInCategory, addedCardsQuantity);
  //
  //   clippedCards.forEach((item) => this._renderFilmCard(container, item));
  //   this._cardsShownInCategory += cardsQuantity;
  // }

  // ОСТАВИМ ЗДЕСЬ ТОЛЬКО ИЗМЕНЕНИЕ ДАННЫХ
  _dataChangeHandler(newData, oldData) {
    this._cards[this._cards.findIndex((it) => it === oldData)] = newData;
    this._copyCards[this._copyCards.findIndex((it) => it === oldData)] = newData;
    this._reRenderCards();
    // this._reRenderCharts(this._cards);
    // this._menu.removeElement();
    // renderComponent(this._container, this._menu.getElement(), Position.AFTERBEGIN);
  }

  // ОСТАВИМ МЕТОД ДЛЯ ПЕРЕОТРИСОВКИ КАРТОЧЕК В FILM-LIST С ПОМОЩЬЮ FILM-CONTROLLER
  _reRenderCards() {
    this._filmListContainerElement.innerHTML = ``;
    return new FilmController(this._filmListContainerElement, this._cards, this._dataChangeHandler);
  }


  // Общая ф-я рендера карточек
  _renderCards(container, cards) {
    // const addedCardsQuantity = this._cardsShownInList + cardsQuantity;
    return new FilmController(container, cards, this._dataChangeHandler);
  }


  // Отрисовываем карточки в FILM_LIST
  _renderCardsInList(cards, cardsQuantity) {
    const addedCardsQuantity = this._cardsShownInList + cardsQuantity;
    const currentCards = cards.slice(this._cardsShownInList, addedCardsQuantity);
    this._renderCards(this._filmListContainerElement, currentCards);
  }

  // _reRenderCharts(cards) {
  //   const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
  //   filmsListExtraElements.forEach((item) => {
  //     item.innerHTML = ``;
  //     this._renderCardInCharts(cards, item, CATEGORY_CARD_COUNT);
  //   });
  // }


  // _sortLinkClickHandler(evt) {
  //   evt.preventDefault();
  //   if (evt.target.tagName === `A`) {
  //     let sortCards;
  //
  //     switch (evt.target.dataset.sortType) {
  //       case `date`:
  //         sortCards = this._cards.sort((a, b) => a.year - b.year);
  //         break;
  //       case `rating`:
  //         sortCards = this._cards.sort((a, b) => b.rating - a.rating);
  //         break;
  //       case `default`:
  //         sortCards = this._copyCards.slice();
  //         break;
  //     }
  //     this._reRenderCards(sortCards, this._filmListContainerElement);
  //   }
  // }
}

export default PageController;
