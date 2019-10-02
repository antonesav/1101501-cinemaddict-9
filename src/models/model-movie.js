import moment from 'moment';
import {screeningArray} from '../utils';

class ModelMovie {
  constructor(movie) {
    this.id = movie[`id`];
    this.title = movie[`film_info`][`title`];
    this.titleOriginal = movie[`film_info`][`alternative_title`] || ``;
    this.poster = movie[`film_info`][`poster`];
    this.description = movie[`film_info`][`description`];
    this.rating = Number(movie[`film_info`][`total_rating`]);
    this.date = Number(moment(movie[`film_info`][`release`][`date`]).format(`x`));
    this.genres = screeningArray(movie[`film_info`][`genre`]);
    this.ageRating = Number(movie[`film_info`][`age_rating`]);
    this.runtime = Number(movie[`film_info`][`runtime`]);
    this.comments = screeningArray(movie[`comments`]);
    this.details = {
      director: {name: `Director`, value: movie[`film_info`][`director`]},
      writers: {name: `Writers`, value: screeningArray(movie[`film_info`][`writers`])},
      actors: {name: `Actors`, value: screeningArray(movie[`film_info`][`actors`])},
      date: {name: `Release Date`, value: new Date(movie[`film_info`][`release`][`date`])},
      runtime: {name: `Runtime`, value: Number(movie[`film_info`][`runtime`])},
      country: {name: `Country`, value: movie[`film_info`][`release`][`release_country`]},
      genres: {name: `Genre`, value: screeningArray(movie[`film_info`][`genre`])}
    };

    this.personalRating = Number(movie[`user_details`][`personal_rating`]) || null;
    this.isFavorite = Boolean(movie[`user_details`][`favorite`]);
    this.isWatchlist = Boolean(movie[`user_details`][`watchlist`]);
    this.isViewed = Boolean(movie[`user_details`][`already_watched`]);
    this.viewedDate = movie[`user_details`][`watching_date`];
  }

  static parseMovie(movie) {
    return new ModelMovie(movie);
  }

  static parseMovies(movie) {
    return movie.map(ModelMovie.parseMovie);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.titleOriginal,
        'poster': this.poster,
        'description': this.description,
        'total_rating': Number(this.rating),
        'genre': this.genres,
        'age_rating': Number(this.ageRating),
        'runtime': Number(this.runtime),
        'release': {
          'date': new Date(this.date),
          'release_country': this.details[`country`].value
        },
        'director': this.details[`director`].value,
        'writers': this.details[`writers`].value,
        'actors': this.details[`actors`].value,
      },
      'user_details': {
        [`personal_rating`]: Number(this.personalRating),
        favorite: Boolean(this.isFavorite),
        watchlist: Boolean(this.isWatchlist),
        [`already_watched`]: Boolean(this.isViewed),
        [`watching_date`]: new Date(this.viewedDate)
      }
    };
  }
}

export default ModelMovie;
