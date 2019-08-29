import AbstractComponent from "./abstract-component";

class Message extends AbstractComponent {
  constructor() {
    super();
  }

  getTemplate() {
    return `<section class="films" style="display: none;">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="no-result">
        There is no movies for your request.
      </div>
    </section>`;
  }
}

export default Message;
