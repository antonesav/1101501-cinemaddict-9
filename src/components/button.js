import {createElement} from "../util";

class Button {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export default Button;
