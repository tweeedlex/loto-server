import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impLotoNavigation from "./loto-navigation.js";
import * as impLeadersFunc from "./leaders.js";
import * as impSettingsFunc from "./settings.js";
import * as impProfileFunc from "./profile.js";
import * as impLotoNav from "./loto-navigation.js";
import * as impPopup from "./popup.js";
import * as impMoveElement from "./move-element.js";
import * as impAudio from "./audio.js";
let preloader = document.querySelector(".page-preloader");
let header = document.querySelector("header");
let main = document.querySelector("main");
let footer = document.querySelector("footer");
let mainContainer = document.querySelector(".main__container");
mainContainer.classList.add("header__padding");

// let game = document.querySelector(".games");
// let lotoRooms = game.querySelectorAll(".loto-room");
// event listeners

export function hideAuthorization() {
  const auth = document.querySelector(".registration");
  auth.classList.remove("opened");
}

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

export async function addHashListeners() {
  location.hash = "#";
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    mainContainer.classList.add("header__padding");
  }

  // проверяем или есть у нас тикеты и кидаем куда надо
  const ticketsResponce = await impHttp.getTickets();
  if (ticketsResponce.status == 200) {
    let userTickets = ticketsResponce.data;
    if (
      userTickets.length > 0 &&
      !location.hash.includes("loto-game") &&
      !location.hash.includes("loto-room")
    ) {
      const roomId = userTickets[0].gameLevel;
      const isGameStartedRes = await impHttp.isGameStarted(roomId);
      if (isGameStartedRes.status == 200) {
        let isGameStarted = isGameStartedRes.data;
        if (JSON.parse(isGameStarted) == true) {
          location.hash = `#loto-game-${roomId}`;
        } else {
          location.hash = `#loto-room-${roomId}`;
        }
      } else {
        if (!preloader.classList.contains("d-none")) {
          preloader.classList.add("d-none");
        }
      }
    } else {
      if (!preloader.classList.contains("d-none")) {
        preloader.classList.add("d-none");
      }
    }
  } else {
    if (!preloader.classList.contains("d-none")) {
      preloader.classList.add("d-none");
    }
  }

  // на изменение хеша
  window.addEventListener("hashchange", async function () {
    if (header.classList.contains("d-none")) {
      header.classList.remove("d-none");
      mainContainer.classList.add("header__padding");
    }

    let hash = location.hash;

    if (!hash || hash == "" || hash == "#") {
      let navMenu = document.querySelector(".menu-footer");
      let navButtons = navMenu.querySelectorAll(".active");
      navButtons.forEach((button) => button.classList.remove("active"));
      let openGamesLobbyBtn = document.querySelector(".open-games-menu");
      openGamesLobbyBtn.classList.add("active");

      // закрыть вебсокет
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
      redirectToMainPage();
      preloader.classList.remove("d-none");

      const ticketsResponce = await impHttp.getTickets();
      if (ticketsResponce.status == 200) {
        let userTickets = ticketsResponce.data;
        if (
          userTickets.length > 0 &&
          !location.hash.includes("loto-game") &&
          !location.hash.includes("loto-room")
        ) {
          const roomId = userTickets[0].gameLevel;
          const isGameStartedRes = await impHttp.isGameStarted(roomId);
          // preloader.classList.add("d-none");
          if (isGameStartedRes.status == 200) {
            let isGameStarted = isGameStartedRes.data;
            if (JSON.parse(isGameStarted) == true) {
              location.hash = `#loto-game-${roomId}`;
            } else {
              location.hash = `#loto-room-${roomId}`;
            }
          } else {
            if (!preloader.classList.contains("d-none")) {
              preloader.classList.add("d-none");
            }
          }
          // location.hash = `#loto-room-${roomId}`;
        } else {
          if (!preloader.classList.contains("d-none")) {
            preloader.classList.add("d-none");
          }
        }
      } else {
        if (!preloader.classList.contains("d-none")) {
          preloader.classList.add("d-none");
        }
      }
    } else if (hash.includes("loto-room")) {
      // preloader.classList.remove("d-none");

      // open loto room waiting page if game is not started
      const roomId = Number(hash.split("-")[2][0]);

      const ticketsResponce = await impHttp.getTickets();
      const isGameStartedRes = await impHttp.isGameStarted(roomId);

      if (ticketsResponce.status == 200 && isGameStartedRes.status == 200) {
        let userTickets = ticketsResponce.data;
        let isGameStarted = isGameStartedRes.data;
        if (userTickets.length > 0 && isGameStarted == true) {
          let userTicketsRoomId = userTickets[0].gameLevel;
          location.hash = `#loto-game-${userTicketsRoomId}`;
        } else if (userTickets.length > 0 && isGameStarted == false) {
          let userTicketsRoomId = userTickets[0].gameLevel;
          if (roomId != userTicketsRoomId) {
            location.hash = `#loto-room-${userTicketsRoomId}`;
          }
        } else if (isGameStarted == true && userTickets == 0) {
          location.hash = "";
        }
      }

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
      await openRoomByHash(hash);
      if (!preloader.classList.contains("d-none")) {
        preloader.classList.add("d-none");
      }
    } else if (hash.includes("loto-game")) {
      if (!header.classList.contains("d-none")) {
        header.classList.add("d-none");
        mainContainer.classList.remove("header__padding");
      }

      const query = new URLSearchParams(hash.split("?")[1]);
      const roomId = Number(hash.split("-")[2].split("?")[0]);

      // проверка на хеш и билеты

      const ticketsResponce = await impHttp.getTickets();
      const isGameStartedRes = await impHttp.isGameStarted(roomId);
      if (ticketsResponce.status == 200 && isGameStartedRes.status == 200) {
        let userTickets = ticketsResponce.data;
        let isGameStarted = isGameStartedRes.data;
        if (userTickets.length > 0 && isGameStarted == true) {
          let userTicketsRoomId = userTickets[0].gameLevel;
          if (roomId != userTicketsRoomId) {
            location.hash = `#loto-game-${userTicketsRoomId}`;
          }
        } else if (userTickets.length > 0 && isGameStarted == false) {
          let userTicketsRoomId = userTickets[0].gameLevel;
          location.hash = `#loto-room-${userTicketsRoomId}`;
        } else if (isGameStarted == true && userTickets == 0) {
          location.hash = "";
        }
      }

      // даные об игре
      const bet = impLotoGame.getBetByRoomId(roomId);
      const bank = Number(query.get("bank")).toFixed(2);
      const jackpot = Number(query.get("jackpot")).toFixed(2);
      const online = Number(query.get("online"));
      const isJackpotPlaying = JSON.parse(query.get("isJackpotPlaying"));

      ws.send(
        JSON.stringify({
          roomId,
          bet: bet,
          username: window.username,
          userId: window.userId,
          method: "connectGame",
        })
      );

      if (!preloader.classList.contains("d-none")) {
        preloader.classList.add("d-none");
      }
      await impLotoGame.openGamePage(
        +online || null,
        +bet || null,
        +bank || null,
        +roomId,
        +jackpot || null,
        isJackpotPlaying || null
      );
    }

    let navMenu = document.querySelector(".menu-footer");
    let navButtons = navMenu.querySelectorAll(".active");
    let openGamesLobbyBtn = document.querySelector(".open-games-menu");
    let openLeadersMenuBtn = document.querySelector(".open-liders-menu");
    let openSettingsBtn = document.querySelector(".open-settings");
    let openProfileBtn = document.querySelector(".open-profile");
    switch (hash) {
      case "#leaders":
        // impLeadersFunc.openLeadersMenuPage();
        if (preloader.classList.contains("d-none")) {
          preloader.classList.remove("d-none");
        }
        mainContainer.classList.add("header__padding");
        mainContainer.classList.add("footer__padding");
        header.classList.remove("d-none");
        footer.classList.remove("d-none");

        impLeadersFunc.openLeadersPage("loto");
        navButtons.forEach((button) => button.classList.remove("active"));

        openLeadersMenuBtn.classList.add("active");
        break;

      case "#profile":
        if (preloader.classList.contains("d-none")) {
          preloader.classList.remove("d-none");
        }

        impProfileFunc.openProfilePage();
        header.classList.add("d-none");
        mainContainer.classList.remove("header__padding");
        navButtons.forEach((button) => button.classList.remove("active"));

        openProfileBtn.classList.add("active");
        break;
      case "#deposit":
        await impProfileFunc.openBalance();
        header.classList.add("d-none");
        mainContainer.classList.remove("header__padding");
        navButtons.forEach((button) => button.classList.remove("active"));

        openSettingsBtn.classList.add("active");

        break;
    }
  });
}

async function openRoomByHash(hash) {
  let body = document.querySelector("main");
  header.classList.remove("d-none");

  body.innerHTML = `
  <div class="main__container header__padding">
  <div class="loto-room-page ">
  <div class="loto-room-content">
    <div class="loto-room-page__timer">
      <img src="img/timer-icon.png" alt="" /><span>00:00</span>
    </div>
    <div class="room-jackpot">
      <div class="room-jackpot-sum">
        <img src="img/jackpot-icon.png" alt="" /><span>0</span> ₼
      </div>
      <div class="room-jackpot-question">
        <img src="img/question-tag.png" alt="" />
      </div>
    </div>
    <div class="loto-room-page__exit">
      <span>Выйти</span> <img src="img/logout.png" alt="" />
    </div>
    <div class="loto-room__gameinfo loto-gameinfo">
      <div class="loto-gameinfo__top-row">
        <p class="loto-gameinfo__top-row-item loto-gameinfo__bet">
          Ставка: <span>0</span> ₼
        </p>
        <p class="loto-gameinfo__top-row-item loto-gameinfo__bank">
          Банк: <span>0</span> ₼
        </p>
        <div class="loto-room-page__exit-wrapper"></div>
      </div>
      <div class="loto-gameinfo__bottom-row">
        <p class="loto-gameinfo__online">
          <img src="img/online-icon.png" alt="" /> <span>0</span>
        </p>
        <p class="loto-gameinfo__timer-wrapper"></p>
        <p class="loto-gameinfo__auto-button active">
          <img src="img/autogame-icon.png" alt="" /><span>АВТО</span>
        </p>
        <p class="loto-gameinfo__jackpot-block-wrapper"></p>
        <p class="loto-gameinfo__sounds-button active">
          <img src="img/profile icons/sound.png" alt="" />
        </p>
      </div>
    </div>
    <div class="loto-room__main loto-gamemain"></div>
    <div class="loto-room__controlls loto-gamecontrolls">
      <div class="loto-gamecontrolls__buy">Купить билет</div>
      <div class="loto-gamecontrolls__counter">
        <div class="loto-gamecontrolls__counter__minus">-</div>
        <div class="loto-gamecontrolls__counter__value">1</div>
        <div class="loto-gamecontrolls__counter__plus">+</div>
      </div>
    </div>
  </div>
</div>
</div>`;

  impMoveElement.moveElement(
    "loto-room-content",
    "loto-room-page__timer",
    "loto-gameinfo",
    "loto-gameinfo__timer-wrapper",
    998
  );

  impMoveElement.moveElement(
    "loto-room-content",
    "room-jackpot",
    "loto-gameinfo",
    "loto-gameinfo__jackpot-block-wrapper",
    998
  );

  impMoveElement.moveElement(
    "loto-room-content",
    "loto-room-page__exit",
    "loto-gameinfo",
    "loto-room-page__exit-wrapper",
    768
  );

  const jackpotInformationButton = document.querySelector(
    ".room-jackpot-question"
  );

  jackpotInformationButton.addEventListener("click", function () {
    impPopup.openJackpotInfoPopup();
  });

  const autoButton = document.querySelector(".loto-gameinfo__auto-button");

  autoButton.addEventListener("click", () => {
    if (autoButton.classList.contains("active")) {
      autoButton.classList.remove("active");
      localStorage.setItem("auto-play", false);
    } else {
      autoButton.classList.add("active");
      localStorage.setItem("auto-play", true);
    }
  });

  let autoPlay = localStorage.getItem("auto-play");
  if (autoPlay == "true") {
    autoButton.classList.add("active");
  } else {
    autoButton.classList.remove("active");
  }

  const soundButton = document.querySelector(".loto-gameinfo__sounds-button");

  let menuSoundsAllowed = localStorage.getItem("sounds-menu");
  let gameSoundsAllowed = localStorage.getItem("sounds-game");

  if (menuSoundsAllowed == "true" || gameSoundsAllowed == "true") {
    soundButton.classList.add("active");
  } else {
    soundButton.classList.remove("active");
  }

  soundButton.addEventListener("click", () => {
    toggleSound();
  });

  const toggleSound = () => {
    if (soundButton.classList.contains("active")) {
      soundButton.classList.remove("active");
      localStorage.setItem("sounds-game", false);
      localStorage.setItem("sounds-menu", false);
      impAudio.setGameSoundsAllowed(false);
      impAudio.setMenuSoundsAllowed(false);
    } else {
      soundButton.classList.add("active");
      localStorage.setItem("sounds-game", true);
      localStorage.setItem("sounds-menu", true);
      impAudio.setGameSoundsAllowed(true);
      impAudio.setMenuSoundsAllowed(true);
    }
  };

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
  if (exitButton) {
    exitButton.addEventListener("click", async function () {
      const boughtTickets = document.querySelectorAll(
        ".loto-gamemain__ticket.bought-ticket"
      );
      if (boughtTickets.length > 0) {
        impPopup.openExitPopup(
          "Ваша ставка будет анулирована. Вы точно хотите выйти?",
          Number(roomId),
          bet
        );
      } else {
        location.hash = "";
      }
    });
  }
}

// use location.hash = ""
function redirectToMainPage() {
  const main = document.querySelector("main");
  main.innerHTML = "";
  let main__container = document.createElement("div");
  main__container.classList.add("main__container");

  main__container.innerHTML = `
 
  <section class="games">
  <div class="games__container" id="loto">
    <a class="game loto-room loto-room-1" room="1">
      <div class="loto-room__body">
        <div class="loto-room__body-left room-left">
          <div class="room-left__item room-left__item-1">
            <div class="logo">
              <img src="img/loto-room-card-logo.png" alt="" />
            </div>
            <div class="room-left__item-timer-block">
              <p class="timer-block__text">Ожидание</p>
              <span class="timer-block__timer">00:00</span>
            </div>
          </div>
          <div class="room-left__item room-left__item-2">
            <div class="room-left__item-info-row lobby-room-bet">
              <img src="img/bank-icon.png" alt="" />
              <p><span>0</span> ₼</p>
            </div>
            <div
              class="room-left__item-info-row room-left__item-info-row-green lobby-room-online"
            >
              <img src="img/lobby-online-icon.png" alt="" />
              <p>ИГРОКОВ ОНЛАЙН: <span>0</span></p>
            </div>
          </div>
          <div class="room-left__item room-left__item-3">
            <div class="room-left__item-info-row">
              <img src="img/bank-before-icon.png" alt="" />
              <p>
                Сумма выйгрыша в пред. игре:
                <span class="game__room-prevbank-sum">0</span> ₼
              </p>
            </div>
          </div>
        </div>
        <div class="loto-room__body-right">
          <div class="loto-room__body-right__jackpot-text">
            <img src="img/jackpot-text.png" alt="" />
          </div>
          <div class="loto-room__body-right__jackpot">
            <img src="img/room-jackpot-img.png" alt="" />
            <p class="loto-room__body-right__jackpot-sum">
              <span class="game__room-jackpot-sum"> 0 </span>
              ₼
            </p>
          </div>
          <div class="loto-room__body-right__price-block">
            <p class="price-text">Цена билета:</p>
            <button class="price">
              <div class="price-money"><span>0.20</span> ₼</div>
              <div class="price-tockens">
                x2
                <div class="price-tockens__decor">
                  <img src="img/room-tokens-decor.png" alt="" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </a>
    <a class="game loto-room loto-room-2" room="2">
      <div class="loto-room__body">
        <div class="loto-room__body-left room-left">
          <div class="room-left__item room-left__item-1">
            <div class="logo">
              <img src="img/loto-room-card-logo.png" alt="" />
            </div>
            <div class="room-left__item-timer-block">
              <p class="timer-block__text">Ожидание</p>
              <span class="timer-block__timer">00:00</span>
            </div>
          </div>
          <div class="room-left__item room-left__item-2">
            <div class="room-left__item-info-row lobby-room-bet">
              <img src="img/bank-icon.png" alt="" />
              <p><span>0</span> ₼</p>
            </div>
            <div
              class="room-left__item-info-row room-left__item-info-row-green lobby-room-online"
            >
              <img src="img/lobby-online-icon.png" alt="" />
              <p>ИГРОКОВ ОНЛАЙН: <span>0</span></p>
            </div>
          </div>
          <div class="room-left__item room-left__item-3">
            <div class="room-left__item-info-row">
              <img src="img/bank-before-icon.png" alt="" />
              <p>
                Сумма выйгрыша в пред. игре:
                <span class="game__room-prevbank-sum">0</span> ₼
              </p>
            </div>
          </div>
        </div>
        <div class="loto-room__body-right">
          <div class="loto-room__body-right__jackpot-text">
            <img src="img/jackpot-text.png" alt="" />
          </div>
          <div class="loto-room__body-right__jackpot">
            <img src="img/room-jackpot-img.png" alt="" />
            <p class="loto-room__body-right__jackpot-sum">
              <span class="game__room-jackpot-sum"> 0 </span>
              ₼
            </p>
          </div>
          <div class="loto-room__body-right__price-block">
            <p class="price-text">Цена билета:</p>
            <button class="price">
              <div class="price-money"><span>0.50</span> ₼</div>
              <div class="price-tockens">
                x5
                <div class="price-tockens__decor">
                  <img src="img/room-tokens-decor.png" alt="" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </a>
    <a class="game loto-room loto-room-3" room="3">
      <div class="loto-room__body">
        <div class="loto-room__body-left room-left">
          <div class="room-left__item room-left__item-1">
            <div class="logo">
              <img src="img/loto-room-card-logo.png" alt="" />
            </div>
            <div class="room-left__item-timer-block">
              <p class="timer-block__text">Ожидание</p>
              <span class="timer-block__timer">00:00</span>
            </div>
          </div>
          <div class="room-left__item room-left__item-2">
            <div class="room-left__item-info-row lobby-room-bet">
              <img src="img/bank-icon.png" alt="" />
              <p><span>0</span> ₼</p>
            </div>
            <div
              class="room-left__item-info-row room-left__item-info-row-green lobby-room-online"
            >
              <img src="img/lobby-online-icon.png" alt="" />
              <p>ИГРОКОВ ОНЛАЙН: <span>0</span></p>
            </div>
          </div>
          <div class="room-left__item room-left__item-3">
            <div class="room-left__item-info-row">
              <img src="img/bank-before-icon.png" alt="" />
              <p>
                Сумма выйгрыша в пред. игре:
                <span class="game__room-prevbank-sum">0</span> ₼
              </p>
            </div>
          </div>
        </div>
        <div class="loto-room__body-right">
          <div class="loto-room__body-right__jackpot-text">
            <img src="img/jackpot-text.png" alt="" />
          </div>
          <div class="loto-room__body-right__jackpot">
            <img src="img/room-jackpot-img.png" alt="" />
            <p class="loto-room__body-right__jackpot-sum">
              <span class="game__room-jackpot-sum"> 0 </span>
              ₼
            </p>
          </div>
          <div class="loto-room__body-right__price-block">
            <p class="price-text">Цена билета:</p>
            <button class="price">
              <div class="price-money"><span>1</span> ₼</div>
              <div class="price-tockens">
                x10
                <div class="price-tockens__decor">
                  <img src="img/room-tokens-decor.png" alt="" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </a>
    <a class="game loto-room loto-room-4" room="4">
      <div class="loto-room__body">
        <div class="loto-room__body-left room-left">
          <div class="room-left__item room-left__item-1">
            <div class="logo">
              <img src="img/loto-room-card-logo.png" alt="" />
            </div>
            <div class="room-left__item-timer-block">
              <p class="timer-block__text">Ожидание</p>
              <span class="timer-block__timer">00:00</span>
            </div>
          </div>
          <div class="room-left__item room-left__item-2">
            <div class="room-left__item-info-row lobby-room-bet">
              <img src="img/bank-icon.png" alt="" />
              <p><span>0</span> ₼</p>
            </div>
            <div
              class="room-left__item-info-row room-left__item-info-row-green lobby-room-online"
            >
              <img src="img/lobby-online-icon.png" alt="" />
              <p>ИГРОКОВ ОНЛАЙН: <span>0</span></p>
            </div>
          </div>
          <div class="room-left__item room-left__item-3">
            <div class="room-left__item-info-row">
              <img src="img/bank-before-icon.png" alt="" />
              <p>
                Сумма выйгрыша в пред. игре:
                <span class="game__room-prevbank-sum">0</span> ₼
              </p>
            </div>
          </div>
        </div>
        <div class="loto-room__body-right">
          <div class="loto-room__body-right__jackpot-text">
            <img src="img/jackpot-text.png" alt="" />
          </div>
          <div class="loto-room__body-right__jackpot">
            <img src="img/room-jackpot-img.png" alt="" />
            <p class="loto-room__body-right__jackpot-sum">
              <span class="game__room-jackpot-sum"> 0 </span>
              ₼
            </p>
          </div>
          <div class="loto-room__body-right__price-block">
            <p class="price-text">Цена билета:</p>
            <button class="price">
              <div class="price-money"><span>5</span> ₼</div>
              <div class="price-tockens">
                x50
                <div class="price-tockens__decor">
                  <img src="img/room-tokens-decor.png" alt="" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </a>
    <a class="game loto-room loto-room-5" room="5">
      <div class="loto-room__body">
        <div class="loto-room__body-left room-left">
          <div class="room-left__item room-left__item-1">
            <div class="logo">
              <img src="img/loto-room-card-logo.png" alt="" />
            </div>
            <div class="room-left__item-timer-block">
              <p class="timer-block__text">Ожидание</p>
              <span class="timer-block__timer">00:00</span>
            </div>
          </div>
          <div class="room-left__item room-left__item-2">
            <div class="room-left__item-info-row lobby-room-bet">
              <img src="img/bank-icon.png" alt="" />
              <p><span>0</span> ₼</p>
            </div>
            <div
              class="room-left__item-info-row room-left__item-info-row-green lobby-room-online"
            >
              <img src="img/lobby-online-icon.png" alt="" />
              <p>ИГРОКОВ ОНЛАЙН: <span>0</span></p>
            </div>
          </div>
          <div class="room-left__item room-left__item-3">
            <div class="room-left__item-info-row">
              <img src="img/bank-before-icon.png" alt="" />
              <p>
                Сумма выйгрыша в пред. игре:
                <span class="game__room-prevbank-sum">0</span> ₼
              </p>
            </div>
          </div>
        </div>
        <div class="loto-room__body-right">
          <div class="loto-room__body-right__jackpot-text">
            <img src="img/jackpot-text.png" alt="" />
          </div>
          <div class="loto-room__body-right__jackpot">
            <img src="img/room-jackpot-img.png" alt="" />
            <p class="loto-room__body-right__jackpot-sum">
              <span class="game__room-jackpot-sum"> 0 </span>
              ₼
            </p>
          </div>
          <div class="loto-room__body-right__price-block">
            <p class="price-text">Цена билета:</p>
            <button class="price">
              <div class="price-money"><span>10</span> ₼</div>
              <div class="price-tockens">
                x100
                <div class="price-tockens__decor">
                  <img src="img/room-tokens-decor.png" alt="" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </a>
  </div>
</section>
   
  `;
  main.appendChild(main__container);

  addListeners(window.ws);

  // добавляем навигацию сайта
  let footer = document.querySelector("#footer");
  header.classList.remove("d-none");
  footer.classList.remove("d-none");
  main__container.classList.add("footer__padding", "header__padding");
}

export function pageNavigation(ws) {
  let footer = document.querySelector("#footer");
  // добавляем стили навигации на сайт
  if (footer && footer.classList.contains("d-none")) {
    footer.classList.remove("d-none");
    mainContainer.classList.add("footer__padding");
  }
  let headerTopupBalance = document.querySelector(".header__balance-block");
  if (headerTopupBalance) {
    headerTopupBalance.addEventListener("click", function () {
      if (
        location.hash.includes("loto-room") ||
        location.hash.includes("loto-game")
      ) {
        return;
      }
      location.hash = "#deposit";
    });
  }

  createPageNavBlock();
  let navMenu = document.querySelector(".menu-footer");
  if (navMenu) {
    let openGamesLobbyBtn = document.querySelector(".open-games-menu");
    let openLeadersMenuBtn = document.querySelector(".open-liders-menu");
    let openSettingsBtn = document.querySelector(".open-settings");
    let openProfileBtn = document.querySelector(".open-profile");
    const navButtons = [
      openGamesLobbyBtn,
      openLeadersMenuBtn,
      openSettingsBtn,
      openProfileBtn,
    ];

    // открытие страници лидеров
    openLeadersMenuBtn.addEventListener("click", function () {
      // ws.close();
      // impLeadersFunc.openLeadersMenuPage();
      location.hash = "#leaders";
      navButtons.forEach((btn) => btn.classList.remove("active"));
      openLeadersMenuBtn.classList.add("active");
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

        navButtons.forEach((btn) => btn.classList.remove("active"));
        openGamesLobbyBtn.classList.add("active");

        // redirectToMainPage(ws);
        // pageNavigation(newWs);
      }
    });

    // открытие страницы с настройками
    openSettingsBtn.addEventListener("click", async function () {
      // ws.close();
      // impSettingsFunc.openSettingsPage();
      // await impProfileFunc.openBalance();
      location.hash = "#deposit";
      navButtons.forEach((btn) => btn.classList.remove("active"));
      openSettingsBtn.classList.add("active");

      // location.hash = "#settings";
    });

    // открытие страницы с профилем
    openProfileBtn.addEventListener("click", function () {
      // ws.close();
      // impProfileFunc.openProfilePage();
      location.hash = "#profile";
      navButtons.forEach((btn) => btn.classList.remove("active"));
      openProfileBtn.classList.add("active");
    });
  }
}

export function createPageNavBlock() {
  let footer = document.querySelector("#footer");
  if (footer) {
    footer.innerHTML = `<footer id="footer"> 
    <div class="footer__container">
     <div class="foter__content">
       <div class="footer__menu menu-footer">
         <div class="menu-footer__item open-profile"><img src="img/profile-button.png" alt=""></div>
         <div class="menu-footer__item"><img src="img/chat.png" alt=""></div>
         <div
           class="menu-footer__item menu-footer__main-item open-games-menu active"
         >
         <img src="img/games.png" alt="">
         </div>
         <div class="menu-footer__item open-liders-menu"><img src="img/leaders.png" alt=""></div>
         <div class="menu-footer__item open-settings"><img src="img/deposit.png" alt=""></div>
       </div>
     </div>
   </div>
 </footer>`;
  }
}

export const updateBalance = (balance) => {
  balance = balance.toFixed(2);
  let balanceSpan = document.querySelector(".header__balance");
  if (balanceSpan) {
    balanceSpan.innerHTML = balance;
  }
};

export const applyDefaultSettings = () => {
  if (!localStorage.getItem("auto-play")) {
    localStorage.setItem("auto-play", true);
  }
  if (!localStorage.getItem("sounds-game")) {
    localStorage.setItem("sounds-game", true);
  }
  if (!localStorage.getItem("sounds-menu")) {
    localStorage.setItem("sounds-menu", true);
  }
  if (!localStorage.getItem("cask-color")) {
    localStorage.setItem("cask-color", "yellow");
  }
};
