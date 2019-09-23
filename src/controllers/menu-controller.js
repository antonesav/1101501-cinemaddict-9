import Menu from "../components/menu";
import {Position, renderComponent} from "../util";

class MenuController {
  constructor(container, cards) {
    this._cards = cards;
    this._menu = new Menu([]);
    this._container = container;
  }

  init() {
    this._renderMenu();
  }

  show() {
    this._menu.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._menu.getElement().classList.add(`visually-hidden`);
  }

  _renderMenu() {
    this._menu.removeElement();
    this._menu = new Menu(this._cards);
    renderComponent(this._container, this._menu.getElement(), Position.AFTERBEGIN);
  }
}

export default MenuController;
