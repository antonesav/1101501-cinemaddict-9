const CACHE_NAME = `Cinemaddict`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `./`,
          `./index.html`,
          `./bundle.js`,
          `./css/main.css`,
          `./css/normalize.css`,
          `./images/background.png`,
          `./images/bitmap.png`,
          `./images/bitmap@2x.png`,
          `./images/bitmap@3x.png`,
          `./images/emoji/angry.png`,
          `./images/emoji/puke.png`,
          `./images/emoji/sleeping.png`,
          `./images/emoji/smile.png`,
          `./images/emoji/trophy.png`,
          `./images/icons/icon-favorite.svg`,
          `./images/icons/icon-favorite-active.svg`,
          `./images/icons/icon-watched.svg`,
          `./images/icons/icon-watched-active.svg`,
          `./images/icons/icon-watchlist.svg`,
          `./images/icons/icon-watchlist-active.svg`,
          `./images/posters/made-for-each-other.png`,
          `./images/posters/popeye-meets-sinbad.png`,
          `./images/posters/sagebrush-trail.jpg`,
          `./images/posters/santa-claus-conquers-the-martians.jpg`,
          `./images/posters/the-dance-of-life.jpg`,
          `./images/posters/the-great-flamarion.jpg`,
          `./images/posters/the-man-with-the-golden-arm.jpg`,
        ]);
      }).catch((err) => {
        throw new Error(`${err}`);
      }));
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      caches.match(evt.request)
      .then((response) => {
        console.log(`Find in cache`, {response});
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.log(`${err}`);
      }));
});
