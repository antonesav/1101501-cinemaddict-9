import {Emojis} from "../utils/constants";

export default class ModelComment {
  constructor(data) {
    this.id = data[`id`];
    this.text = data[`comment`];
    this.author = data[`author`];
    this.date = data[`date`];
    this.emoji = {
      id: data[`emotion`],
      source: Emojis.reduce((acc, emoji) => {
        if (emoji.id === data[`emotion`]) {
          acc = emoji.source;
        }

        return acc;
      }, ``),
    };
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }

  static toRAW(comment) {
    return {
      'comment': comment.text,
      'date': comment.date,
      'emotion': comment.emoji.id,
    };
  }
}
