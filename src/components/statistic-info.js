import AbstractComponent from './abstract-component';

class StatisticInfo extends AbstractComponent {

  constructor({watchedMovies, totalDuration, topGenre}) {
    super();
    this._watchedMovies = watchedMovies;
    this._totalDuration = totalDuration;
    this._topGenre = topGenre;
  }

  getTemplate() {
    return `<ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${this._watchedMovies} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${this._totalDuration.hours} <span class="statistic__item-description">h</span> ${this._totalDuration.minutes} <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${this._topGenre}</p>
    </li>
  </ul>`;
  }
}

export default StatisticInfo;
