import ModelMovie from './models/model-movie';
import ModelComment from './models/model-comment';
import {Method} from './constants';
import {checkStatus, toJSON} from './utils';

class API {
  constructor({server, authorization}) {
    this._server = server;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `movies`}).then(toJSON).then(ModelMovie.parseMovies);
  }

  updateMovie({id, movie}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(movie),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelMovie.parseMovie);
  }

  getMovieComments({movieId}) {
    return this._load({url: `comments/${movieId}`}).then(toJSON).then(ModelComment.parseComments);
  }

  createComment({id, comment}) {
    return this._load({
      url: `comments/${id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelComment.parseComment);
  }

  deleteComment({commentId}) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._server}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

export default API;
