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

export async function openLeadersPage(gameType) {
  let tableTitle = "Лидеры";
  if (gameType == "loto") {
    tableTitle = "Лидеры лото";
  } else if (gameType == "domino") {
    tableTitle = "Лидеры домино";
  } else if (gameType == "nards") {
    tableTitle = "Лидеры нардов";
  }

  const currentDate = new Date();

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const monthNumber = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = monthNames[monthNumber];

  let lotoLeaders = await impHttp.getGameLeaders(gameType);
  console.log(lotoLeaders);

  let main = document.querySelector("main");
  if (main) {
    main.innerHTML = `
    <div class="main__container">
      <section class="leader-page">
        <div class="leader-page__head">
          <button class="leader-page__info">
            <img src="img/leader icons/info.png" alt="info" />
            Информация
          </button>
          <div class="leader-page__games">
            <button>
              <img src="img/leader icons/loto.png" alt="" />Лото
            </button>
            <button>
              <img src="img/leader icons/nards.png" alt="" />Нарды
            </button>
            <button>
              <img src="img/leader icons/domino.png" alt="" />Домино
            </button>
            <div class="leader-page-games__season">
              <span class="games-season__month">${currentMonthName}</span>
              <span class="games-season__year">${currentYear}</span>
            </div>
          </div>
        </div>
        <div class="leader-page__table-head">
          <div class="table-header__name">ИМЯ</div>
          <hr />
          <div class="table-header__winsum">ВЫЙГРЫШ</div>
          <hr />
          <div class="table-header__bonuses">БОНУСЫ</div>
        </div>
        <div class="leader-page__table-main">
          <div class="leader-page__table-item">
            <p class="leader-table__user">
              <span class="leader-table__user-number"
                ><img src="img/leader icons/medal-gold.png" alt=""
              /></span>
              <span class="leader-item__username">user1</span>
            </p>
            <p class="leader-table__winsum">
              <img
                class="leader-table__winsum-icon"
                src="img/leader icons/coins.png"
              />
              <span class="leader-item__wonsum">20000.00</span>
            </p>
            <p class="leader-table__bonuses">
              <img
                class="leader-table__bonuses-icon"
                src="img/leader icons/star.png"
              />
              <span class="leader-item__tokens">1638803</span>
            </p>
          </div>
          <div class="leader-page__table-item">
            <p class="leader-table__user">
              <span class="leader-table__user-number"
                ><img src="img/leader icons/medal-silver.png" alt=""
              /></span>
              <span class="leader-item__username">user1</span>
            </p>
            <p class="leader-table__winsum">
              <img
                class="leader-table__winsum-icon"
                src="img/leader icons/coins.png"
              />
              <span class="leader-item__wonsum">20000.00</span>
            </p>
            <p class="leader-table__bonuses">
              <img
                class="leader-table__bonuses-icon"
                src="img/leader icons/star.png"
              />
              <span class="leader-item__tokens">1638803</span>
            </p>
          </div>
          <div class="leader-page__table-item">
            <p class="leader-table__user">
              <span class="leader-table__user-number"
                ><img src="img/leader icons/medal-bronze.png" alt=""
              /></span>
              <span class="leader-item__username">user1</span>
            </p>
            <p class="leader-table__winsum">
              <img
                class="leader-table__winsum-icon"
                src="img/leader icons/coins.png"
              />
              <span class="leader-item__wonsum">20000.00</span>
            </p>
            <p class="leader-table__bonuses">
              <img
                class="leader-table__bonuses-icon"
                src="img/leader icons/star.png"
              />
              <span class="leader-item__tokens">1638803</span>
            </p>
          </div>
          <div class="leader-page__table-item">
            <p class="leader-table__user">
              <span class="leader-table__user-number">1)</span>
              <span class="leader-item__username">user1</span>
            </p>
            <p class="leader-table__winsum">
              <img
                class="leader-table__winsum-icon"
                src="img/leader icons/coins.png"
              />
              <span class="leader-item__wonsum">20000.00</span>
            </p>
            <p class="leader-table__bonuses">
              <img
                class="leader-table__bonuses-icon"
                src="img/leader icons/star.png"
              />
              <span class="leader-item__tokens">1638803</span>
            </p>
          </div>
        </div>
      </section>
   </div>`;

    // создаем лидеров в таблице лидеров
    let tableElement = document.querySelector(".leader-page__table-main");
    if (tableElement) {
      // сбрасываем все старые елементы
      tableElement.innerHTML = "";
      createLeaderesTable(tableElement, lotoLeaders.data);
    }
  }

  // создание победителей в таблицу
  function createLeaderesTable(table, data) {
    // sort data by tokens amount from max to min
    console.log(data);
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
      userElement.classList.add("leader-page__table-item");
      userElement.innerHTML = `
        <div class="leader-table__user">
          <div class="leader-table__user-number">
            ${index + 1})
          </div>
          <div class="leader-item__username">
            ${userObject.username}
          </div>
        </div>
        <p class="leader-table__winsum">
          <img
            class="leader-table__winsum-icon"
            src="img/leader icons/coins.png"
          />
          ${userObject.moneyWon} M
        </p>
        <p class="leader-table__bonuses">
          <img
            class="leader-table__bonuses-icon"
            src="img/leader icons/star.png"
          />
          <span class="leader-item__tokens">${userObject.tokens}</span>
        </p>
        `;
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
