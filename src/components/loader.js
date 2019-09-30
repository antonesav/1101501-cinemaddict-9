import AbstractComponent from './abstract-component';

export default class Loader extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<div class="loading-text no-result">Loading…</div>`;
  }
}
