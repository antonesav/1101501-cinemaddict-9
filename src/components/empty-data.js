import AbstractComponent from './abstract-component';

class EmptyData extends AbstractComponent {
  getTemplate() {
    return `<div class="no-result">
        There are no movies in our database.
      </div>`;
  }
}

export default EmptyData;
