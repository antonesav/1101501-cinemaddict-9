import {getRandomNumber} from "./util";
import {getRandomValue} from "./util";
import {getRandomBoolean} from "./util";
import {getRandomRating} from "./util";
import {getRandomDate} from "./util";
import {getRandomDuration} from "./util";
import {generateDescription} from "./util";
import {getRandomWriters} from "./util";
import {getRandomRealise} from "./util";
import {getRandomGenres} from "./util";

const CARD_COUNT = 20;
const COMMENT_COUNT = 4;

const dataMock = {
  titles: [`Toy Story 4`, `Greta`, `The Art of Self Defense`, `The Dead Don’t Die`, `Her Smell`, `Fast Color`, `Avengers: Endgame`, `The Burial of Kojo`, `The Great Hack`, `Skin`, `The Mountain`, `Plus One`, `High Life`, `The Edge of Democracy`, `John Wick: Chapter 3`],

  genres: [`Horror`, `Romance`, `Comedy`, `Action`, `Documentary`],

  posters: [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`],

  description: ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`,

  directors: [`Philippe Rege`, `Roy Armes`, `Rebecca Hillauer`, `Alexander Jacoby`],
  writers: [`David Lynch`, `Donald Richie`, `Martin Scorsese`, `Hannah Patterson`, `Joel and Ethan Coen`, `Spencer Moon`, `Steven Soderbergh`],
  actors: [`Steven Soderbergh`, `Hannah Patterson`, `David Lynch`, `Joel and Ethan Coen`, `Donald Richie`, `Spencer Moon`, `Martin Scorsese`],
  country: [`USA`, `Russia`, `Greece`, `Serbia`, `Spain`],
  avatar: [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`],
};

const getComments = (count) => {
  const commentsArr = new Array(count);
  return [...commentsArr].map(() => {
    return {
      avatar: getRandomValue(dataMock, `avatar`),
      name: getRandomValue(dataMock, `writers`),
      text: generateDescription(dataMock.description),
      date: getRandomNumber(100),
    };
  });
};

export const getCard = () => {
  return {
    title: getRandomValue(dataMock, `titles`),
    rating: getRandomRating(10),
    year: getRandomDate(1900, 2019),
    duration: getRandomDuration(),
    genre: getRandomValue(dataMock, `genres`),
    poster: getRandomValue(dataMock, `posters`),
    description: generateDescription(dataMock.description),
    comment: getRandomNumber(100),
    isWatchlist: getRandomBoolean(),
    isWatched: getRandomBoolean(),
    isFavorite: getRandomBoolean(),
    popup: {
      title: getRandomValue(dataMock, `titles`),
      original: getRandomValue(dataMock, `titles`),
      director: getRandomValue(dataMock, `directors`),
      writer: getRandomWriters(dataMock, `writers`),
      actor: getRandomWriters(dataMock, `actors`),
      rating: getRandomRating(10),
      realise: getRandomRealise(),
      duration: getRandomDuration(),
      country: getRandomValue(dataMock, `country`),
      genres: getRandomGenres(dataMock, `genres`),
      poster: getRandomValue(dataMock, `posters`),
      description: generateDescription(dataMock.description),
      comments: getComments(COMMENT_COUNT),
    },
  };
};

export const mockCards = () => {
  const cards = [];
  for (let i = 0; i < CARD_COUNT; i++) {
    cards.push(getCard());
  }

  return cards;
};
