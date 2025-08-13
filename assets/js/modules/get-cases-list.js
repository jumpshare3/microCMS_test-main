import { microcms } from "../microcms.js";
import { setPagination } from "../functions/set-pagination.js";

/**
 * 事例一覧を取得
 * @param {string} path   - このファイルから post.html までの相対パス (例: "./" or "../cases/")
 * @param {number} limit  - 1ページあたりの表示数
 */
export const getCasesList = (path = "./", limit = 12) => {
  const query = new URLSearchParams(window.location.search);
  const page = Number(query.get("page") || "1");
  const offset = (page - 1) * limit;

  fetch(`https://${microcms.SERVICE_ID}.microcms.io/api/v1/cases?limit=${limit}&offset=${offset}`, {
    headers: { "X-MICROCMS-API-KEY": microcms.API_KEY },
  })
    .then((res) => res.json())
    .then((data) => {
      // 件数ゼロ
      if (!data.contents || data.contents.length === 0) {
        document.querySelector("#js-cases-list").innerHTML = '<p>事例がありません。</p>';
        return;
      }

      // 一覧描画
      const ul = document.querySelector("#js-cases-list");
      ul.innerHTML = "";
      for (const item of data.contents) {
        const excerpt = (item.case_content || "").replace(/<[^>]+>/g, "").slice(0, 100);
        const li = document.createElement("li");
        li.className = "c-cardList__item";
        li.innerHTML = `
          <a class="c-card" href="${path}post.html?id=${item.id}">
            <div class="c-card__body">
              <h3 class="c-card__title">${item.case_title ?? "(無題)"}</h3>
              <p class="c-card__text">${excerpt}...</p>
            </div>
          </a>
        `;
        ul.appendChild(li);
      }

      // ページネーション
      setPagination({
        containerId: "js-pagination",
        totalCount: data.totalCount,
        limit,
        currentPage: page,
        path, // ex: "./"
      });
    })
    .catch((e) => {
      console.error(e);
      document.querySelector("#js-cases-list").innerHTML = '<p>読み込み中にエラーが発生しました。</p>';
    });
};