import Statistic from "../components/statistic";
import {Position, renderComponent} from "../util";

class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = new Statistic();
  }

  init() {
    renderComponent(this._container, this._statistic.getElement(), Position.BEFOREEND);
  }

  show() {
    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
  }
}

export default StatisticController;
