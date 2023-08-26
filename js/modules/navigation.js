import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impLotoNavigation from "./loto-navigation.js";
import * as impLeadersFunc from "./leaders.js";
import * as impSettingsFunc from "./settings.js";
import * as impProfileFunc from "./profile.js";
import * as impLotoNav from "./loto-navigation.js";

// let game = document.querySelector(".games");
// let lotoRooms = game.querySelectorAll(".loto-room");
// event listeners

export function addListeners(ws) {
  let game = document.querySelector(".games");
  let lotoRooms = game.querySelectorAll(".loto-room");

  lotoRooms.forEach((room) => {
    room.addEventListener("click", () => {
      const roomId = room.getAttribute("room");
      impLotoNavigation.openLotoRoom(window.ws, roomId);
    });
  });
}

export function addHashListeners() {
  window.addEventListener("hashchange", async function () {
    let hash = location.hash;
    if (!hash || hash == "" || hash == "#") {
      window.ws.close(
        3001,
        JSON.stringify({
          // roomId,
          // bet: bet,
          userId: window.userId,
          username: window.username,
          method: "disconnectGame",
        })
      );
      // clearInterval(lotoTimer);
      redirectToMainPage();
    } else if (hash.includes("loto-room")) {
      // open loto room waiting page if game is not started
      const roomId = Number(hash.split("-")[2][0]);
      const { data: isGameStarted } = await impHttp.isGameStarted(roomId);
      if (isGameStarted) {
        location.hash = "";
        return;
      }
      openRoomByHash(hash);
      const bet = impLotoGame.getBetByRoomId(roomId);
      ws.send(
        JSON.stringify({
          roomId,
          bet,
          username: window.username,
          userId: window.userId,
          method: "connectGame",
        })
      );
    } else if (hash.includes("loto-game")) {
      const query = new URLSearchParams(hash.split("?")[1]);
      const roomId = Number(hash.split("-")[2].split("?")[0]);
      const bet = impLotoGame.getBetByRoomId(roomId);
      const bank = Number(query.get("bank")).toFixed(2);
      const jackpot = Number(query.get("jackpot")).toFixed(2);
      const online = Number(query.get("online"));
      impLotoGame.openGamePage(
        +online || null,
        +bet || null,
        +bank || null,
        +roomId,
        +jackpot || null
      );
      ws.send(
        JSON.stringify({
          roomId,
          bet: bet,
          username: window.username,
          userId: window.userId,
          method: "connectGame",
        })
      );
    }
    switch (hash) {
      case "#leaders":
        impLeadersFunc.openLeadersMenuPage();
        break;
      case "#settings":
        impSettingsFunc.openSettingsPage();
        break;
      case "#profile":
        impProfileFunc.openProfilePage();
        break;
    }
  });
}

async function openRoomByHash(hash) {
  let body = document.querySelector("main");

  body.innerHTML = `
  <div class="loto-room-page">
    <div class="loto-room-content">
      <div class="loto-room-page__timer">00:00</div>
      <div class="loto-room-page__exit">Выйти</div>
      <div class="loto-room__gameinfo loto-gameinfo">
        <p class="loto-gameinfo__bet">Ставка: <span>0</span>M</p>
        <p class="loto-gameinfo__online">Онлайн: <span>0</span></p>
        <p class="loto-gameinfo__bank">Банк: <span>0</span>M</p>
      </div>
      <div class="room-jackpot">
      Джекпот: <span class="room-jackpot-sum">0</span>M
      </div>
      <div class="loto-room__main loto-gamemain"></div>
      <div class="loto-room__controlls loto-gamecontrolls">
        <div class="loto-gamecontrolls__buy">Купить билеты</div>
        <div class="loto-gamecontrolls__counter">
          <div class="loto-gamecontrolls__counter__minus">-</div>
          <div class="loto-gamecontrolls__counter__value">1</div>
          <div class="loto-gamecontrolls__counter__plus">+</div>
        </div>
      </div>
    </div>
  </div>`;

  const roomId = +hash.split("-")[2];
  const bet = impLotoGame.getBetByRoomId(Number(roomId));

  // убираем навигацию сайта
  let footer = document.querySelector("#footer");
  if (footer && !footer.classList.contains("d-none")) {
    footer.classList.add("d-none");
  }
  let userCards = await impHttp.getTickets();
  userCards = userCards.data;

  impLotoGame.showUserTickets(userCards, roomId);

  impLotoNav.counterTickets();
  impLotoNav.buyTickets(window.ws, roomId, bet);

  // выход из комнаты и отключение от вебсокета комнаты
  let exitButton = document.querySelector(".loto-room-page__exit");
  exitButton.addEventListener("click", async function () {
    location.hash = "";
  });
}

// use location.hash = ""
function redirectToMainPage() {
  const main = document.querySelector("main");
  main.innerHTML = `
  <div class="main__container">
  <section class="games">
    <div class="games__container" id="loto">
      <a class="game loto-room loto-room-1" room="1">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">0.20</span>М</p>
          <div class="game__until-start">
            <p>До начала:</p>
            <span class="game__until-start-timer">00:00</span>
          </div>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-2" room="2">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">0.50</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-3" room="3">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">1</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-4" room="4">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">5</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
      <a class="game loto-room loto-room-5" room="5">
        <div class="loto-room__body">
          <p class="game__title">Лото</p>
          <p>Онлайн: <span class="game__room-online">0</span></p>
          <p>Ставка: <span class="game__bet">10</span>М</p>
          <p class="game__until-start">
            До начала: <span class="game__until-start-timer">00:00</span>
          </p>
          <div class="game__until-finish">
            <p>До конца:</p>
            <span class="game__until-finish-timer">00:00</span>
          </div>
          <p class="game__room-bank">
            Общий банк: <span class="game__room-bank-sum">0</span>М
          </p>
          <p class="game__room-bank">
            Пред. банк: <span class="game__room-prevbank-sum">0</span>М
          </p>
          <p class="game__room-jackpot">
            Джекпот: <span class="game__room-jackpot-sum">0</span>М
          </p>
        </div>
      </a>
    </div>
  </section>
</div>
  `;
  addListeners(window.ws);
  // добавляем навигацию сайта
  let footer = document.querySelector("#footer");
  if (footer && footer.classList.contains("d-none")) {
    footer.classList.remove("d-none");
  }
}

export function pageNavigation(ws) {
  createPageNavBlock();
  let navMenu = document.querySelector(".menu-footer");
  if (navMenu) {
    let openGamesLobbyBtn = document.querySelector(".open-games-menu");
    let openLeadersMenuBtn = document.querySelector(".open-liders-menu");
    let openSettingsBtn = document.querySelector(".open-settings");
    let openProfileBtn = document.querySelector(".open-profile");

    // открытие страници лидеров
    openLeadersMenuBtn.addEventListener("click", function () {
      // ws.close();
      // impLeadersFunc.openLeadersMenuPage();
      location.hash = "#leaders";
    });

    // открытие страницы с играми
    openGamesLobbyBtn.addEventListener("click", function () {
      let isCurrGameMenuPage = document.querySelector(".games");
      if (!isCurrGameMenuPage) {
        location.hash = "";
        ws.send(
          JSON.stringify({
            username: window.username,
            userId: window.userId,
            method: "getAllInfo",
          })
        );

        // redirectToMainPage(ws);
        // pageNavigation(newWs);
      }
    });

    // открытие страницы с настройками
    openSettingsBtn.addEventListener("click", function () {
      // ws.close();
      // impSettingsFunc.openSettingsPage();
      location.hash = "#settings";
    });

    // открытие страницы с профилем
    openProfileBtn.addEventListener("click", function () {
      // ws.close();
      // impProfileFunc.openProfilePage();
      location.hash = "#profile";
    });
  }
}

export function createPageNavBlock() {
  let footer = document.querySelector("#footer");
  if (footer) {
    footer.innerHTML = `<div class="footer__container">
    <div class="foter__content">
      <div class="footer__menu menu-footer">
        <div class="menu-footer__item open-profile">Профиль</div>
        <div class="menu-footer__item">Чат</div>
        <div
          class="menu-footer__item menu-footer__main-item open-games-menu"
        >
          Игры
        </div>
        <div class="menu-footer__item open-liders-menu">Лидеры</div>
        <div class="menu-footer__item open-settings">Настройки</div>
      </div>
    </div>
  </div>`;
  }
}

export const updateBalance = (balance) => {
  balance = balance.toFixed(2);
  let balanceSpan = document.querySelector(".header__balance");
  if (balanceSpan) {
    balanceSpan.innerHTML = balance;
  }
};
