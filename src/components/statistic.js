import AbstractComponent from "./abstract-component";
import {countDuplicateElements} from "../utils/utils";

export default class Statistics extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<div>
     <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${this._cards.filter((card) => card.isWatched).length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(this._cards.reduce((acc, card) => {
    if (card.isWatched) {
      acc = acc + card.duration;
    }
    return acc;
  }, 0) / 60)} <span class="statistic__item-description">h</span> ${this._cards.reduce((acc, card) => {
  if (card.isWatched) {
    acc = acc + card.duration;
  }
  return acc;
}, 0) % 60} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${this._getTopGenre()}</p>
      </li>
    </ul>
  
    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
</div>`;
  }

  _getTopGenre() {
    const watchedGenres = this._cards.reduce((acc, card) => {
      if (card.isWatched) {
        acc.push(card.genre);
      }

      return acc;
    }, []);
    const sortedGenres = countDuplicateElements(watchedGenres);

    return (Object.keys(sortedGenres).sort((a, b) => {
      return sortedGenres[b] - sortedGenres[a];
    }).shift() || `-`);
  }
}
