import {getRandomNumber} from "../util";
import {createElement} from "../util";

class User {
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
    return `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff ${getRandomNumber(24)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
  }
}

export default User;
