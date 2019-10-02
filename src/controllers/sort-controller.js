import Sort from '../components/sort';
import {render} from '../utils';
import {SortName, Position} from '../constants';

class SortController {
  constructor(container, renderFilmsList) {
    this._container = container;
    this._renderFilmsList = renderFilmsList;
    this._sortBlock = new Sort();

    this._films = [];
  }

  init() {
    const onSortBtnClick = (evt) => {
      evt.preventDefault();
      const sortButtons = this._sortBlock.getElement().querySelectorAll(`.sort__button`);
      sortButtons.forEach((sortButton) => {
        sortButton.classList.remove(`sort__button--active`);
      });
      evt.target.classList.add(`sort__button--active`);

      let sortedFilms = [];

      switch (evt.target.dataset.sortType) {
        case SortName.DATE:
          sortedFilms = this._getSortDateUpFilms(this._films);
          break;
        case SortName.RATING:
          sortedFilms = this._getSortByRatingFilms(this._films);
          break;
        case SortName.DEFAULT:
          sortedFilms = this._getSortDefaultFilms(this._films);
          break;
        default:
          throw new Error(`Incorrect dataset`);
      }

      this._renderSortedFilms(sortedFilms);
    };

    this._sortBlock.getElement().querySelectorAll(`.sort__button`).forEach((elemBtnSort) => {
      elemBtnSort.addEventListener(`click`, onSortBtnClick);
    });

    render(this._container.getElement(), this._sortBlock.getElement(), Position.BEFOREBEGIN);
  }

  setFilms(films) {
    this._films = films;
  }

  show() {
    this._sortBlock.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sortBlock.getElement().classList.add(`visually-hidden`);
  }

  _renderSortedFilms(sortedFilms) {
    this._films = [...sortedFilms];
    this._renderFilmsList(this._films);
  }

  _getSortDateUpFilms(films) {
    return films.slice().sort((prevFilm, currFilm) => currFilm.date - prevFilm.date);
  }

  _getSortByRatingFilms(films) {
    return films.slice().sort((prevFilm, currFilm) => currFilm.rating - prevFilm.rating);
  }

  _getSortDefaultFilms(films) {
    return films.slice().sort((prevFilm, currFilm) => Number(prevFilm.id) - Number(currFilm.id));
  }
}

export default SortController;
