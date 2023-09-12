import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";

export function openLeadersMenuPage() {
  let siteLanguage = window.siteLanguage;
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
  let siteLanguage = window.siteLanguage;
  let preloader = document.querySelector(".page-preloader");

  let tableTitle = "Лидеры";
  if (gameType == "loto") {
    tableTitle = "Лидеры лото";
  } else if (gameType == "domino") {
    tableTitle = "Лидеры домино";
  } else if (gameType == "nards") {
    tableTitle = "Лидеры нардов";
  }

  const currentDate = new Date();

  const monthNames = siteLanguage.statsPage.menuHeader.mounthes;

  const monthNumber = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthName = monthNames[monthNumber];

  let main = document.querySelector("main");
  if (main) {
    main.innerHTML = `
    <div class="main__container footer__padding header__padding">
      <section class="leader-page">
        <div class="leader-page__head">
          <button class="leader-page__info">
            <img src="img/leader icons/info.png" alt="info" />
            ${siteLanguage.statsPage.informationButtonText}
          </button>
          <div class="leader-page__games">
            <button>
              <img src="img/leader icons/loto.png" alt="" />${siteLanguage.statsPage.menuHeader.gameLotoText}
            </button>
            <button>
              <img src="img/leader icons/nards.png" alt="" />${siteLanguage.statsPage.menuHeader.gameNardsText}
            </button>
            <button>
              <img src="img/leader icons/domino.png" alt="" />${siteLanguage.statsPage.menuHeader.gameBackgamonsText}
            </button>
            <div class="leader-page-games__season">
              <span class="games-season__month">${currentMonthName}</span>
              <span class="games-season__year">${currentYear}</span>
            </div>
          </div>
        </div>
        <div class="leader-page__table-head">
          <div class="table-header__name">${siteLanguage.statsPage.tableHeader.nameText}</div>
          <hr />
          <div class="table-header__winsum">${siteLanguage.statsPage.tableHeader.winsText}</div>
          <hr />
          <div class="table-header__bonuses">${siteLanguage.statsPage.tableHeader.bonusesText}</div>
        </div>
        <div class="leader-page__table-main-wrapper">
        <div class="leader-page__table-main">
          
        </div>
        </div>
      </section>
   </div>`;

    let lotoLeaders = await impHttp.getGameLeaders(gameType);

    if (!preloader.classList.contains("d-none")) {
      preloader.classList.add("d-none");
    }

    const infoButton = document.querySelector(".leader-page__info");
    infoButton.addEventListener("click", function () {
      impPopup.openInfoTokensPopup();
    });

    // создаем лидеров в таблице лидеров
    let tableElementWrapper = document.querySelector(
      ".leader-page__table-main"
    );
    let tableElement = document.querySelector(".leader-page__table-main");
    if (tableElement) {
      // сбрасываем все старые елементы
      tableElement.innerHTML = "";
      createLeaderesTable(tableElement, lotoLeaders.data, tableElementWrapper);
    }
  }

  // создание победителей в таблицу
  function createLeaderesTable(table, data, tableElementWrapper) {
    // sort data by tokens amount from max to min

    console.log("data", data);

    data = data.sort((a, b) => {
      if (b.gamesWon === a.gamesWon) {
        return b.moneyWon - a.moneyWon; // Фильтрация по moneyWon при равных tokens
      }
      return b.gamesWon - a.gamesWon;
    });

    // создаем елементы в таблицу

    for (let index = 0; index < 100; index++) {
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
          ${userObject.gamesWon}
        </p>
        <p class="leader-table__bonuses">
          <img
            class="leader-table__bonuses-icon"
            src="img/leader icons/star.png"
          />
          <span class="leader-item__tokens">${userObject.tokens}</span>
        </p>
        `;

      switch (index + 1) {
        case 1:
          let top1 = userElement.querySelector(".leader-table__user-number");
          top1.innerHTML = `  <img class="leader-icon" src="img/top1.png" alt="">`;
          break;
        case 2:
          let top2 = userElement.querySelector(".leader-table__user-number");
          top2.innerHTML = `  <img class="leader-icon" src="img/top2.png" alt="">`;
          break;
        case 3:
          let top3 = userElement.querySelector(".leader-table__user-number");
          top3.innerHTML = `  <img class="leader-icon" src="img/top3.png" alt="">`;
          break;

        default:
          break;
      }

      if (index + 1 == 1 || index + 1 == 2 || index + 1 == 3) {
        console.log(index + 1, userObject.username);
      }
      table.appendChild(userElement);
    }

    let localUser = localStorage.getItem("user");
    if (localUser) {
      localUser = JSON.parse(localUser);
    }
    let clientUsername = localUser.username;

    data.forEach((user, index) => {
      if (clientUsername == user.username) {
        if (index > 100) {
          let userElement = document.createElement("div");
          userElement.classList.add("leader-page__table-item", "leader-fixed");
          userElement.innerHTML = `
        <div class="leader-table__user">
          <div class="leader-table__user-number">
            ${index + 1})
          </div>
          <div class="leader-item__username">
            ${user.username}
          </div>
        </div>
        <p class="leader-table__winsum">
          ${user.gamesWon}
        </p>
        <p class="leader-table__bonuses">
          <img
            class="leader-table__bonuses-icon"
            src="img/leader icons/star.png"
          />
          <span class="leader-item__tokens">${user.tokens}</span>
        </p>
        `;

          tableElementWrapper.appendChild(userElement);
        }
      }
    });
  }

  // функции выхода обратно, с таблици лидеров в меню
  let buttonBack = document.querySelector(".leader-page__back");
  if (buttonBack) {
    buttonBack.addEventListener("click", function () {
      openLeadersMenuPage();
    });
  }
}
