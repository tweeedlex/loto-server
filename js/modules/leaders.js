import * as impHttp from "./http.js";

export function openLeadersMenuPage() {
  let main = document.querySelector("main");
  if (main) {
    main.innerHTML = `<div class="main__container">
    <section class="leader-menu-page">
      <div class="leader-page-main">
        <div class="leader-page-menu">
          <div class="leader-page-menu__item" game-type = "loto">
            <img src="img/loto-img.png" alt="" /><span>Лидеры лото</span>
          </div>
          <div class="leader-page-menu__item" game-type = "domino" >
            <img src="img/loto-img.png" alt="" /><span>Лидеры домино</span>
          </div>
          <div class="leader-page-menu__item" game-type = "nards">
            <img src="img/loto-img.png" alt="" /><span>Лидеры нардов</span>
          </div>
        </div>
      </div>
    </section>
  </div>`;
  }

  leadersMenuPageFunc();
}

async function leadersMenuPageFunc() {
  let leadersPageMenu = document.querySelector(".leader-page-menu");
  let leadersMenuOptions = leadersPageMenu.querySelectorAll(
    ".leader-page-menu__item"
  );

  leadersMenuOptions.forEach((menuOption) => {
    menuOption.addEventListener("click", function () {
      let gameType = menuOption.getAttribute("game-type");
      openLeadersPage(gameType);
    });
  });
}

async function openLeadersPage(gameType) {
  let tableTitle = "Лидеры";
  if (gameType == "loto") {
    tableTitle = "Лидеры лото";
  } else if (gameType == "domino") {
    tableTitle = "Лидеры домино";
  } else if (gameType == "nards") {
    tableTitle = "Лидеры нардов";
  }

  let lotoLeaders = await impHttp.getGameLeaders(gameType);

  let main = document.querySelector("main");
  if (main) {
    main.innerHTML = `<div class="main__container">
    <section class="leader-page">
      <div class="leader-page__header">
        <div class="leader-page__back"><</div>
        <div class="leader-page__title">${tableTitle}</div>
      </div>
      <div class="leader-page__main">
        <div class="leader-page__table leader-table">
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          <div class="leader-table__item leader-item">
            <div class="leader-item__number">1</div>
            <div class="leader-item__username">2voby</div>
            <div class="leader-item__wonsum">
              <div class="leader-item__wonsum-body">
                <span>1000</span> M
              </div>
            </div>
            <div class="leader-item__tokens">t: <span>12345</span></div>
          </div>
          
        </div>
      </div>
    </section>
  </div>`;

    // создаем лидеров в таблице лидеров
    let tableElement = document.querySelector(".leader-page__table");
    if (tableElement) {
      // сбрасываем все старые елементы
      tableElement.innerHTML = "";
      createLeaderesTable(tableElement, lotoLeaders.data);
    }
  }

  // создание победителей в таблицу
  function createLeaderesTable(table, data) {
    // sort data by tokens amount from max to min
    data = data.sort((a, b) => {
      if (b.tokens === a.tokens) {
        return b.moneyWon - a.moneyWon; // Фильтрация по moneyWon при равных tokens
      }
      return b.tokens - a.tokens;
    });

    // создаем елементы в таблицу

    for (let index = 0; index < data.length; index++) {
      const userObject = data[index];

      let userElement = document.createElement("div");
      userElement.classList.add("leader-table__item", "leader-item");
      userElement.innerHTML = `<div class="leader-item__number">${
        index + 1
      }</div>
        <div class="leader-item__username">${userObject.username}</div>
        <div class="leader-item__wonsum">
          <div class="leader-item__wonsum-body">
            <span>${userObject.moneyWon}</span> M
          </div>
        </div>
        <div class="leader-item__tokens">t: <span>${
          userObject.tokens
        }</span></div>`;
      table.appendChild(userElement);
    }
  }

  // функции выхода обратно, с таблици лидеров в меню
  let buttonBack = document.querySelector(".leader-page__back");
  if (buttonBack) {
    buttonBack.addEventListener("click", function () {
      openLeadersMenuPage();
    });
  }
}
