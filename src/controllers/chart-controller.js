import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

import Statistics from '../components/statistics';
import StatisticInfo from '../components/statistic-info';
import StatisticChart from '../components/statistic-chart';
import StatisticRang from '../components/statistic-rang';

import {render, remove, getRang, flat} from '../utils';
import {HOUR, ONLY_GENRE, StatsPeriod, Position} from '../constants';

class ChartController {
  constructor(container) {
    this._container = container;

    this._statistic = new Statistics();
    this._statisticRang = new StatisticRang({rang: {}});
    this._statisticInfo = new StatisticInfo({watchedMovies: {}, totalDuration: {}, topGenre: {}});
    this._statisticChart = new StatisticChart();

    this._chart = null;
    this._rang = null;

    this._films = [];
    this._originalFilms = [];
    this._onlyGenres = {};
    this._period = {
      [StatsPeriod.TODAY]: `day`,
      [StatsPeriod.WEEK]: `week`,
      [StatsPeriod.MONTH]: `month`,
      [StatsPeriod.YEAR]: `year`,
    };

    this.hide();
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
  }

  show(films) {
    this._films = films.slice().filter((elem) => elem.isViewed);
    this._originalFilms = films.slice().filter((elem) => elem.isViewed);
    this._statistic.getElement().classList.remove(`visually-hidden`);

    this._showStatisticBlock();
  }

  _showStatisticBlock() {
    this._removeStatistics();
    this._statistic = new Statistics();
    this._getStatisticActions();
    render(this._container, this._statistic.getElement());

    this._showStatistics();
  }

  _showStatisticRang() {
    this._removeStatisticRang();
    this._rang = this._films.length ? getRang(this._films.length) : `-`;
    this._statisticRang = new StatisticRang({rang: this._rang});
    render(this._statistic.getElement(), this._statisticRang.getElement(), Position.AFTERBEGIN);
  }

  _getGenreInfo() {
    if (this._films.length === 0) {
      return `-`;
    }

    return Object.entries(this._onlyGenres).reduce(function (prev, current) {
      return (prev[1] > current[1]) ? prev : current;
    });
  }

  _getTotalDuration() {
    const result = {hours: 0, minutes: 0};

    if (this._films.length === 0) {
      return result;
    }

    return this._films.reduce((_, item) => {
      result.hours += Math.trunc(item.runtime / HOUR);
      result.minutes += Math.trunc(item.runtime % HOUR);
      return result;
    }, {});
  }

  _showStatsInfo() {
    this._removeStatisticInfo();

    const topGenre = this._getGenreInfo();
    const totalDuration = this._getTotalDuration();

    const addHours = Math.trunc(totalDuration.minutes / HOUR);
    const realMinutes = totalDuration.minutes % HOUR;
    totalDuration.hours += addHours;
    totalDuration.minutes = realMinutes;

    this._statisticInfo = new StatisticInfo({watchedMovies: this._films.length, totalDuration, topGenre: topGenre[0]});
    render(this._statistic.getElement().querySelector(`.statistic__filters`), this._statisticInfo.getElement(), Position.AFTEREND);
  }

  _showStatistics() {
    if (this._chart !== null) {
      this._chart.destroy();
    }

    if (this._films.length === 0) {
      this._removeStatisticChart();
      return this._showStatsInfo();
    }

    this._onlyGenres = this._getGenres(this._films);
    this._showStatisticRang();
    this._showStatsInfo();
    render(this._statistic.getElement().querySelector(`.statistic__chart-wrap`), this._statisticChart.getElement());

    this._createChart();

    return 0;
  }

  _createChart() {
    const ctx = this._statisticChart.getElement();

    this._chart = new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Object.keys(this._onlyGenres),
        datasets: [{
          backgroundColor: `#FBE44D`,
          data: Object.values(this._onlyGenres)
        }]
      },
      options: {
        plugins: {
          datalabels: {
            clamp: true,
            anchor: `start`,
            offset: 40,
            color: `#ffffff`,
            align: `start`,
            font: {
              family: `Open Sans`,
              weight: `bold`,
              size: 14
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              defaultFontFamily: `Open Sans`,
              beginAtZero: true,
              display: true,
              fontColor: `#ffffff`,
              fontSize: 16,
              padding: 85
            },
            maxBarThickness: 30,
            barPercentage: 1.0,
            categoryPercentage: 0.9,
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              display: false,
              min: 0
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        layout: {
          padding: {
            left: 30,
          }
        },
        animation: {
          easing: `easeInOutQuad`
        }
      }
    });
  }

  _getGenres(films) {
    const filmGenres = films.map((film) => Object.values(film.genres));
    return (flat(filmGenres)).reduce((acc, item) => {
      if (acc.hasOwnProperty(item)) {
        acc[item]++;
      } else {
        acc[item] = ONLY_GENRE;
      }
      return acc;
    }, {});
  }

  _getFilteredStatsFilms(filteredFilms, period) {
    const startDate = moment().startOf(period).format(`YYYY-MM-DD`);
    this._films = filteredFilms.filter((elem) => {
      const dateViewed = moment(elem.viewedDate).format(`YYYY-MM-DD`);
      return moment(dateViewed).isSame(startDate, period) && elem;
    });
    this._showStatistics();
  }

  _removeStatistics() {
    this._removeStatisticRang();
    this._removeStatisticChart();
    remove(this._statistic.getElement());
    this._statistic.removeElement();
  }

  _removeStatisticChart() {
    remove(this._statisticChart.getElement());
    this._statisticChart.removeElement();
  }

  _removeStatisticInfo() {
    remove(this._statisticInfo.getElement());
    this._statisticInfo.removeElement();
  }

  _removeStatisticRang() {
    remove(this._statisticRang.getElement());
    this._statisticRang.removeElement();
  }

  _getStatisticActions() {
    const onMenuElemClick = (evt) => {
      const statsPeriod = evt.target.value;

      if (statsPeriod === StatsPeriod.ALL_TIME) {
        this._films = this._originalFilms;
        this._showStatistics();
      } else {
        this._getFilteredStatsFilms(this._originalFilms, this._period[statsPeriod]);
      }
    };

    this._statistic.getElement().querySelectorAll(`.statistic__filters-input`).forEach((elem) => {
      elem.addEventListener(`click`, onMenuElemClick);
    });
  }
}

export default ChartController;
