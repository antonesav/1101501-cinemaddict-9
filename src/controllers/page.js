import {FILMS_AMOUNT, CATEGORY_FILMS_AMOUNT, ListTitles, Sorting, Position} from "../utils/constants";
import {render, removeElement} from "../utils/utils";
import FilmCardsController from "./film-cards";
import Sort from "../components/sort";
import Films from "../components/films";
import FilmsList from "../components/films-list";
import NoFilms from "../components/no-films";
import ShowMoreButton from "../components/show-more-button";

export default class PageController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._generalAmount = FILMS_AMOUNT;
    this._categoryAmount = CATEGORY_FILMS_AMOUNT;
    this._activeSort = Sorting.BY_DEFAULT;
    this._cards = [];
    this._sortedCards = [];
    this._sort = new Sort();
    this._films = new Films();
    this._generalFilmsList = new FilmsList(false, ListTitles.GENERAL);
    this._topRatedFilmsList = new FilmsList(true, ListTitles.TOP_RATED);
    this._mostCommentedFilmsList = new FilmsList(true, ListTitles.MOST_COMMENTED);
    this._noFilms = new NoFilms();
    this._showMoreButton = new ShowMoreButton();
    this._filmCardsController = new FilmCardsController(null, this._onDataChange.bind(this));
  }

  init() {
    render(this._container, this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
    this._sort.getElement().classList.add(`visually-hidden`);
    render(this._container, this._films.getElement());
  }

  show(cards, withCategories) {
    if (this._cards !== cards) {
      this._setFilmCards(cards, withCategories);
    }

    this._sort.getElement().classList.remove(`visually-hidden`);
    this._films.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sort.getElement().classList.add(`visually-hidden`);
    this._films.getElement().classList.add(`visually-hidden`);
  }

  _renderGeneralFilmsList() {
    removeElement(this._generalFilmsList.getElement());
    this._generalFilmsList.removeElement();
    render(this._films.getElement(), this._generalFilmsList.getElement(), Position.AFTERBEGIN);
    const filmsListContainer = this._generalFilmsList.getElement().querySelector(`.films-list__container`);
    this._filmCardsController = new FilmCardsController(filmsListContainer, this._onDataChange.bind(this));
    this._filmCardsController.setFilmCards(this._sortedCards.slice(0, this._generalAmount));

    if (!this._sortedCards.length) {
      render(this._generalFilmsList.getElement(), this._noFilms.getElement());
    }
  }

  _renderCategoryFilmsLists() {
    if (this._cards.some((card) => Number(card.rating))) {
      removeElement(this._topRatedFilmsList.getElement());
      this._topRatedFilmsList.removeElement();
      render(this._films.getElement(), this._topRatedFilmsList.getElement());
      const filmsListContainer = this._topRatedFilmsList.getElement().querySelector(`.films-list__container`);
      const cardsByRating = this._cards.slice().sort(Sorting.BY_RATING.METHOD);
      this._filmCardsController = new FilmCardsController(filmsListContainer, this._onDataChange.bind(this));
      this._filmCardsController.setFilmCards(cardsByRating.slice(0, this._categoryAmount));
    }

    if (this._cards.some((card) => Number(card.commentsAmount))) {
      removeElement(this._mostCommentedFilmsList.getElement());
      this._mostCommentedFilmsList.removeElement();
      render(this._films.getElement(), this._mostCommentedFilmsList.getElement());
      const filmsListContainer = this._mostCommentedFilmsList.getElement().querySelector(`.films-list__container`);
      const cardsByCommentsAmount = this._cards.slice().sort(Sorting.BY_COMMENTS.METHOD);
      this._filmCardsController = new FilmCardsController(filmsListContainer, this._onDataChange.bind(this));
      this._filmCardsController.setFilmCards(cardsByCommentsAmount.slice(0, this._categoryAmount));
    }
  }

  _renderShowMoreButton() {
    if (this._sortedCards.length > this._generalAmount) {
      removeElement(this._showMoreButton.getElement());
      this._showMoreButton.removeElement();
      render(this._generalFilmsList.getElement(), this._showMoreButton.getElement());
      this._showMoreButton.getElement().addEventListener(`click`, () => this._onShowMoreButtonClick());
    }

    if (this._generalAmount >= this._sortedCards.length) {
      removeElement(this._showMoreButton.getElement());
      this._showMoreButton.removeElement();
    }
  }

  _setFilmCards(cards, withCategories = true) {
    this._cards = cards;
    this._sortedCards = cards.slice().sort(this._activeSort.METHOD);
    this._renderGeneralFilmsList();
    this._renderShowMoreButton();

    if (withCategories) {
      this._renderCategoryFilmsLists();
    }
  }

  _onDataChange(card) {
    this._onDataChangeMain(card);
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    const activeClass = `sort__button--active`;
    const activeSortElement = this._sort.getElement().querySelector(`.${activeClass}`);
    activeSortElement.classList.remove(activeClass);
    evt.target.classList.add(activeClass);

    switch (evt.target.dataset.sortType) {
      case Sorting.BY_DATE.TYPE:
        this._activeSort = Sorting.BY_DATE;
        this._setFilmCards(this._sortedCards);
        break;
      case Sorting.BY_RATING.TYPE:
        this._activeSort = Sorting.BY_RATING;
        this._setFilmCards(this._sortedCards);
        break;
      case Sorting.BY_DEFAULT.TYPE:
        this._activeSort = Sorting.BY_DEFAULT;
        this._setFilmCards(this._cards);
    }
  }

  _onShowMoreButtonClick() {
    const filmsListContainer = this._generalFilmsList.getElement().querySelector(`.films-list__container`);
    this._filmCardsController = new FilmCardsController(filmsListContainer, this._onDataChange.bind(this));

    this._filmCardsController.addFilmCards(this._sortedCards.slice(this._generalAmount, (this._generalAmount + FILMS_AMOUNT)));
    this._generalAmount += FILMS_AMOUNT;
    this._setFilmCards(this._sortedCards);

    if (this._generalAmount >= this._sortedCards.length) {
      removeElement(this._showMoreButton.getElement());
      this._showMoreButton.removeElement();
    }
  }
}
