import {createElement} from "../utils/utils";
export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstactComponent, only concrete one.`);
    }
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  removeElement() {
    if (this._element) {
      this._element = null;
    }
    return this._element;
  }

  getTemplate() {
    throw Error(`Abstract method not implemented`);
  }
}
