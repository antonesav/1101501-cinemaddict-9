const stats = [
  {title: `Watchlist`, count: 0},
  {title: `History`, count: 0},
  {title: `Favorites`, count: 0},
];

const filterCount = {
  watchlist: 0,
  history: 0,
  favorites: 0,
};

const renderFilter = (filter) => {
  const {title, count} = filter;
  return `<a href="#${title}" class="main-navigation__item">${title} <span class="main-navigation__item-count">${count}</span></a>`;
};

const getFilters = (markup) => markup.map((filter) => renderFilter(filter));

const fillFilters = (cards) => {
  cards.map((item) => {
    filterCount.watchlist += item.isWatchlist ? 1 : 0;
    filterCount.history += item.isWatched ? 1 : 0;
    filterCount.favorites += item.isFavorite ? 1 : 0;
  });
  Object.keys(filterCount).forEach((item, index) => {
    stats[index].count = filterCount[item];
  });
};

export const getMenuTemplate = (cards) => {
  fillFilters(cards);
  return `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${getFilters(stats).join(``)}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`;
};