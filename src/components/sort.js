import {Sorting} from "../utils/constants";
import AbstractComponent from "./abstract-component";
export default class Sort extends AbstractComponent {
  getTemplate() {
    return `<ul class="sort">
    <li><a href="#" data-sort-type="${Sorting.BY_DEFAULT.TYPE}" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort-type="${Sorting.BY_DATE.TYPE}" class="sort__button">Sort by date</a></li>
    <li><a href="#" data-sort-type="${Sorting.BY_RATING.TYPE}" class="sort__button">Sort by rating</a></li>
  </ul>`;
  }
}
