import * as impHttp from "./http.js";
import * as impLoto from "./navigation.js";

function generateRandomNumbersWithoutRepeats(min, max, count) {
  if (count > max - min + 1) {
    throw new Error("Can't generate random numbers without repeats");
  }

  let numbers = [];
  while (numbers.length < count) {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateLotoCard() {
  const numbersPerRow = 27;
  const minNumber = 1;
  const maxNumber = 90;
  const totalNumbers = 15;

  let lotoCard = [];

  let rowNumbers = generateRandomNumbersWithoutRepeats(
    minNumber,
    maxNumber,
    totalNumbers
  );
  lotoCard.push(rowNumbers);

  for (let i = lotoCard[0].length; i < numbersPerRow; i++) {
    lotoCard[0].push(" ");
  }

  return shuffleArray(lotoCard[0]);
}

export async function openGamePage(roomId, message, eventSource) {
  let body = document.querySelector("main");
  body.innerHTML = `<div class="loto-game-room-page">
  <div class="loto-game-room-page-content">
    <div class="loto-game-room__gameinfo loto-gameinfo">
      <p class="loto-gameinfo__bet">Ставка: <span>0р</span></p>
      <p class="loto-gameinfo__online">Игроков: <span>0</span></p>
      <p class="loto-gameinfo__bank">Банк: <span>0р</span></p>
    </div>
    <div class="loto-game-room__gameprocess">
    </div>
    <div class="loto-game-room__main loto-gamemain"></div>
  </div>
</div>`;
}

export async function gameInformation(roomId, messageData, eventSource) {
  let userTickets = await impHttp.getTickets();
  if (userTickets.status == 200) {
    userTickets = userTickets.data;
    userTickets.forEach((ticketInfo) => {
      let ticketCells = JSON.parse(ticketInfo.card);
      let ticketId = JSON.parse(ticketInfo.id);
      createTicket(ticketCells, ticketId);
    });
  }

  window.roomId = roomId;
  window.es = eventSource;

  // отображение онлайна
  updateLotoGameRoomInfo(messageData);
  // выпадание бочек
  startCasksDroping(messageData);
}

let isGameEnded = false;

function startCasksDroping(messageData) {
  let gameData = messageData.game;
  let gameprocessBlock = document.querySelector(".loto-game-room__gameprocess");
  let casks = gameData.casks;

  // casks.forEach((cask) => {
  //   let caskBlock = document.createElement("div");
  //   caskBlock.innerHTML = cask;

  //   gameprocessBlock.appendChild(caskBlock);
  // });

  let audio = new Audio();
  audio.src = "/client/sounds/cask.mp3";
  audio.autoplay = false;
  audio.volume = 0.35;

  let caskIndex = 0;
  setInterval(() => {
    if (!isGameEnded) {
      insertCask();
    }
  }, 1000);
  function insertCask() {
    if (caskIndex <= gameData.lastIndex) {
      let caskBlock = document.createElement("div");
      caskBlock.classList.add("loto-game-room__cask");
      caskBlock.innerHTML = casks[caskIndex];

      gameprocessBlock.appendChild(caskBlock);
      compareDigits(casks[caskIndex]);

      caskIndex++;

      if (gameprocessBlock.children.length > 6) {
        gameprocessBlock.removeChild(gameprocessBlock.children[0]);
      }

      setTimeout(() => {
        // Сначала сбрасываем цвет всех бочек на белый
        gameprocessBlock
          .querySelectorAll(".loto-game-room__cask")
          .forEach((cask) => {
            cask.style.background = "#fff";
          });
        // Устанавливаем желтый цвет только для последней вставленной бочки
        caskBlock.style.background = "#cac832";
      }, 0); // Переключаем цвет после добавления

      // play sound of cask

      // потом будем смотреть номер бочки и играть звук по номеру

      if (!isGameEnded) {
        // setTimeout(insertCask, 1000);
        audio.play();
      } // Вставляем следующую бочку через 3 секунды
    }

    if (caskIndex == gameData.lastIndex) {
      checkLotoWin(gameData.winnersIds);
    }
  }
}

function compareDigits(currDigit) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = document.querySelectorAll(".loto-gamemain__ticket");
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        if (cell.innerHTML == currDigit) {
          cell.classList.add("active");
        }
      });
    });
  }
}

async function stopGame() {
  const main = document.querySelector("main");
  main.innerHTML = `
    <div class="main__container">
        <section class="games">
          <div class="games__container" id="loto">
            <a class="game loto-room loto-room-1" room="1">
              <p class="game__title">Лото</p>
              <p>Ставка: <span class="game__bet">20р</span></p>
              <p>Игроков: <span class="game__online">0</span>/500</p>
            </a>
            <a class="game loto-room loto-room-2" room="2">
              <p class="game__title">Лото</p>
              <p>Ставка: <span class="game__bet">100р</span></p>
              <p>Игроков: <span class="game__online">0</span>/500</p>
            </a>
            <a class="game loto-room loto-room-3" room="3">
              <p class="game__title">Лото</p>
              <p>Ставка: <span class="game__bet">300р</span></p>
              <p>Игроков: <span class="game__online">0</span>/500</p>
            </a>
          </div>
        </section>
      </div>
  `;
  let responce = await impHttp.disconnectRoom(window.roomId);
  window.es.close();

  window.roomId = null;
  window.es = null;
  impLoto.lotoNavigation();

  isGameEnded = false;
  location.reload();
}

function checkLotoWin(winnerTicketsIds) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = document.querySelectorAll(".loto-gamemain__ticket");
    let winner = false;
    winnerTicketsIds.forEach((winnerTicketId) => {
      tickets.forEach((ticket) => {
        let userTicketId = ticket.getAttribute("ticket-id");
        if (+userTicketId == winnerTicketId) {
          winner = true;
        }
      });
    });

    if (winner) {
      alert("Ты победитель!!!");
      stopGame();
      isGameEnded = true;
    } else {
      alert("ТЫ проиграл(");
      stopGame();
      isGameEnded = true;
    }
  }
}

function createTicket(cells, id) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let ticket = document.createElement("ul");
    ticket.classList.add("loto-gamemain__ticket");
    ticket.setAttribute("ticket-id", id);
    cells.forEach((cell) => {
      let ticketCell = document.createElement("li");
      ticketCell.classList.add("ticket-cell");
      ticketCell.innerHTML = cell;
      ticket.appendChild(ticketCell);
    });
    ticketsBody.appendChild(ticket);
  }
}

function updateLotoGameRoomInfo(data) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoOnline = lotoGameInfo.querySelector(".loto-gameinfo__online");
    let lotoBet = lotoGameInfo.querySelector(".loto-gameinfo__bet");
    let lotoBank = lotoGameInfo.querySelector(".loto-gameinfo__bank");

    lotoOnline.querySelector("span").innerHTML = `${data.information.online}`;
    lotoBet.querySelector("span").innerHTML = `${data.information.bet}p`;
    lotoBank.querySelector("span").innerHTML = `${data.information.bank}p`;
  }
}
