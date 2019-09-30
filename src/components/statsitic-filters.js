import {Filters} from "../utils/constants";
import {getUserTitle} from "../utils/utils";
import AbstractComponent from "./abstract-component";

export default class StatisticFilters extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<section class="statistic">
    <p class="statistic__rank">
      Your rank 
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35"> 
      <span class="statistic__rank-label">${getUserTitle(this._cards.filter((card) => card.isWatched).length)}</span>
    </p>
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" data-filter="${Filters.ALL.TYPE}" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" data-filter="${Filters.TODAY.TYPE}">
      <label for="statistic-today" class="statistic__filters-label">Today</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" data-filter="${Filters.WEEK.TYPE}">
      <label for="statistic-week" class="statistic__filters-label">Week</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" data-filter="${Filters.MONTH.TYPE}">
      <label for="statistic-month" class="statistic__filters-label">Month</label>
  
      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" data-filter="${Filters.YEAR.TYPE}">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>
  </section>`;
  }
}
