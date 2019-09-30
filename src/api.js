import {Method} from "./utils/constants";
import {checkStatus, toJSON} from "./utils/utils";
import ModelCard from "./models/film";
import ModelComment from "./models/comment";

export default class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({url: `movies`})
      .then(toJSON)
      .then(ModelCard.parseCards);
  }

  syncCards({cards}) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(cards),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  updateCard({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelCard.parseCard);
  }

  getComments({id}) {
    return this._load({url: `comments/${id}`})
      .then(toJSON)
      .then(ModelComment.parseComments);
  }

  postComment({id, data}) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  deleteComment({id}) {
    return this._load({url: `comments/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw new Error(`fetch error: ${err}`);
      });
  }
}
