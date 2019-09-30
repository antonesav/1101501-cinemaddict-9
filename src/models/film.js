import {trimString} from "../utils/utils";
import moment from "moment";

export default class ModelCard {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.rating = data[`film_info`][`total_rating`];
    this.year = moment(data[`film_info`][`release`][`date`]).format(`YYYY`);
    this.duration = data[`film_info`][`runtime`];
    this.genre = data[`film_info`][`genre`][0] || `No genre`;
    this.poster = data[`film_info`][`poster`];
    this.description = trimString(data[`film_info`][`description`]);
    this.commentsAmount = data[`comments`].length;
    this.inWatchlist = data[`user_details`][`watchlist`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isFavorite = data[`user_details`][`favorite`];
    this.comments = data[`comments`];
    this.userRating = data[`user_details`][`already_watched`] ? data[`user_details`][`personal_rating`] : 0;
    this.watchingDate = data[`user_details`][`watching_date`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.age = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.releaseDate = moment(data[`film_info`][`release`][`date`]).format(`DD MMMM YYYY`);
    this.country = data[`film_info`][`release`][`release_country`];
    this.genres = data[`film_info`][`genre`];
    this.description = data[`film_info`][`description`];
  }

  static parseCard(data) {
    return new ModelCard(data);
  }

  static parseCards(data) {
    return data.map(ModelCard.parseCard);
  }

  static toRAW(card) {
    return {
      'id': card.id,
      'comments': card.comments,
      'film_info': {
        'title': card.title,
        'alternative_title': card.originalTitle,
        'total_rating': card.rating,
        'poster': card.poster,
        'age_rating': card.age,
        'director': card.director,
        'writers': [...card.writers],
        'actors': [...card.actors],
        'release': {
          'date': card.releaseDate,
          'release_country': card.country,
        },
        'runtime': card.duration,
        'genre': [...card.genres],
        'description': card.description,
      },
      'user_details': {
        'personal_rating': Number(card.userRating) || 0,
        'watchlist': card.inWatchlist,
        'already_watched': card.isWatched,
        'watching_date': moment(card.watchingDate).toISOString() || moment().toISOString(),
        'favorite': card.isFavorite,
      },
    };
  }
}
