import {getMenuTemplate} from "./components/menu";
import {getSearchTemplate} from "./components/search";
import {getCardTemplate} from "./components/card";
import {getDetailsTemplate} from "./components/details";
import {getShowButtonTemplate} from "./components/button";
import {getSortTemplate} from "./components/sort";
import {getUserTemplate} from "./components/user";
import {getFilmListTemplate} from "./components/films-list";

const LISTS = {
  default: 0,
  mainList: 5,
  category: 2
};
const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);

const fragmentElement = document.createDocumentFragment();
const renderComponent = (container, component, repeat = LISTS.default) => {
  const divElement = document.createElement(`div`);
  if (repeat) {
    for (let i = 0; i < repeat; i++) {
      divElement.innerHTML = component;
      container.appendChild(divElement.firstElementChild);
    }
  } else {
    divElement.innerHTML = component;
    container.appendChild(divElement.firstElementChild);
  }
};
renderComponent(headerElement, getSearchTemplate());
renderComponent(headerElement, getUserTemplate());

renderComponent(fragmentElement, getMenuTemplate());
renderComponent(fragmentElement, getSortTemplate());
renderComponent(fragmentElement, getFilmListTemplate());
renderComponent(fragmentElement, getDetailsTemplate());

const filmsListElement = fragmentElement.querySelector(`.films-list`);
const filmsListExtraElements = fragmentElement.querySelectorAll(`.films-list--extra .films-list__container`);
const filmsContainerElement = fragmentElement.querySelector(`.films-list__container`);

filmsListExtraElements.forEach((item) =>
  renderComponent(item, getCardTemplate(), LISTS.category));

renderComponent(filmsContainerElement, getCardTemplate(), LISTS.mainList);
renderComponent(filmsListElement, getShowButtonTemplate());

mainElement.appendChild(fragmentElement);
