import AbstractComponent from './abstract-component';

class ShowButton extends AbstractComponent {
  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export default ShowButton;
