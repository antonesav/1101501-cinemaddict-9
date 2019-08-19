import {getMenuTemplate} from "./components/menu";
import {getSearchTemplate} from "./components/search";
import {getCardTemplate} from "./components/card";
import {getDetailsTemplate} from "./components/details";
import {getShowButtonTemplate} from "./components/button";
import {getSortTemplate} from "./components/sort";
import {getUserTemplate} from "./components/user";
import {getFilmListTemplate} from "./components/films-list";
import {mockCards} from "./data";

const DEFAULT_CARD_SHOW = 5;
const CARDS_COUNT_ON_CLICK = 5;
const CARD_COUNT_CATEGORY = 2;

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer .footer__statistics p`);

const renderCards = (arrayTasks) => {
  let cardsShow = 0;
  let cards = arrayTasks;

  return {
    render: (container, count) => {
      if (count >= cards.length) {
        count = cards.length;
        document.querySelector(`.films-list__show-more`).remove();
      }

      let arraySplice = cards.splice(0, count);

      arraySplice.map((item) => container.insertAdjacentHTML(`beforeend`, getCardTemplate(item)));
      cardsShow += count;
    },

    renderPopup: (container, count) => {
      let arraySplice = cards.splice(0, count);

      arraySplice.map((item) => container.insertAdjacentHTML(`beforeend`, getDetailsTemplate(item.popup)));
    },

    renderCharts: (container, count) => {
      let arraySplice = cards.splice(0, count);

      arraySplice.map((item) => container.insertAdjacentHTML(`beforeend`, getDetailsTemplate(item)));
    },

    getVisible: () => cardsShow,

    getLength: () => cards.length,

    getAll: () => cards
  };
};

const cardsList = renderCards(mockCards());
const cardsCharts = renderCards(mockCards());
const cardPopup = renderCards(mockCards());
footerElement.textContent = `${renderCards(mockCards()).getLength()} movies inside`;

const onLoadClick = () => {
  cardsList.render(filmsContainerElement, CARDS_COUNT_ON_CLICK);
};

mainElement.insertAdjacentHTML(`beforeend`, getMenuTemplate(cardsList.getAll()));
mainElement.insertAdjacentHTML(`beforeend`, getSortTemplate());

mainElement.insertAdjacentHTML(`beforeend`, getFilmListTemplate());

cardPopup.renderPopup(mainElement, 1);

headerElement.insertAdjacentHTML(`beforeend`, getSearchTemplate());
headerElement.insertAdjacentHTML(`beforeend`, getUserTemplate());

const filmsListElement = document.querySelector(`.films-list`);
const filmsListExtraElements = document.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsContainerElement = document.querySelector(`.films-list__container`);

filmsListExtraElements.forEach((item) => {
  cardsCharts.render(item, CARD_COUNT_CATEGORY);
});

cardsList.render(filmsContainerElement, DEFAULT_CARD_SHOW);
filmsListElement.insertAdjacentHTML(`beforeend`, getShowButtonTemplate());
document.querySelector(`.films-list__show-more`).addEventListener(`click`, onLoadClick);
