import CommentList from '../components/comment-list';
import {ENTER_KEY, Animation, ActionType} from '../constants';
import {render, remove} from '../utils';

class CommentController {
  constructor(detailsPopup, dataFilm, getState, onDataChangeMain, queryAddComment, queryDeleteComment) {
    this._detailsPopup = detailsPopup;
    this._dataFilm = dataFilm;
    this._getState = getState;
    this._onDataChangeMain = onDataChangeMain;
    this._queryAddComment = queryAddComment;
    this._queryDeleteComment = queryDeleteComment;
    this._commentsBlock = null;

    this._comments = [];

    this._containerComments = this._detailsPopup.getElement().querySelector(`.form-details__bottom-container`);
    this._nodeTextareaComment = null;
  }

  show(comments) {
    if (this._commentsBlock !== null) {
      this.hide();
    }

    this._comments = comments;
    this._commentsBlock = new CommentList({comments: this._comments});
    this._nodeTextareaComment = this._commentsBlock.getElement().querySelector(`.film-details__comment-input`);

    this._init();
  }

  hide() {
    remove(this._commentsBlock.getElement());
    this._commentsBlock.removeElement();
  }

  disableCommentTextarea() {
    this._nodeTextareaComment.disabled = true;
  }

  enableCommentTextarea() {
    this._nodeTextareaComment.disabled = false;
  }

  enableBtnDelete() {
    this._commentsBlock.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((btnElem) => {
      btnElem.textContent = `Delete`;
      btnElem.disabled = false;
    });
  }

  disableBtnDelete(evt) {
    evt.target.textContent = `Delete...`;
    evt.target.disabled = true;
  }

  _viewCommentBlockError() {
    this._viewErrorComponent();
    this._shakeErrorComponent();
    this.enableCommentTextarea();
  }

  _viewBtnDeleteCommentError() {
    this.enableBtnDelete();
  }

  _shakeErrorComponent() {
    this._nodeTextareaComment.style.animation = Animation.STYLE;
    setTimeout(() => {
      this._nodeTextareaComment.style.animation = ``;
    }, Animation.TIMEOUT);
  }

  _viewErrorComponent() {
    this._nodeTextareaComment.classList.add(`film-details__comment-input--error`);
  }

  _init() {
    this._commentsBlock.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="images/emoji/smile.png" width="55" height="55" alt="emoji">`;

    const onAddCommentKeyDown = (evt) => {
      if (evt.ctrlKey && evt.keyCode === ENTER_KEY && evt.target.value.length !== 0) {
        const formData = this._getFormData();
        this.disableCommentTextarea();
        this._onDataChangeMain(ActionType.CREATE_COMMENT, {movieId: this._dataFilm.id, comment: formData.comment}, this._queryAddComment, this._viewCommentBlockError.bind(this));
        document.removeEventListener(`keydown`, onAddCommentKeyDown);
      }
    };

    const onCommentTextareaFocus = () => {
      this._nodeTextareaComment.classList.remove(`film-details__comment-input--error`);
      document.addEventListener(`keydown`, onAddCommentKeyDown);
    };

    const onCommentTextareaBlur = () => {
      document.removeEventListener(`keydown`, onAddCommentKeyDown);
    };

    const onDeleteBtnClick = (evt, id) => {
      evt.preventDefault();
      this.disableBtnDelete(evt);
      this._onDataChangeMain(ActionType.DELETE_COMMENT, {id: this._comments[id].id}, this._queryDeleteComment, this._viewBtnDeleteCommentError.bind(this));
    };

    const onSelectEmojiClick = (evt) => {
      const emojiLabel = this._commentsBlock.getElement().querySelector(`.film-details__add-emoji-label`);
      emojiLabel.innerHTML = `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji">`;
    };

    this._commentsBlock.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`focus`, onCommentTextareaFocus);

    this._commentsBlock.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`blur`, onCommentTextareaBlur);

    this._commentsBlock.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((elem, id) => {
      elem.addEventListener(`click`, (evt) => onDeleteBtnClick(evt, id));
    });

    this._commentsBlock.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((elem) => {
      elem.addEventListener(`click`, onSelectEmojiClick);
    });

    render(this._containerComments, this._commentsBlock.getElement());
  }

  _getFormData() {
    const formData = new FormData(this._detailsPopup.getElement().querySelector(`.film-details__inner`));
    return {
      comment: {
        emotion: formData.get(`comment-emoji`) !== null ? formData.get(`comment-emoji`) : `smile`,
        comment: formData.get(`comment`),
        date: new Date(Date.now())
      }
    };
  }
}

export default CommentController;
