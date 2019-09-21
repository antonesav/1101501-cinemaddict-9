import Search from "./components/search";
import User from "./components/user";
import Message from "./components/films-list-empty";
import {mockCards} from "./data";
import {Position} from "./util";
import {renderComponent} from "./util";
import PageController from "./controllers/page-controller";
import MenuController from "./controllers/menu-controller";

const mainElement = document.querySelector(`.main`);
const headerElement = document.querySelector(`.header`);
const footerElement = document.querySelector(`.footer .footer__statistics p`);
footerElement.textContent = `${mockCards().length} movies inside`;

const dataChangeHandler = (newData, oldData) => {
  mockCards[mockCards.findIndex((it) => it === oldData)] = newData;
  // this._menu.removeElement();
  // renderComponent(this._container, this._menu.getElement(), Position.AFTERBEGIN);
}

const pageController = new PageController(mainElement, mockCards());
const menuController = new MenuController(mainElement, mockCards());

menuController.init();
pageController.init();
renderComponent(mainElement, new Message().getElement(), Position.BEFOREEND);
renderComponent(headerElement, new Search().getElement(), Position.BEFOREEND);
renderComponent(headerElement, new User().getElement(), Position.BEFOREEND);
