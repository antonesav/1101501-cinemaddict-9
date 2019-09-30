import {MIN_SEARCH_STRING_LENGTH, ListTitles} from "../utils/constants";
import {removeElement, render} from "../utils/utils";
import FilmCardsController from "./film-cards";
import SearchResult from "../components/search-result";
import SearchNoResult from "../components/search-no-result";
import FilmsList from "../components/films-list";

export default class SearchController {
  constructor(container, search, onDataChange) {
    this._container = container;
    this._search = search;
    this._onDataChangeMain = onDataChange;

    this._cards = [];
    this._searchResult = new SearchResult();
    this._noResult = new SearchNoResult();
    this._filmsList = new FilmsList(false, ListTitles.GENERAL);
  }

  init() {
    this.hide();
    const searchInput = this._search.getElement().querySelector(`input`);
    searchInput.addEventListener(`keyup`, (evt) => {
      if (evt.target.value.length >= MIN_SEARCH_STRING_LENGTH) {
        this._showSearchResult(this._filterCards(this._cards, evt.target.value));
      }
    });
  }

  show(cards) {
    this._setFilmCards(cards);
    this._searchResult.getElement().classList.remove(`visually-hidden`);
    this._noResult.getElement().classList.remove(`visually-hidden`);
    this._filmsList.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._searchResult.getElement().classList.add(`visually-hidden`);
    this._noResult.getElement().classList.add(`visually-hidden`);
    this._filmsList.getElement().classList.add(`visually-hidden`);
  }

  _filterCards(cards, query) {
    return cards.slice().filter((card) => (card.title.includes(query) || card.title.toLowerCase().includes(query)));
  }

  _setFilmCards(cards) {
    this._cards = cards;
    const searchInput = this._search.getElement().querySelector(`input`);
    this._showSearchResult(this._filterCards(this._cards, searchInput.value));
  }

  _onDataChange(card) {
    this._onDataChangeMain(card);
  }

  _showSearchResult(cards) {
    if (this._searchResult) {
      removeElement(this._searchResult.getElement());
      this._searchResult.removeElement();
    }

    if (cards.length) {
      removeElement(this._noResult.getElement());
      this._noResult.removeElement();
      this._searchResult = new SearchResult(cards.length);
      render(this._container, this._searchResult.getElement());
      render(this._container, this._filmsList.getElement());
      const filmsListContainer = this._filmsList.getElement().querySelector(`.films-list__container`);
      const filmCardsController = new FilmCardsController(filmsListContainer, this._onDataChange.bind(this));
      filmCardsController.setFilmCards(cards);
    } else {
      removeElement(this._filmsList.getElement());
      this._filmsList.removeElement();
      render(this._container, this._noResult.getElement());
    }
  }
}
