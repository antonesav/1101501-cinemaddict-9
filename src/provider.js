import {objectToArray} from "./utils/utils";
import ModelCard from "./models/film";
import ModelComment from "./models/comment";

export default class Provider {
  constructor({api, store, isOnline}) {
    this._api = api;
    this._store = store;
    this._isOnline = isOnline;
  }

  getCards() {
    if (this._isOnline()) {
      return this._api.getCards()
        .then((cards) => {
          cards.map((card) => this._store.setItem({key: card.id, item: ModelCard.toRAW(card)}));
          return cards;
        });
    }

    const rawCardsMap = this._store.getAll();
    const rawCards = objectToArray(rawCardsMap);
    const cards = ModelCard.parseCards(rawCards);
    return Promise.resolve(cards);
  }

  syncCards() {
    return this._api.syncCards({cards: objectToArray(this._store.getAll())});
  }

  updateCard({id, data}) {
    if (this._isOnline()) {
      return this._api.updateCard({id, data})
        .then((card) => {
          this._store.setItem({key: card.id, item: ModelCard.toRAW(card)});
          return card;
        });
    }

    const card = data;
    this._store.setItem({key: card.id, item: card});
    return Promise.resolve(ModelCard.parseCard(card));
  }

  getComments({id}) {
    if (this._isOnline()) {
      return this._api.getComments({id})
        .then((comments) => {
          this._store.setItem({key: id, item: comments.map((comment) => ModelComment.toRAW(comment))});
          return comments;
        });
    }

    const rawCommentsMap = this._store.getAll();
    const rawComments = objectToArray(rawCommentsMap);
    const comments = rawComments.map((rawComment) => {
      ModelComment.parseComments(rawComment);
    });
    return Promise.resolve(comments);
  }
}
