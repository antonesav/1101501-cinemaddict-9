import AbstractComponent from './abstract-component';
import {MENU_STATISTICS} from '../constants';

class Statistics extends AbstractComponent {
  getTemplate() {
    return `<section class="statistic">
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${MENU_STATISTICS.map((elem) => `
          <input type="radio"
            class="statistic__filters-input visually-hidden"
            name="statistic-filter"
            id="statistic-${elem.id}"
            value="${elem.id}" ${elem.checked ? `checked` : ``} >
        <label for="statistic-${elem.id}" class="statistic__filters-label">${elem.title}</label>`).join(` `)}
      </form>

      <div class="statistic__chart-wrap"></div>

    </section>`;
  }
}

export default Statistics;
