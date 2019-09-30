import FilmController from "./film";

export default class FilmCardsController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._cards = [];
    this._subscriptions = [];
  }

  setFilmCards(cards) {
    this._cards = cards;
    this._subscriptions = [];
    this._container.innerHTML = ``;
    this._cards.forEach((card) => this._renderFilmCard(card));
  }

  addFilmCards(cards) {
    cards.forEach((card) => this._renderFilmCard(card));
    this._cards = this._cards.concat(cards);
  }

  _renderFilmCard(card) {
    const filmController = new FilmController(this._container, card, this._onDataChange.bind(this), this._onChangeView.bind(this));
    filmController.init();
    this._subscriptions.push(filmController.setDefaultView.bind(filmController));
  }

  _onDataChange(id) {
    this._onDataChangeMain(this._cards.reduce((acc, card) => {
      if (card.id === id) {
        acc = card;
      }
      return acc;
    }, {}));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
