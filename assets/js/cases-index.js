import { getCasesList } from "./modules/get-cases-list.js";

$(function () {
  // 事例一覧
  getCasesList("./", 12);
});