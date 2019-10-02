import Menu from '../components/menu';
import {NAME_FILTERS, COUNT_FILM_CARDS, MenuName, Position, MenuFilter} from '../constants';
import {render, remove, getDataFilter} from '../utils';

class MenuController {
  constructor(container, pageController, searchController, chartController, changeCountFilmCards, changeCurrentMenu) {
    this._container = container;
    this._pageController = pageController;
    this._searchController = searchController;
    this._chartController = chartController;
    this._changeCountFilmCards = changeCountFilmCards;
    this._changeCurrentMenu = changeCurrentMenu;

    this._isSearch = false;
    this._menu = null;
    this._currentMenu = null;
    this._dataFilters = {};
    this._films = [];
  }

  show(films) {
    if (!this._isSearch) {
      if (films !== this._films) {
        this._setFilms(films);
      }
    }
  }

  setSearch(isSearch) {
    this._isSearch = isSearch;
  }

  hide() {
    remove(this._menu.getElement());
    this._menu.removeElement();
  }

  _setFilms(films) {
    this._films = films.slice();

    this._renderMenu(this._films);
  }

  _renderMenu(films) {
    this._dataFilters = NAME_FILTERS.map((filter) => getDataFilter(filter, films));

    if (this._menu !== null) {
      this.hide();
    }

    this._menu = new Menu(this._dataFilters);

    this._init();
  }

  _disactivateAllMenuElement() {
    this._menu.getElement().querySelectorAll(`.main-navigation__item`)
    .forEach((elem) => {
      elem.classList.remove(`main-navigation__item--active`);
    });
  }

  _getActiveMenuElement(evt) {
    this._disactivateAllMenuElement();
    evt.target.classList.add(`main-navigation__item--active`);
  }

  _changeFilter(evt, filterName, menuNameItem) {
    this._getActiveMenuElement(evt);
    this._changeCountFilmCards(null);
    this._showFilteredMenu(filterName, menuNameItem);
  }

  _changeCurrentFilter(currentMenu) {
    this._disactivateAllMenuElement();
    this._menu.getElement().querySelector(`.main-navigation__item[href="#${currentMenu.menuName}"]`).classList.add(`main-navigation__item--active`);
    this._showFilteredMenu(currentMenu.filterName, currentMenu.menuName);
  }

  _showFilteredMenu(filterName, menuNameItem) {
    const filteredFilmCards = this._films.slice().filter((elem) => elem[filterName]);
    this._pageController.setCountFilmCard(COUNT_FILM_CARDS);
    this._currentMenu = this._changeCurrentMenu(filterName, menuNameItem);
    this._pageController.show(filteredFilmCards, true);
  }

  _renderFilterData(evt, filterName, menuNameItem) {
    this._chartController.hide();
    this._searchController.hide();
    this._changeFilter(evt, filterName, menuNameItem);
  }

  _renderAllMovies(evt) {
    this._getActiveMenuElement(evt);
    this._chartController.hide();
    this._searchController.hide();
    this._pageController.setCountFilmCard(COUNT_FILM_CARDS);
    this._changeCountFilmCards(null);
    this._currentMenu = null;
    this._pageController.show(this._films);
  }

  _renderStatistics(evt) {
    this._getActiveMenuElement(evt);
    this._pageController.hide();
    this._searchController.hide();
    this._currentMenu = null;
    this._chartController.show(this._films);
  }

  _init() {
    if (this._currentMenu !== null) {
      this._changeCurrentFilter(this._currentMenu);
    }

    const onMenuElemClick = (evt) => {
      evt.preventDefault();
      if (!evt.target.classList.contains(`main-navigation__item`)) {
        return;
      }

      switch (evt.target.hash.slice(1)) {
        case MenuName.ALL:
          this._renderAllMovies(evt);
          break;
        case MenuName.WATCHLIST:
          this._renderFilterData(evt, MenuFilter.IS_WATCHLIST, MenuName.WATCHLIST);
          break;
        case MenuName.HISTORY:
          this._renderFilterData(evt, MenuFilter.IS_VIEWED, MenuName.HISTORY);
          break;
        case MenuName.FAVORITES:
          this._renderFilterData(evt, MenuFilter.IS_FAVORITE, MenuName.FAVORITES);
          break;
        case MenuName.STATS:
          this._renderStatistics(evt);
          break;
        default:
          break;
      }
    };

    this._menu.getElement().addEventListener(`click`, onMenuElemClick);

    render(this._container, this._menu.getElement(), Position.AFTERBEGIN);
  }
}

export default MenuController;
