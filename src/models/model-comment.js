import moment from 'moment';

class ModelComment {
  constructor(comment) {
    this.id = comment[`id`];
    this.author = comment[`author`];
    this.emotion = comment[`emotion`];
    this.comment = comment[`comment`];
    this.date = Number(moment(comment[`date`]).format(`x`));
  }

  static parseComment(comment) {
    return new ModelComment(comment);
  }

  static parseComments(comment) {
    return comment.map(ModelComment.parseComment);
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.author,
      'comment': this.comment,
      'date': this.date,
      'emotion': this.emotion
    };
  }
}

export default ModelComment;
