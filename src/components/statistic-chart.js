import AbstractComponent from './abstract-component';

class StatisticChart extends AbstractComponent {
  getTemplate() {
    return `<canvas class="statistic__chart" width="1000"></canvas>`;
  }
}

export default StatisticChart;
