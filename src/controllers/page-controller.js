import FilmsWrapper from '../components/films-wrapper';
import FilmList from '../components/film-list';
import RatedList from '../components/rated-list';
import CommentedList from '../components/commented-list';
import EmptyData from '../components/empty-data';
import EmptyResult from '../components/empty-result';
import ShowButton from '../components/show-button';
import SortController from './sort-controller';
import FilmListController from './film-list-controller';
import {render, remove} from '../utils';
import {ADD_MORE_CARD, MAX_COUNT_FILMS, Position, RenderPosition} from '../constants';

class PageController {
  constructor(container, popupWrapper, onDataChangeMain, changeCountFilmCards) {
    this._container = container;
    this._popupWrapper = popupWrapper;
    this._onDataChangeMain = onDataChangeMain;
    this._changeCountFilmCards = changeCountFilmCards;

    this._filmsWrapper = new FilmsWrapper();
    this._filmList = new FilmList();
    this._showMoreButton = new ShowButton();
    this._ratedList = new RatedList();
    this._commentedList = new CommentedList();

    this._emptyResult = null;
    this._emptyData = null;
    this._isSearch = false;
    this._isFilter = false;
    this._films = [];
    this._footer = document.querySelector(`.footer`);

    this._onClickShowButton = this._onClickShowButton.bind(this);

    this._showedFilms = null;

    this._sortController = new SortController(this._filmsWrapper, this._renderFilmList.bind(this));
    this._filmListController = new FilmListController(this._filmsWrapper, this._filmList, this._popupWrapper, this._onDataChangeMain);
    this._filmListRatedController = new FilmListController(this._filmsWrapper, this._ratedList, this._popupWrapper, this._onDataChangeMain, RenderPosition.RATED);
    this._filmListCommentedController = new FilmListController(this._filmsWrapper, this._commentedList, this._popupWrapper, this._onDataChangeMain, RenderPosition.COMMENTED);
    this._init();
  }

  hide() {
    this._sortController.hide();
    this._filmsWrapper.getElement().classList.add(`visually-hidden`);
  }

  show(films, isFilter = false) {
    this._isFilter = isFilter;

    if (!this._isSearch) {
      if (films !== this._films) {
        this._setFilms(films);
      }

      this._sortController.setFilms(films);
      this._filmsWrapper.getElement().classList.remove(`visually-hidden`);
    }
  }

  setSearch(isSearch) {
    this._isSearch = isSearch;
  }

  setCountFilmCard(countFilms) {
    this._showedFilms = countFilms;
  }

  _init() {
    render(this._container, this._filmsWrapper.getElement());
    this._sortController.init();
    this._sortController.hide();
    render(this._filmsWrapper.getElement(), this._filmList.getElement());
    render(this._footer, this._popupWrapper.getElement(), Position.AFTEREND);
  }

  _setFilms(films) {
    this._films = films.slice();

    this._renderFilmList(this._films);
  }

  _renderFilmList(films) {
    if (this._emptyResult !== null) {
      remove(this._emptyResult.getElement());
      this._emptyResult.removeElement();
    }

    if (this._emptyData !== null) {
      remove(this._emptyData.getElement());
      this._emptyData.removeElement();
    }
    if (this._isFilter && films.length === 0) {
      this._sortController.hide();
      return this._renderEmptyResult();
    }

    if (!this._isFilter && films.length === 0) {
      this._sortController.hide();
      return this._renderEmptyData();
    }

    this._removeFilmList();
    render(this._filmsWrapper.getElement(), this._filmList.getElement());
    this._sortController.show();

    if (this._showedFilms < films.length) {
      this._renderShowButton();
    }

    this._filmListController.setFilms(films.slice(0, this._showedFilms));
    this._filmListRatedController.setFilms(films.slice(), this._getRatedDataFilms);
    return this._filmListCommentedController.setFilms(films.slice(), this._getCommentedDataFilms);
  }

  _getRatedDataFilms(films) {
    return films.sort((prevFilm, currFilm) => currFilm.rating - prevFilm.rating).slice(0, MAX_COUNT_FILMS);
  }

  _getCommentedDataFilms(films) {
    return films.sort((prevFilm, currFilm) => currFilm.comments.length - prevFilm.comments.length).slice(0, MAX_COUNT_FILMS);
  }

  _renderShowButton() {
    this._showMoreButton.getElement().addEventListener(`click`, this._onClickShowButton);
    render(this._filmList.getElement(), this._showMoreButton.getElement());
  }

  _onClickShowButton(evt) {
    evt.preventDefault();
    this._filmListController.addFilms(this._films.slice(this._showedFilms, this._showedFilms = this._changeCountFilmCards(ADD_MORE_CARD)));
    if (this._showedFilms >= this._films.length) {
      remove(this._showMoreButton.getElement());
      this._showMoreButton.removeElement();
    }
  }

  _renderEmptyResult() {
    this._emptyResult = new EmptyResult();
    this._removeFilmList();
    render(this._filmsWrapper.getElement(), this._emptyResult.getElement());
  }

  _renderEmptyData() {
    this._emptyData = new EmptyData();
    this._removeFilmList();
    render(this._filmsWrapper.getElement(), this._emptyData.getElement());
  }

  _removeFilmList() {
    remove(this._filmList.getElement());
    remove(this._ratedList.getElement());
    remove(this._commentedList.getElement());

    this._filmList.removeElement();
    this._ratedList.removeElement();
    this._commentedList.removeElement();
  }
}

export default PageController;
