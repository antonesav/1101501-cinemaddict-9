import MovieController from './movie-controller';
import {RenderPosition} from '../constants';
import {render} from '../utils';

class FilmListController {
  constructor(filmsWrapper, container, popupWrapper, onDataChangeMain, renderPosition = RenderPosition.DEFAULT) {
    this._filmsWrapper = filmsWrapper;
    this._container = container;
    this._popupWrapper = popupWrapper;
    this._onDataChangeMain = onDataChangeMain;
    this._renderPosition = renderPosition;

    this._films = [];
    this._filteredFilms = [];
    this._subscriptions = [];

    this._onChangeView = this._onChangeView.bind(this);
  }

  setFilms(films, getFilteredFilms) {
    this._films = films;
    this._subscriptions = [];

    if (this._renderPosition === RenderPosition.DEFAULT) {
      this._films.forEach((film) => this._renderFilmsCard(film, this._container, this._popupWrapper));
    } else {
      this._filteredFilms = getFilteredFilms(this._films);
      if (this._filteredFilms.length !== 0) {
        this._filteredFilms.forEach((film) => this._renderFilmsCard(film, this._container, this._popupWrapper));
        render(this._filmsWrapper.getElement(), this._container.getElement());
      }
    }
  }

  addFilms(films) {
    films.forEach((film) => this._renderFilmsCard(film, this._container, this._popupWrapper));
    this._films = this._films.concat(films);
  }

  _renderFilmsCard(film, container, popupContainer) {
    const movieController = new MovieController(container, film, popupContainer, this._onDataChangeMain, this._onChangeView);
    movieController.init();
    this._subscriptions.push(movieController.setDefaultView.bind(movieController));
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}

export default FilmListController;
