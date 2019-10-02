import AbstractComponent from './abstract-component';

class Loading extends AbstractComponent {
  getTemplate() {
    return `<div class="no-result">
        Loading...
      </div>`;
  }
}

export default Loading;
