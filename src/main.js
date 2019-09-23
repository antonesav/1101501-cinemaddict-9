import Search from "./components/search";
import User from "./components/user";
import Message from "./components/films-list-empty";
import {mockCards} from "./data";
import {Position} from "./util";
import {renderComponent} from "./util";
import PageController from "./controllers/page-controller";
import MenuController from "./controllers/menu-controller";
import StatisticController from "./controllers/statistic-controller";

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer .footer__statistics p`);
footerElement.textContent = `${mockCards().length} movies inside`;

const cards = mockCards();

const dataChangeHandler = (newData, oldData) => {
  cards[cards.findIndex((it) => it === oldData)] = newData;
  menuController.init();
  // this._menu.removeElement();
  // renderComponent(this._container, this._menu.getElement(), Position.AFTERBEGIN);
};

const searchElement = new Search();
const pageController = new PageController(mainElement, cards, dataChangeHandler);
const menuController = new MenuController(mainElement, cards, dataChangeHandler);
const statisticController = new StatisticController(mainElement);

menuController.init();
pageController.init();
statisticController.init();
renderComponent(mainElement, new Message().getElement(), Position.BEFOREEND);
renderComponent(headerElement, searchElement.getElement(), Position.BEFOREEND);
renderComponent(headerElement, new User().getElement(), Position.BEFOREEND);

document.querySelector(`.main-navigation`).addEventListener(`click`, function (evt) {
  evt.preventDefault();
  switch (evt.target.dataset.label) {
    case `all-films`:
      pageController.show(cards);
      statisticController.hide();
      break;
    case `stats`:
      pageController.hide();
      statisticController.show();
      break;
  }
});
