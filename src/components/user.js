import {getRandomNumber} from "../util";

export const getUserTemplate = () =>
  `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff ${getRandomNumber(24)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
