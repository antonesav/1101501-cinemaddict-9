import {getUserTitle} from '../utils/utils';
import AbstractComponent from '../components/abstract-component.js';
export default class Profile extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }
  getTemplate() {
    return `<section class="header__profile profile">
              <p class="profile__rating">${getUserTitle(this._films.filter((film) => film.isMarkedAsWatched).length)}</p>
              <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
            </section>`.trim();
  }
}
