import {Filters, Screens} from "../utils/constants";
import AbstractComponent from "./abstract-component";

export default class Menu extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item" data-screen="${Screens.FILMS.TYPE}" data-filter="${Filters.ALL.TYPE}" >All movies</a>
    <a href="#watchlist" class="main-navigation__item" data-screen="${Screens.FILMS.TYPE}" data-filter="${Filters.IN_WATCHLIST.TYPE}">Watchlist <span class="main-navigation__item-count">${this._cards.filter((card) => card.inWatchlist).length}</span></a>
    <a href="#history" class="main-navigation__item" data-screen="${Screens.FILMS.TYPE}" data-filter="${Filters.IS_WATCHED.TYPE}">History <span class="main-navigation__item-count">${this._cards.filter((card) => card.isWatched).length}</span></a>
    <a href="#favorites" class="main-navigation__item" data-screen="${Screens.FILMS.TYPE}" data-filter="${Filters.IS_FAVORITE.TYPE}">Favorites <span class="main-navigation__item-count">${this._cards.filter((card) => card.isFavorite).length}</span></a>
    <a href="#stats" class="main-navigation__item main-navigation__item--additional" data-screen="${Screens.STATS.TYPE}">Stats</a>
  </nav>`;
  }
}
