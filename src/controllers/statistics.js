import {countDuplicateElements, removeElement, render} from "../utils/utils";
import Statistics from "../components/statistic";
import StatisticFilters from "../components/statsitic-filters";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {Filters} from "../utils/constants";

export default class StatisticsController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._statistics = new Statistics(this._cards);
    this._filters = new StatisticFilters(this._cards);
  }

  init() {
    this._renderFilters(this._cards);
    this._renderStatistics(this._cards);
    this._renderCharts(this._cards);
    this.hide();
  }

  show(cards) {
    if (cards !== this._cards) {
      this._renderFilters(cards);
      this._renderStatistics(cards);
      this._renderCharts(cards);
    }

    this._filters.getElement().classList.remove(`visually-hidden`);
    this._statistics.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._filters.getElement().classList.add(`visually-hidden`);
    this._statistics.getElement().classList.add(`visually-hidden`);
  }

  _renderFilters(cards) {
    removeElement(this._filters.getElement());
    this._filters.removeElement();
    this._filters = new StatisticFilters(cards);
    render(this._container, this._filters.getElement());
    const filterInputs = this._filters.getElement().querySelectorAll(`.statistic__filters-input`);
    filterInputs.forEach((input) => input.addEventListener(`change`, (evt) => this._onFilterInputChange(evt, cards)));
  }

  _renderStatistics(cards) {
    removeElement(this._statistics.getElement());
    this._statistics.removeElement();
    this._statistics = new Statistics(cards);
    render(this._filters.getElement(), this._statistics.getElement());
  }

  _renderCharts(cards) {
    const chartCtx = this._statistics.getElement().querySelector(`.statistic__chart`);
    const watchedGenres = cards.reduce((acc, card) => {
      if (card.isWatched) {
        acc.push(card.genre);
      }

      return acc;
    }, []);
    const dataForChart = countDuplicateElements(watchedGenres);
    return new Chart(chartCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(dataForChart).sort((a, b) => {
          return dataForChart[b] - dataForChart[a];
        }),
        datasets: [{
          data: Object.values(dataForChart).sort((a, b) => b - a),
          backgroundColor: `#ffe800`,
          datalabels: {
            anchor: `start`,
            align: `start`,
            offset: 50,
            color: `#ffffff`,
            font: {
              size: 16,
            },
            formatter: (value, context) => `${context.chart.data.labels[context.dataIndex]}           ${value}`,
          },
        }],
      },
      options: {
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        layout: {
          padding: {
            left: 200,
          },
        },
        scales: {
          xAxes: [{
            display: false,
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          }],
          yAxes: [{
            display: false,
            barThickness: 25,
          }],
        },
      },
    });
  }

  _onFilterInputChange(evt, cards) {
    switch (evt.target.dataset.filter) {
      case `all`:
        this._renderStatistics(cards);
        this._renderCharts(cards);
        break;
      case `today`:
        this._renderStatistics(cards.slice().filter(Filters.TODAY.METHOD));
        this._renderCharts(cards.slice().filter(Filters.TODAY.METHOD));
        break;
      case `week`:
        this._renderStatistics(cards.slice().filter(Filters.WEEK.METHOD));
        this._renderCharts(cards.slice().filter(Filters.WEEK.METHOD));
        break;
      case `month`:
        this._renderStatistics(cards.slice().filter(Filters.MONTH.METHOD));
        this._renderCharts(cards.slice().filter(Filters.MONTH.METHOD));
        break;
      case `year`:
        this._renderStatistics(cards.slice().filter(Filters.YEAR.METHOD));
        this._renderCharts(cards.slice().filter(Filters.YEAR.METHOD));
        break;
    }
  }
}
