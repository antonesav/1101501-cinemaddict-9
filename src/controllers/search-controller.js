import SearchInfo from '../components/search-info';
import EmptyResult from '../components/empty-result';
import FilmsWrapper from '../components/films-wrapper';
import FilmList from '../components/film-list';
import FilmListController from './film-list-controller';
import {render, remove} from '../utils';
import {MIN_SEARCH_SYMBOLS, Position} from '../constants';

class SearchController {
  constructor(container, popupWrapper, search, onDataChangeMain, onSearchCloseButtonClick) {
    this._container = container;
    this._popupWrapper = popupWrapper;
    this._search = search;
    this._onDataChangeMain = onDataChangeMain;
    this._onSearchCloseButtonClick = onSearchCloseButtonClick;

    this._films = [];
    this._isSearch = false;
    this._emptyResult = null;

    this._filmsSearchWrapper = new FilmsWrapper();
    this._filmSearchList = new FilmList();
    this._searchInfo = new SearchInfo({});

    this._filmListController = new FilmListController(this._filmsSearchWrapper, this._filmSearchList, this._popupWrapper, this._onDataChangeMain);

    this._init();
    this.hide();
  }

  hide() {
    this._removeFindedFilmsWrapper();
  }

  show(films) {
    if (this._isSearch) {
      this._films = films.slice();
      const value = this._search.getElement().querySelector(`.search__field`).value;

      this._renderFindedFilmsWrapper();
      const filteredFilms = this._getSearchedFilms(value);
      this._showSearchResult(value, filteredFilms);
    }
  }

  setSearch(isSearch) {
    this._isSearch = isSearch;
  }

  _getSearchedFilms(value) {
    return this._films.filter((film) => {
      return film.title.toLowerCase().includes(value.toLowerCase());
    });
  }

  _init() {
    render(this._container, this._searchInfo.getElement());
    this._renderFindedFilmsWrapper();

    const onSearchResetBtnClick = () => {
      this._search.getElement().querySelector(`.search__field`).value = ``;
      this._onSearchCloseButtonClick();
    };

    const onSearchInputKeyUp = (evt) => {
      const {value} = evt.target;
      if (value.length >= MIN_SEARCH_SYMBOLS) {
        const films = this._films.filter((film) => {
          return film.title.includes(value);
        });
        this._showSearchResult(value, films);
      }
    };

    this._search.getElement().querySelector(`.search__reset`)
      .addEventListener(`click`, onSearchResetBtnClick);

    this._search.getElement().querySelector(`.search__field`)
      .addEventListener(`keyup`, onSearchInputKeyUp);
  }

  _showSearchResult(_, films) {
    if (this._searchInfo) {
      remove(this._searchInfo.getElement());
      this._searchInfo.removeElement();
    }

    this._searchInfo = new SearchInfo({count: films.length});

    render(this._container, this._searchInfo.getElement(), Position.AFTERBEGIN);

    if (this._emptyResult !== null) {
      remove(this._emptyResult.getElement());
      this._emptyResult.removeElement();
    }

    if (films.length === 0) {
      return this._renderEmptyResult();
    }

    this._removeFindedFilmsWrapper();
    render(this._container, this._searchInfo.getElement());
    this._renderFindedFilmsWrapper();
    return this._filmListController.setFilms(films);
  }

  _renderFindedFilmsWrapper() {
    render(this._container, this._filmsSearchWrapper.getElement());
    render(this._filmsSearchWrapper.getElement(), this._filmSearchList.getElement());
  }

  _renderFilmsList(films) {
    this._removeFindedFilmsWrapper();
    render(this._container, this._searchInfo.getElement());
    this._renderFindedFilmsWrapper();

    this._filmListController.setFilms(films);
  }

  _renderEmptyResult() {
    this._emptyResult = new EmptyResult();
    this._removeFindedFilmsWrapper();
    this._renderFindedFilmsWrapper();
    render(this._filmSearchList.getElement(), this._emptyResult.getElement());
  }

  _removeFindedFilmsWrapper() {
    remove(this._filmSearchList.getElement());
    remove(this._filmsSearchWrapper.getElement());
    remove(this._searchInfo.getElement());
    this._searchInfo.removeElement();
    this._filmSearchList.removeElement();
    this._filmsSearchWrapper.removeElement();
  }
}

export default SearchController;
