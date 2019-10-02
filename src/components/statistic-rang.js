import AbstractComponent from './abstract-component';

class StatisticRang extends AbstractComponent {

  constructor({rang}) {
    super();
    this._rang = rang;
  }

  getTemplate() {
    return `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${this._rang}</span>
    </p>`;
  }
}

export default StatisticRang;
