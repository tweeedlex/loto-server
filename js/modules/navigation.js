import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impLotoNavigation from "./loto-navigation.js";

// let game = document.querySelector(".games");
// let lotoRooms = game.querySelectorAll(".loto-room");
// event listeners

export function addListeners(ws) {
  let game = document.querySelector(".games");
  let lotoRooms = game.querySelectorAll(".loto-room");

  lotoRooms.forEach((room) => {
    room.addEventListener("click", () => {
      // room.innerHTML = `<div class="loader"></div>`;
      console.log("pressed");
      const roomId = room.getAttribute("room");
      impLotoNavigation.openLotoRoom(ws, roomId);
    });
  });
}

export function redirectToMainPage(ws) {
  console.log("redirect");
  const main = document.querySelector("main");
  main.innerHTML = `
  <div class="main__container">
        <section class="games">
          <div class="games__container" id="loto">
            <a class="game loto-room loto-room-1" room="1">
              <div class="loto-room__body">
                <p class="game__title">Лото</p>
                <p>Онлайн: <span class="game__room-online">0</span></p>
                <p>Ставка: <span class="game__bet">20</span>p</p>
                <div class="game__until-start">
                  <p>До начала:</p>
                  <span class="game__until-start-timer">00:00</span>
                </div>
                <div class="game__until-finish">
                  <p>До конца:</p>
                  <span class="game__until-finish-timer">00:00</span>
                </div>
                <p class="game__room-bank">
                  Общий банк: <span class="game__room-bank-sum">0</span>p
                </p>
              </div>
            </a>
            <a class="game loto-room loto-room-2" room="2">
              <div class="loto-room__body">
                <p class="game__title">Лото</p>
                <p>Онлайн: <span class="game__room-online">0</span></p>
                <p>Ставка: <span class="game__bet">100</span>p</p>
                <p class="game__until-start">
                  До начала: <span class="game__until-start-timer">00:00</span>
                </p>
                <div class="game__until-finish">
                  <p>До конца:</p>
                  <span class="game__until-finish-timer">00:00</span>
                </div>
                <p class="game__room-bank">
                  Общий банк: <span class="game__room-bank-sum">0</span>p
                </p>
              </div>
            </a>
            <a class="game loto-room loto-room-3" room="3">
              <div class="loto-room__body">
                <p class="game__title">Лото</p>
                <p>Онлайн: <span class="game__room-online">0</span></p>
                <p>Ставка: <span class="game__bet">300</span>p</p>
                <p class="game__until-start">
                  До начала: <span class="game__until-start-timer">00:00</span>
                </p>
                <div class="game__until-finish">
                  <p>До конца:</p>
                  <span class="game__until-finish-timer">00:00</span>
                </div>
                <p class="game__room-bank">
                  Общий банк: <span class="game__room-bank-sum">0</span>p
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>
  `;
  addListeners(ws);
}
