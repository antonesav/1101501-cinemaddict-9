import AbstractComponent from "./abstract-component";

class Button extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<button class="films-list__show-more">Show more</button>`;
  }
}

export default Button;
