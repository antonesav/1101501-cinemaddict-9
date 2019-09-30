import {Emojis} from "../utils/constants";
import AbstractComponent from "./abstract-component";
import {createElement} from "../utils/utils";
import moment from "moment";

export default class CommentsForm extends AbstractComponent {
  constructor(comments) {
    super();
    this._comments = comments;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

        <ul class="film-details__comments-list">
        ${this._comments.map((comment) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="${comment.emoji.source}" width="55" height="55" alt="emoji">
            </span>
            <div>
              <p class="film-details__comment-text">${comment.text}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${comment.author}</span>
                <span class="film-details__comment-day">${moment(comment.date).fromNow()}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`).join(``)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          
          <div class="film-details__emoji-list">
          ${Emojis.map((emoji) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="${emoji.id}" value="${emoji.value}">
        <label class="film-details__emoji-label" for="${emoji.id}">
        <img src="${emoji.source}" width="30" height="30" alt="emoji">
        </label>`).join(``)}
          </div>
        </div>
      </section>`;
  }

  _subscribeOnEvents() {
    this.getElement().querySelectorAll(`.film-details__emoji-label`).forEach((element) => {
      element.addEventListener(`click`, () => {
        const imageElement = element.querySelector(`img`);
        this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
        this.getElement().querySelector(`.film-details__add-emoji-label`).appendChild(createElement(`<img src="${imageElement.src}" width="55" height="55" alt="emoji">`));
      });
    });
  }
}
