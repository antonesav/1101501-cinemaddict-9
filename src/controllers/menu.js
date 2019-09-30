import {Filters, MIN_SEARCH_STRING_LENGTH, Position, Screens, States} from "../utils/constants";
import {removeElement, render} from "../utils/utils";
import Menu from "../components/menu";
import debounce from "lodash.debounce";

export default class MenuController {
  constructor(container, search, searchController, pageController, statisticsController) {
    this._container = container;
    this._search = search;
    this._searchController = searchController;
    this._pageController = pageController;
    this._statisticsController = statisticsController;

    this._cards = [];
    this._menu = new Menu([]);
    this._activeFilter = Filters.ALL;
    this._state = States.VIEW;
    this._previousState = ``;
  }

  init() {
    this._renderMenu();
    const searchInputElement = this._search.getElement().querySelector(`input`);
    const searchResetElement = this._search.getElement().querySelector(`.search__reset`);
    searchInputElement.addEventListener(`keyup`, debounce((evt) => {
      this._showSearchResults(evt);
    }, 300));
    searchResetElement.addEventListener(`click`, () => {
      this._hideSearchResults();
    });
  }

  show(cards) {
    if (this._cards !== cards) {
      this._setFilmCards(cards);
    }

    this._menu.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._menu.getElement().classList.add(`visually-hidden`);
  }

  getState() {
    return this._state;
  }

  _renderMenu() {
    removeElement(this._menu.getElement());
    this._menu.removeElement();
    this._menu = new Menu(this._cards);
    render(this._container, this._menu.getElement(), Position.AFTERBEGIN);
    const activeFilterElement = this._menu.getElement().querySelector(`[data-filter="${this._activeFilter.TYPE}"]`);
    activeFilterElement.classList.add(`main-navigation__item--active`);
    this._menu.getElement().addEventListener(`click`, (evt) => this._onFilterLinkClick(evt));
  }

  _setFilmCards(cards) {
    this._cards = cards;
    this._renderMenu();
    this._pageController.show(this._cards.slice().filter(this._activeFilter.METHOD), false);
  }

  _showSearchResults(evt) {
    if (evt.target.value.length >= MIN_SEARCH_STRING_LENGTH) {
      if (this._state !== States.SEARCH) {
        this._previousState = this._state;
      }

      this._state = States.SEARCH;
      this._searchController.show(this._cards);
      this.hide();
      this._pageController.hide();
      this._statisticsController.hide();
    } else {
      this._hideSearchResults();
    }
  }

  _hideSearchResults() {
    this.show(this._cards);
    this._searchController.hide();
    this._state = this._previousState;

    switch (this._state) {
      case States.VIEW:
        this._pageController.show(this._cards);
        break;
      case States.STATISTIC:
        this._statisticsController.show(this._cards);
        break;
    }
  }

  _onFilterLinkClick(evt) {
    evt.preventDefault();

    if ((evt.target.tagName !== `A`)) {
      return;
    }

    const activeClass = `main-navigation__item--active`;
    const activeFilterElement = this._menu.getElement().querySelector(`.${activeClass}`);
    activeFilterElement.classList.remove(activeClass);
    evt.target.classList.add(activeClass);

    switch (evt.target.dataset.filter) {
      case Filters.ALL.TYPE:
        this._activeFilter = Filters.ALL;
        this._pageController.show(this._cards.slice().filter(Filters.ALL.METHOD));
        break;
      case Filters.IN_WATCHLIST.TYPE:
        this._activeFilter = Filters.IN_WATCHLIST;
        this._pageController.show(this._cards.slice().filter(Filters.IN_WATCHLIST.METHOD), false);
        break;
      case Filters.IS_WATCHED.TYPE:
        this._activeFilter = Filters.IS_WATCHED;
        this._pageController.show(this._cards.slice().filter(Filters.IS_WATCHED.METHOD), false);
        break;
      case Filters.IS_FAVORITE.TYPE:
        this._activeFilter = Filters.IS_FAVORITE;
        this._pageController.show(this._cards.slice().filter(Filters.IS_FAVORITE.METHOD), false);
        break;
    }

    switch (evt.target.dataset.screen) {
      case Screens.FILMS.TYPE:
        this._searchController.hide();
        this._statisticsController.hide();
        this._state = States.VIEW;
        break;
      case Screens.STATS.TYPE:
        this._pageController.hide();
        this._searchController.hide();
        this._statisticsController.show(this._cards);
        this._state = States.STATISTIC;
        break;
    }
  }
}
