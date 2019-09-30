import {AUTHORIZATION, COMMENTS_STORE_KEY, END_POINT, ErrorTypes} from "../utils/constants";
import {removeElement, render, isOnline} from "../utils/utils";
import CommentsForm from "../components/comments";
import API from "../api";
import Store from "../store";
import Provider from "../provider";
import ModelComment from "../models/comment";
import moment from "moment";

export default class CommentsController {
  constructor(container, id, callback, onDataChange) {
    this._container = container;
    this._id = id;
    this._callback = callback;
    this._onDataChangeMain = onDataChange;

    this._commentsForm = new CommentsForm([]);
    this._api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
    this._store = new Store({key: COMMENTS_STORE_KEY, storage: localStorage});
    this._provider = new Provider({api: this._api, store: this._store, isOnline});
  }

  init() {
    this._renderCommentsForm();
  }

  _renderCommentsForm() {
    removeElement(this._commentsForm.getElement());
    this._commentsForm.removeElement();
    this._provider.getComments({id: this._id}).then((comments) => {
      this._commentsForm = new CommentsForm(comments);
      render(this._container, this._commentsForm.getElement());
      const inputField = this._commentsForm.getElement().querySelector(`.film-details__comment-input`);
      const deleteButtons = this._commentsForm.getElement().querySelectorAll(`.film-details__comment-delete`);
      if (!isOnline()) {
        inputField.disabled = true;
        deleteButtons.forEach((button) => {
          button.disabled = true;
        });
      } else {
        inputField.addEventListener(`keydown`, (evt) => this._onEnterKeydown(evt));
        inputField.addEventListener(`focus`, () => {
          document.removeEventListener(`keydown`, this._callback);
        });
        inputField.addEventListener(`blur`, () => {
          document.addEventListener(`keydown`, this._callback);
        });
        deleteButtons.forEach((button, index) => button.addEventListener(`click`, (evt) => {
          evt.preventDefault();
          this._onDeleteButtonClick(button, comments, index);
        }));
      }
    });
  }

  _onDataChange(card) {
    this._onDataChangeMain(card);
  }

  _onDeleteButtonClick(button, comments, index) {
    button.disabled = true;
    button.textContent = `Deleting…`;
    this._api.deleteComment({id: comments[index].id})
      .then(() => {
        button.disabled = false;
        button.textContent = `Delete`;
        this._onDataChange(this._id);
        this._renderCommentsForm();
      })
      .catch(() => {
        button.disabled = false;
        button.textContent = `Delete`;
      });
  }

  _onEnterKeydown(evt) {
    if ((evt.key === `Enter` && evt.metaKey) || (evt.key === `Enter` && evt.ctrlKey)) {
      const checkedInputElement = this._commentsForm.getElement().querySelector(`.film-details__emoji-item:checked`);
      const chosenEmoji = this._commentsForm.getElement().querySelector(`.film-details__add-emoji-label img`);

      if (!evt.target.value || !checkedInputElement) {
        return;
      }

      if (evt.target.classList.contains(ErrorTypes.INPUT)) {
        evt.target.classList.remove(ErrorTypes.INPUT);
      }

      evt.target.disabled = true;
      const newComment = {
        text: evt.target.value,
        date: moment(),
        emoji: {
          id: checkedInputElement.id,
        },
      };

      this._api.postComment({id: this._id, data: ModelComment.toRAW(newComment)})
        .then(() => {
          evt.target.disabled = false;
          evt.target.value = ``;
          evt.target.blur();
          checkedInputElement.checked = false;
          removeElement(chosenEmoji);
          this._onDataChange(this._id);
          this._renderCommentsForm();
        })
        .catch(() => {
          evt.target.disabled = false;
          evt.target.classList.add(ErrorTypes.INPUT);
        });
    }
  }
}
