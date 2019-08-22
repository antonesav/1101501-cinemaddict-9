import {getMenuTemplate} from "./components/menu";
import {getSearchTemplate} from "./components/search";
import {getDetailsTemplate} from "./components/details";
import {getShowButtonTemplate} from "./components/button";
import {getSortTemplate} from "./components/sort";
import {getUserTemplate} from "./components/user";
import {getFilmListTemplate} from "./components/films-list";
import {mockCards} from "./data";

import {Position} from "./util";
// import {createElement} from "./util";
// import {unrender} from "./util";
// import {getCard} from "./data";
import {renderUtil} from "./util";

import {Card} from "./components/card";

const DEFAULT_CARD_SHOW = 5;
const CARDS_COUNT_ON_CLICK = 5;
const CARD_COUNT_CATEGORY = 2;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer .footer__statistics p`);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// СЛУШАЕМ КЛИК НА КАРТОЧКУ
const clickCardHandler = () => {
  getPopupCard(mockCards(), mainElement, 1);
  closeDetail();
};

const renderFilmCard = (container, filmCardMock) => {
  const filmCard = new Card(filmCardMock);

  renderUtil(container, filmCard.getElement(), Position.BEFOREEND);
  filmCard.getElement().addEventListener(`click`, clickCardHandler);
};

// ОТРИСОВКА КАРТОЧЕК ФИЛЬМОВ В СПИСКЕ
const renderCards = (arrayFilms) => {
  let cardsShow = 0;
  let cards = arrayFilms;

  return {
    render: (count) => {
      if (count >= cards.length) {
        count = cards.length;
        document.querySelector(`.films-list__show-more`).remove();
      }

      let arraySplice = cards.splice(0, count);

      arraySplice.forEach((item) => renderFilmCard(filmsContainerElement, item));
      cardsShow += count;
    },

    getVisible: () => cardsShow,

    getLength: () => cards.length,

    getAll: () => cards
  };
};

// ОТРИСОВКА ПОПАПА
const getPopupCard = (arrayCards, container, count) => {
  const arraySplice = arrayCards.splice(0, count);

  arraySplice.forEach((item) => container.insertAdjacentHTML(`beforeend`, getDetailsTemplate(item.popup)));
};

// КАРТОЧКИ В КАТЕГОРИЯХ
const renderCardInCharts = (arrayCards, container, count) => {
  const arraySplice = arrayCards.splice(0, count);

  arraySplice.forEach((item) => renderFilmCard(container, item));
};

const cardsList = renderCards(mockCards());

render(mainElement, getMenuTemplate(cardsList.getAll()), `beforeend`);
render(mainElement, getSortTemplate(), `beforeend`);
render(mainElement, getFilmListTemplate(), `beforeend`);

footerElement.textContent = `${renderCards(mockCards()).getLength()} movies inside`;

// ОТРИСОВЫВАЕМ КАРТОЧКИ ПРИ КЛИКЕ НА КНОПКУ
const onLoadClick = () => {
  cardsList.render(CARDS_COUNT_ON_CLICK);
};

const filmsListElement = document.querySelector(`.films-list`);
const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsContainerElement = document.querySelector(`.films-list__container`);

render(headerElement, getSearchTemplate(), `beforeend`);
render(headerElement, getUserTemplate(), `beforeend`);

// ОТРИСОВЫВАЕМ КАРТОЧКИ В КАТЕГОРИЯХ
filmsListExtraElements.forEach((item) => {
  renderCardInCharts(mockCards(), item, CARD_COUNT_CATEGORY);
});

cardsList.render(DEFAULT_CARD_SHOW);

render(filmsListElement, getShowButtonTemplate(), `beforeend`);

document.querySelector(`.films-list__show-more`).addEventListener(`click`, onLoadClick);

// СЛУШАЕМ КЛИК ПО КРЕСТИКУ В POPUP
const closePopup = () => {
  const filmPopup = document.querySelector(`.film-details`);
  filmPopup.remove();
  document.removeEventListener(`keydown`, pressEscPopupHandler);
};

const pressEscPopupHandler = (evt) => {
  if (evt.keyCode === 27) {
    closePopup();
  }
};

// УДАЛЯЕМ ПОПАП И СОБЫТИЯ
const closeDetail = () => {
  const filmPopupClose = document.querySelector(`.film-details__close`);
  filmPopupClose.addEventListener(`click`, closePopup);
  document.addEventListener(`keydown`, pressEscPopupHandler);
};
