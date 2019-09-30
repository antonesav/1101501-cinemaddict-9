import {AUTHORIZATION, END_POINT, CARDS_STORE_KEY, States} from "./utils/constants";
import {removeElement, render, isOnline} from "./utils/utils";
import MenuController from "./controllers/menu";
import PageController from "./controllers/page";
import SearchController from "./controllers/search";
import StatisticsController from "./controllers/statistics";
import Search from "./components/search";
import ProfileRating from "./components/profile";
import Loader from "./components/loader";
import StatisticsText from "./components/statistic-text";
import ModelCard from "./models/film";
import API from "./api";
import Provider from "./provider";
import Store from "./store";

const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const store = new Store({key: CARDS_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, isOnline});
const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const search = new Search();
const loader = new Loader();

const onDataChange = (update) => {
  provider.updateCard({
    id: update.id,
    data: ModelCard.toRAW(update),
  })
    .then(() => {
      provider.getCards()
        .then((updatedCards) => {
          renderPage(updatedCards);
        });
    });
};

const pageController = new PageController(mainElement, onDataChange);
const searchController = new SearchController(mainElement, search, onDataChange);
const statisticsController = new StatisticsController(mainElement, onDataChange);
const menuController = new MenuController(mainElement, search, searchController, pageController, statisticsController, onDataChange);

pageController.init();
searchController.init();
statisticsController.init();
menuController.init();

render(headerElement, search.getElement());
render(mainElement, loader.getElement());

const renderPage = ((cards) => {
  removeElement(loader.getElement());
  loader.removeElement();

  const profileRating = new ProfileRating(cards);
  removeElement(headerElement.querySelector(`.profile`));
  render(headerElement, profileRating.getElement());

  const statisticsText = new StatisticsText(cards);
  removeElement(footerElement.querySelector(`.footer__statistics`));
  render(footerElement, statisticsText.getElement());
  pageController.show(cards);
  menuController.show(cards);

  if (menuController.getState() === States.SEARCH) {
    searchController.show(cards);
    pageController.hide();
    menuController.hide();
  }
});

window.addEventListener(`offline`, () => {
  document.title = `${document.title} [OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(` [OFFLINE]`)[0];
  provider.syncCards();
});

provider.getCards().then((cards) => renderPage(cards));
