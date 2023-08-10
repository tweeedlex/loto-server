import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impNav from "./navigation.js";
import * as impPopup from "./popup.js";
let lotoTimer;
let intervals = [];
let activeTimers = [];
let activeFinishTimers = [];

export const connectWebsocketFunctions = () => {
  const ws = new WebSocket(`ws://localhost:5001/game`);
  let timerStarted = false;

  ws.onopen = () => {
    console.log("Подключение установлено");
    ws.send(
      JSON.stringify({
        username: window.username,
        userId: window.userId,
        method: "connectGeneral",
      })
    );
  };

  ws.onmessage = async (event) => {
    let msg = JSON.parse(event.data);
    switch (msg.method) {
      case "connectGeneral":
        console.log(msg);
        break;
      case "allRoomsOnline":
        console.log(msg);
        updateAllRoomsOnline(msg.rooms);
        break;
      case "updateAllRoomsBank":
        console.log(msg);
        updateAllRoomsBet(msg.bank);
        break;
      case "allRoomsStartTimers":
        console.log(msg);
        for (let timer of activeTimers) {
          clearInterval(timer);
        }
        startMenuTimerLobby(msg.timers);
        // updateAllRoomsBet(msg.bank);
        break;
      case "allRoomsFinishTimers":
        console.log(msg);
        for (let timer of activeFinishTimers) {
          clearInterval(timer);
        }
        startMenuTimerGame(msg.timers);
        // updateAllRoomsBet(msg.bank);
        break;
      case "connectGame":
        console.log(`пользователь ${msg.username} присоединился`, msg);
        // проверка есть ли юзер в комнате
        checkUserBeforeEnterRoom(msg);
        // добавление информации о комнате
        setBet(msg);
        updateOnline(msg);
        if (!timerStarted) {
          startLotoTimer(msg.startedAt, ws, msg.roomId, msg.bet);
          timerStarted = true;
        }
        // updateBank(msg);
        break;
      case "disconnectGame":
        setBet(msg);
        updateOnline(msg);
        // updateBank(msg);
        break;
      case "buyTickets":
        console.log(msg);
        deleteTickets();
        createTickets(msg);
        deleteExitButton();
        // updateBank(msg);
        break;
      case "updateBank":
        console.log(msg);
        updateBank(msg.bank);
        break;
      case "openGame":
        console.log(msg);
        impLotoGame.openGamePage(msg.online, msg.bet, msg.bank);
        let userCards = await impHttp.getTickets();
        userCards = userCards.data;
        impLotoGame.showUserTickets(userCards);
        // updateBank(msg.bank);
        break;
      case "sendNewCask":
        impLotoGame.createCask(msg.cask);

        console.log(msg);
        break;

      case "winGame":
        console.log(msg);
        impLotoGame.checkWin(msg.winners, msg.bank, ws);
        break;

      case "leftSome":
        console.log(msg);

        switch (msg.type) {
          case "left1":
            handleLeftSome(msg, "left1");
            break;
          case "left2":
            handleLeftSome(msg, "left2");
            break;
          case "left3":
            handleLeftSome(msg, "left3");
            break;
        }

        break;
    }
  };

  ws.onclose = (event) => {
    const newWs = connectWebsocketFunctions();
    impNav.redirectToMainPage(newWs);
  };

  return ws;
};

const connectWebsocket = () => {
  const socket = new WebSocket(`ws://localhost:5001/game`);
  return socket;
};

export async function openLotoRoom(ws, roomId) {
  let timerStarted = false;

  roomId = Number(roomId);
  // проверка началась ли игра
  let isGameStarted = await impHttp.isGameStarted(roomId);
  if (isGameStarted.data == true) {
    impPopup.open("подождите пока игра закончится!", 400);
    return;
  }

  // const room = document.querySelector(`.loto-room-${roomId}`);
  // room.innerHTML = `<div class="loader"></div>`;
  // подключение к сокету комнаты

  // const ws = connectWebsocket();

  let bet = 0;
  switch (roomId) {
    case 1:
      bet = 20;
      break;
    case 2:
      bet = 100;
      break;
    case 3:
      bet = 300;
      break;
  }

  ws.send(
    JSON.stringify({
      roomId,
      bet: bet,
      username: window.username,
      userId: window.userId,
      method: "connectGame",
    })
  );

  // open page
  let body = document.querySelector("main");
  body.innerHTML = `<div class="loto-room-page">
    <div class="loto-room-content">
      <div class="loto-room-page__timer">00:00</div>
      <div class="loto-room-page__exit">Выйти</div>
      <div class="loto-room__gameinfo loto-gameinfo">
        <p class="loto-gameinfo__bet">Ставка: <span>0р</span></p>
        <p class="loto-gameinfo__online">Онлайн: <span>0</span></p>
        <p class="loto-gameinfo__bank">Банк: <span>0р</span></p>
      </div>
      <div class="loto-room__main loto-gamemain"></div>
      <div class="loto-room__controlls loto-gamecontrolls">
        <div class="loto-gamecontrolls__buy">Купить билеты</div>
        <div class="loto-gamecontrolls__counter">
          <div class="loto-gamecontrolls__counter__minus">-</div>
          <div class="loto-gamecontrolls__counter__value">0</div>
          <div class="loto-gamecontrolls__counter__plus">+</div>
        </div>
      </div>
    </div>
  </div>`;

  let ticketData = impLotoGame.generateLotoCard();

  let cells = ticketData.newCard;
  let ticketId = ticketData.id;
  createTicket(cells, ticketId);
  counterTickets();
  buyTickets(ws, roomId, bet);

  // выход из комнаты и отключение от вебсокета комнаты
  let exitButton = document.querySelector(".loto-room-page__exit");
  exitButton.addEventListener("click", async function () {
    ws.close(
      1000,
      JSON.stringify({
        roomId,
        bet: bet,
        userId: window.userId,
        username: window.username,
        method: "disconnectGame",
      })
    );
    clearInterval(lotoTimer);

    for (let interval of intervals) {
      clearInterval(interval);
    }

    console.log("close");
  });
}

const handleLeftSome = (msg, leftSome) => {
  switch (leftSome) {
    case "left1":
      const block = document.querySelector(".left1 span");
      block.innerHTML = msg.left1;
      break;
    case "left2":
      const block2 = document.querySelector(".left2 span");
      block2.innerHTML = msg.left2;
      break;
    case "left3":
      const block3 = document.querySelector(".left3 span");
      block3.innerHTML = msg.left3;
      break;
  }
};

async function startLotoTimer(strtedAt, ws, roomId, bet) {
  let lobbyPage = document.querySelector(".loto-room-page");
  if (lobbyPage) {
    let timerBlock = document.querySelector(".loto-room-page__timer");
    const startedAt = new Date(strtedAt).getTime();
    // const targetTime = startedAt + 5 * 60 * 1000; // 5 minutes in milliseconds
    const targetTime = startedAt + 10 * 1000; // 5 minutes in milliseconds

    lotoTimer = setInterval(async () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        countCards(ws, roomId, bet);
        clearInterval(lotoTimer);

        // console.log("timer finished");
        if (timerBlock) {
          // добавить окно (игра начинается)
          timerBlock.innerHTML = "00:00";
        }
        return;
        // checkLotoQueue(eventSource, roomData, roomId);
      } else {
        const minutes = Math.floor(distance / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Add leading zeros for formatting
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        if (timerBlock) {
          timerBlock.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
        }
      }
    }, 500);
  }
}

function updateAllRoomsOnline(onlineArr) {
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 3; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomOnline = lotoRoom.querySelector(".game__room-online");
      if (lotoRoomOnline) {
        lotoRoomOnline.innerHTML = onlineArr[`room${roomId}`];
      }
    }
  }
}

function updateAllRoomsBet(betArr) {
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 3; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomBet = lotoRoom.querySelector(".game__room-bank-sum");
      if (lotoRoomBet) {
        lotoRoomBet.innerHTML = betArr[`room${roomId}`];
      }
    }
  }
}

function countCards(ws, roomId, bet) {
  let lobbyPage = document.querySelector(".loto-room-page");
  if (lobbyPage) {
    let userCards = document.querySelectorAll(".bought-ticket");
    console.log(userCards);
    if (userCards.length == 0) {
      ws.close(
        1000,
        JSON.stringify({
          roomId,
          bet: bet,
          userId: window.userId,
          username: window.username,
          method: "disconnectGame",
        })
      );

      impPopup.open("Вы не купили билеты для игры!", 400);
    }
  }
}

function checkUserBeforeEnterRoom(msg) {
  let userCounter = 0;
  msg.users.forEach((user) => {
    if (user == window.username) {
      userCounter++;
    }
  });

  if (userCounter > 1) {
    alert("you are already in the room");
  }
}

async function buyTickets(ws, roomId, bet) {
  let buyButton = document.querySelector(".loto-gamecontrolls__buy");
  buyButton.addEventListener("click", async function () {
    let ticketsBody = document.querySelector(".loto-gamemain");
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let ticketsArray = [];
    tickets.forEach((ticket) => {
      if (!ticket.classList.contains("bought-ticket")) {
        let ticketCells = ticket.querySelectorAll(".ticket-cell");
        let ticketId = ticket.getAttribute("id");
        let ticketInfo = {};
        let ticketCellsArray = [];
        ticketCells.forEach((cell) => {
          let number = cell.innerHTML;
          ticketCellsArray.push(number);
        });
        ticketInfo.ticketCells = ticketCellsArray;
        ticketInfo.ticketId = ticketId;
        ticketsArray.push(ticketInfo);
      }
    });

    // надо сделать проверку на баланс пользователя а потом уже отправлять билет в базу !!!!

    let msg = {
      bet,
      roomId,
      tickets: ticketsArray,
      user: window.username,
      userId: window.userId,
      method: "buyTickets",
    };

    ws.send(JSON.stringify(msg));
  });
}

async function createTicket(cells, ticketId) {
  let ticketsBody = document.querySelector(".loto-gamemain");
  if (ticketsBody) {
    let ticket = document.createElement("ul");
    ticket.classList.add("loto-gamemain__ticket");
    ticket.setAttribute("id", ticketId);
    cells.forEach((cell) => {
      let ticketCell = document.createElement("li");
      ticketCell.classList.add("ticket-cell");
      ticketCell.innerHTML = cell;
      ticket.appendChild(ticketCell);
    });
    ticketsBody.appendChild(ticket);
  }
}

function startMenuTimerLobby(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 3; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomTimer = lotoRoom.querySelector(".game__until-start-timer");

      if (timers[`room${roomId}`] == null) {
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
        }
      } else {
        let countDownDate = new Date(timers[`room${roomId}`]).getTime() + 10000;
        let timer = setInterval(function () {
          let now = new Date().getTime();
          let distance = countDownDate - now;
          if (distance < 0) {
            clearInterval(activeTimers[roomId - 1]);
            lotoRoomTimer.innerHTML = "00:00";
          } else {
            const minutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros for formatting
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            if (lotoRoomTimer) {
              lotoRoomTimer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
            }
          }
        }, 500);
        activeTimers.push(timer);
      }
    }
  }
}

function startMenuTimerGame(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 3; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomTimer = lotoRoom.querySelector(".game__until-finish-timer");

      if (timers[`room${roomId}`] == null) {
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
        }
      } else {
        let countDownDate = new Date(timers[`room${roomId}`]).getTime();
        let timer = setInterval(function () {
          let now = new Date().getTime();
          let distance = countDownDate - now;
          if (distance < 0) {
            // clearInterval(activeFinishTimers[roomId - 1]);
            lotoRoomTimer.innerHTML = "00:00";
          } else {
            const minutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros for formatting
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            if (lotoRoomTimer) {
              lotoRoomTimer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
            }
          }
        }, 500);
        activeFinishTimers.push(timer);
      }
    }
  }
}

async function createTickets(msg) {
  let tickets = msg.tickets;
  tickets.forEach((ticket) => {
    let cells = ticket.ticketCells;
    let id = ticket.ticketId;
    let ticketsBody = document.querySelector(".loto-gamemain");
    if (ticketsBody) {
      let ticket = document.createElement("ul");
      ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
      ticket.setAttribute("id", id);
      cells.forEach((cell) => {
        let ticketCell = document.createElement("li");
        ticketCell.classList.add("ticket-cell");
        ticketCell.innerHTML = cell;
        ticket.appendChild(ticketCell);
      });
      ticketsBody.appendChild(ticket);
    }
  });
}

function deleteTickets() {
  let ticketsBody = document.querySelector(".loto-gamemain");
  let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");

  tickets.forEach((ticket) => {
    if (!ticket.classList.contains("bought-ticket")) {
      ticket.remove();
    }
  });
}

function deleteTicket() {
  let ticketsBody = document.querySelector(".loto-gamemain");
  let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
  let ticket = tickets[tickets.length - 1];
  if (ticket) {
    if (!ticket.classList.contains("bought-ticket")) {
      ticket.remove();
      return true;
    }
  }
  return false;
}

function setBet(data) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoBet = lotoGameInfo.querySelector(".loto-gameinfo__bet");
    lotoBet.querySelector("span").innerHTML = `${data.bet}p`;
  }
}

function updateOnline(data) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoOnline = lotoGameInfo.querySelector(".loto-gameinfo__online");
    lotoOnline.querySelector("span").innerHTML = `${data.online}`;
  }
}

function updateBank(data) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoBank = lotoGameInfo.querySelector(".loto-gameinfo__bank");
    lotoBank.querySelector("span").innerHTML = `${data}p`;
  }
}

function deleteExitButton() {
  let lotoExitButton = document.querySelector(".loto-room-page__exit");
  if (lotoExitButton) {
    lotoExitButton.remove();
  }
}

function counterTickets() {
  let counter = document.querySelector(".loto-gamecontrolls__counter");
  if (counter) {
    let counterValue = counter.querySelector(
      ".loto-gamecontrolls__counter__value"
    );
    let counterMinus = counter.querySelector(
      ".loto-gamecontrolls__counter__minus"
    );
    let counterPlus = counter.querySelector(
      ".loto-gamecontrolls__counter__plus"
    );

    counterValue.innerHTML = 1;

    counterMinus.addEventListener("click", function () {
      if (counterValue.innerHTML > 1) {
        let isDeleted = deleteTicket();
        if (isDeleted == true) {
          counterValue.innerHTML = +counterValue.innerHTML - 1;
        } else counterValue.innerHTML = +counterValue.innerHTML;
      }
    });

    counterPlus.addEventListener("click", function () {
      if (counterValue.innerHTML < 6) {
        counterValue.innerHTML = +counterValue.innerHTML + 1;
        let ticketData = impLotoGame.generateLotoCard();
        let cells = ticketData.newCard;
        let ticketId = ticketData.id;
        createTicket(cells, ticketId);
      }
    });
  }
}
