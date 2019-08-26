import Menu from "./components/menu";
import Card from "./components/card";
import Popup from "./components/details";
import Button from "./components/button";
import Search from "./components/search";
import Sort from "./components/sort";
import User from "./components/user";
import FilmList from "./components/films-list";
import Message from "./components/films-list-empty";
import {mockCards} from "./data";
import {Position} from "./util";
import {removeComponent} from "./util";
import {renderComponent} from "./util";

const DEFAULT_CARD_SHOW = 5;
const CARDS_COUNT_ON_CLICK = 5;
const CARD_COUNT_CATEGORY = 2;

const buttonShowMore = new Button();

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer .footer__statistics p`);


// СЛУШАЕМ КЛИК НА КАРТОЧКУ
const clickCardHandler = () => {
  renderPopupCard(mockCards(), mainElement, 1);
};


const renderFilmCard = (container, filmCardMock) => {
  const filmCard = new Card(filmCardMock);

  renderComponent(container, filmCard.getElement(), Position.BEFOREEND);
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
        removeComponent(buttonShowMore.getElement());
        buttonShowMore.removeElement();
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


// Генерируем попап и вешаем события закрытия попапа
const getPopupCard = (container, filmCardMock) => {
  const popupCard = new Popup(filmCardMock);
  const commentTextarea = popupCard.getElement().querySelector(`.film-details__comment-input`);

  const removePopup = () => {
    removeComponent(popupCard.getElement());
    popupCard.removeElement();
    document.removeEventListener(`keydown`, pressEscPopupHandler);
  };

  const pressEscPopupHandler = (evt) => {
    if (evt.keyCode === 27) {
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
};


// ОТРИСОВКА ПОПАПА
const renderPopupCard = (arrayCards, container, count) => {
  const arraySplice = arrayCards.splice(0, count);

  arraySplice.forEach((item) => getPopupCard(container, item.popup));
};


// КАРТОЧКИ В КАТЕГОРИЯХ
const renderCardInCharts = (arrayCards, container, count) => {
  const arraySplice = arrayCards.splice(0, count);

  arraySplice.forEach((item) => renderFilmCard(container, item));
};


const cardsList = renderCards(mockCards());


renderComponent(mainElement, new Menu(cardsList.getAll()).getElement(), Position.BEFOREEND);
renderComponent(mainElement, new Sort().getElement(), Position.BEFOREEND);
renderComponent(mainElement, new FilmList().getElement(), Position.BEFOREEND);
renderComponent(mainElement, new Message().getElement(), Position.BEFOREEND);


footerElement.textContent = `${renderCards(mockCards()).getLength()} movies inside`;


// ОТРИСОВЫВАЕМ КАРТОЧКИ ПРИ КЛИКЕ НА КНОПКУ
const onLoadClick = () => {
  cardsList.render(CARDS_COUNT_ON_CLICK);
};


const filmsListElement = document.querySelector(`.films-list`);
const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsContainerElement = document.querySelector(`.films-list__container`);


renderComponent(headerElement, new Search().getElement(), Position.BEFOREEND);
renderComponent(headerElement, new User().getElement(), Position.BEFOREEND);


// ОТРИСОВЫВАЕМ КАРТОЧКИ В КАТЕГОРИЯХ
filmsListExtraElements.forEach((item) => {
  renderCardInCharts(mockCards(), item, CARD_COUNT_CATEGORY);
});


cardsList.render(DEFAULT_CARD_SHOW);


renderComponent(filmsListElement, buttonShowMore.getElement(), Position.BEFOREEND);
buttonShowMore.getElement().addEventListener(`click`, onLoadClick);
