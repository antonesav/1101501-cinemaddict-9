import AbstractComponent from "./abstract-component";

class Comment extends AbstractComponent {
  constructor({avatar, text, name, date}) {
    super();
    this._avatar = avatar;
    this._text = text;
    this._name = name;
    this._date = date;
  }

  getTemplate() {
    return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${this._avatar}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${this._text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${this._name}</span>
          <span class="film-details__comment-day">${this._date} days ago</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
  }
}

export default Comment;
