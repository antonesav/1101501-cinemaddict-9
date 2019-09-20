import Menu from "../components/menu";
import {Position, renderComponent} from "../util";

class MenuController {
  constructor(container, cards) {
    this._cards = cards;
    this._menu = new Menu(cards);
    this._container = container;
  }

  init() {
    renderComponent(this._container, this._menu.getElement(), Position.BEFOREEND);
  }
}

export default MenuController;
