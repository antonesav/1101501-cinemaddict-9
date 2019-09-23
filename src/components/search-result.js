import AbstractComponent from "./abstract-component";

class SearchResult extends AbstractComponent {
  constructor(resultCount) {
    super();
    this._element = null;
    this._resultCount = resultCount;
  }

  getTemplate() {
    return `<div class="result">
    <p class="result__text">Result <span class="result__count">${this._resultCount}</span></p>
  </div>

  <section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>`;
  }
}

export default SearchResult;
