import { microcms } from "../microcms.js";
import { getParam } from "../functions/get-param.js";

/** 事例詳細を取得 */
export const getCasesDetail = () => {
  const id = getParam("id");
  if (!id) {
    document.querySelector("#js-post-title").textContent = "記事が見つかりません";
    return;
  }

  fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/cases/${id}`, {
    headers: { "X-MICROCMS-API-KEY": microcms.API_KEY },
  })
    .then((res) => res.json())
    .then((data) => {
      document.querySelector("#js-post-title").textContent = data.case_title ?? "(無題)";
      const content = data.case_content || "";
      document.querySelector("#js-post-body").innerHTML = content;
    })
    .catch((e) => {
      console.error(e);
      document.querySelector("#js-post-title").textContent = "読み込みエラー";
    });
};