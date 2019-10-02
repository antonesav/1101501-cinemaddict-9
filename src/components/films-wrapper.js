import AbstractComponent from './abstract-component';

class FilmsWrapper extends AbstractComponent {
  getTemplate() {
    return `<section class="films"></section>`;
  }
}

export default FilmsWrapper;
