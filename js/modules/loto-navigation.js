import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impNav from "./navigation.js";
import * as impPopup from "./popup.js";
import * as impAudio from "./audio.js";

let lotoTimer;
let intervals = [];
let activeTimers = [];
let activeFinishTimers = [];

export const connectWebsocketFunctions = () => {
  const ws = new WebSocket(`wss://loto-server-new.onrender.com/game`);
  window.ws = ws;
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
    // console.log(msg);
    switch (msg.method) {
      case "connectGeneral":
        break;
      case "getAllInfo":
        updateAllRoomsOnline(msg.rooms);
        updateAllRoomsBet(msg.bank);
        for (let timer of activeTimers) {
          clearInterval(timer);
        }
        startMenuTimerLobby(msg.timers);
        for (let timer of activeFinishTimers) {
          clearInterval(timer);
        }
        startMenuTimerGame(msg.timers);
        break;
      case "allRoomsOnline":
        updateAllRoomsOnline(msg.rooms);
        break;
      case "updateAllRoomsBank":
        updateAllRoomsBet(msg.bank);
        break;
      case "updateAllRoomsJackpot":
        updateAllRoomsJackpot(msg.jackpots);
        break;
      case "allRoomsStartTimers":
        for (let timer of activeTimers) {
          clearInterval(timer);
        }
        startMenuTimerLobby(msg.timers);

        break;
      case "allRoomsFinishTimers":
        for (let timer of activeFinishTimers) {
          clearInterval(timer);
        }
        startMenuTimerGame(msg.timers);

        break;
      case "updateBalance":
        impNav.updateBalance(msg.balance);
        break;
      case "connectGame":
        // проверка есть ли юзер в комнате
        checkUserBeforeEnterRoom(msg);
        // добавление информации о комнате
        setBet(msg);
        updateOnline(msg.online);
        if (msg.startedAt != null) {
          if (!timerStarted) {
            startLotoTimer(msg.startedAt);
            timerStarted = true;
          }
        }

        let { data: userTickets } = await impHttp.getTickets();
        const userTickesInRoom = userTickets.filter(
          (ticket) => ticket.gameLevel == msg.roomId
        );

        if (msg.userId == window.userId && !userTickesInRoom.length) {
          // создаём билет если только зашел в комнату
          let ticketData = impLotoGame.generateLotoCard();
          let cells = ticketData.newCard;
          let ticketId = ticketData.id;
          createTicket(cells, ticketId);
        }

        // impLotoGame.showUserTickets(userTickets.data, msg.roomId);

        // updateBank(msg);
        break;
      case "disconnectGame":
        setBet(msg);
        updateOnline(msg.online);
        // updateBank(msg);
        break;
      case "buyTickets":
        if (msg.isBought == false) {
          impPopup.open("Недостаточно средств!", 400);
          return;
        }
        deleteTickets();
        createTickets(msg);
        deleteExitButton();
        // updateBank(msg);
        break;

      case "didntBoughtTickets":
        let bet = 0;
        switch (msg.roomId) {
          case 1:
            bet = 0.2;
            break;
          case 2:
            bet = 0.5;
            break;
          case 3:
            bet = 1;
            break;
          case 4:
            bet = 5;
            break;
          case 5:
            bet = 10;
            break;
        }
        // countCards(ws, msg.roomId, bet);
        ws.close(
          1000,
          JSON.stringify({
            roomId: msg.roomId,
            bet: bet,
            userId: window.userId,
            username: window.username,
            method: "disconnectGame",
          })
        );
        impPopup.open("Вы не купили билеты для игры!", 400);
        break;
      case "updateRoomTimer":
        if (msg.startedAt != null) {
          if (!timerStarted) {
            startLotoTimer(msg.startedAt);
            timerStarted = true;
          }
        }
        break;

      case "updateBank":
        updateBank(msg.bank);
        break;
      case "updateJackpot":
        updateJackpot(msg.jackpot);
        break;
      case "updateAllRoomsPrevBank":
        updatePrevBanks(msg.prevBank);
        break;
      case "updateOnline":
        updateOnline(msg.online);
        break;
      case "openGame":
        location.hash = `#loto-game-${msg.roomId}?bet=${msg.bet}&bank=${msg.bank}&jackpot=${msg.jackpot}&online=${msg.online}`;
        // updateBank(msg.bank);
        break;
      case "sendNewCask":
        impLotoGame.createCask(ws, msg.cask, msg.caskNumber, msg.pastCasks);
        break;

      case "jackpotWon":
        impLotoGame.showJackpotWon(msg.winner, msg.sum);
        break;

      case "winGame":
        impLotoGame.checkWin(
          msg.winners,
          msg.bank,
          msg.winnersAmount,
          ws,
          msg.isJackpotWon
        );
        break;

      case "leftSome":
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

  ws.onclose = () => {
    const newWs = connectWebsocketFunctions();
    window.ws = newWs;
    location.hash = "";
    impNav.pageNavigation(newWs);
  };

  return ws;
};

function setLoader(roomId) {
  const room = document.querySelector(`.loto-room-${roomId}`);
  if (!room.classList.contains("game-started")) {
    const loader = document.createElement("div");
    loader.classList.add("room-loader");
    room.appendChild(loader);
  }
}

export async function openLotoRoom(ws, roomId) {
  const room = document.querySelector(`.loto-room-${roomId}`);
  const loader = room.querySelector(".room-loader");

  roomId = Number(roomId);
  if (!loader) {
    setLoader(roomId);
  }

  // проверка началась ли игра
  let isGameStarted = await impHttp.isGameStarted(roomId);

  if (isGameStarted.data == true) {
    let isPlayerInRoom = await impHttp.isPlayerInRoom(roomId);
    if (isPlayerInRoom.data == true) {
      const bet = impLotoGame.getBetByRoomId(roomId);
      location.hash = `#loto-game-${roomId}`;
      impAudio.playLoading();
    } else {
      location.hash = "";
      impPopup.open("подождите пока игра закончится!", 400);
    }
  } else {
    location.hash = `#loto-room-${roomId}`;
    impAudio.playLoading();

    // ws.send(
    //   JSON.stringify({
    //     roomId,
    //     bet: bet,
    //     username: window.username,
    //     userId: window.userId,
    //     method: "connectGame",
    //   })
    // );
  }
}

const handleLeftSome = (msg, leftSome) => {
  const sidebar = document.querySelector(".information-sidebar");
  let block1, block2, block3;

  block3 = document.querySelector(".left3 span");
  switch (leftSome) {
    case "left1":
      if (msg.left1 > 0) {
        block1 = document.querySelector(".left1");
        block2 = document.querySelector(".left2");
        block3 = document.querySelector(".left3");
        if (block2) {
          block2.remove();
        }
        if (block3) {
          block3.remove();
        }

        if (!block1) {
          let block = document.createElement("div");
          block.classList.add("information-sidebar__item", "left1");
          block.innerHTML = `У <span>0</span> карточек осталось 1 номер`;
          sidebar.appendChild(block);
        }
        block1 = document.querySelector(".left1 span");
        block1.innerHTML = msg.left1;
      }

      break;
    case "left2":
      block2 = document.querySelector(".left2");
      if (msg.left2 > 0) {
        block3 = document.querySelector(".left3");
        if (block3) {
          block3.remove();
        }

        if (!block2) {
          let block = document.createElement("div");
          block.classList.add("information-sidebar__item", "left2");
          block.innerHTML = `У <span>0</span> карточек осталось 2 номерa`;
          sidebar.appendChild(block);
        }
        block2 = document.querySelector(".left2 span");
        block2.innerHTML = msg.left2;
      }

      break;
    case "left3":
      block3 = document.querySelector(".left3 span");
      if (block3) {
        block3.innerHTML = msg.left3;
      }
      break;
  }
};

async function startLotoTimer(strtedAt) {
  let lobbyPage = document.querySelector(".loto-room-page");
  if (lobbyPage) {
    let timerBlock = document.querySelector(".loto-room-page__timer");
    const startedAt = new Date(strtedAt).getTime();
    // const targetTime = startedAt + 5 * 60 * 1000; // 5 minutes in milliseconds
    const targetTime = startedAt + 30 * 1000; // 5 minutes in milliseconds

    lotoTimer = setInterval(async () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
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
    for (let roomId = 1; roomId <= 5; roomId++) {
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
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomBet = lotoRoom.querySelector(".game__room-bank-sum");
      if (lotoRoomBet) {
        const targetBet = betArr[`room${roomId}`];
        const currentBet = parseFloat(lotoRoomBet.innerHTML);

        if (targetBet !== currentBet) {
          animateNumberChange(lotoRoomBet, currentBet, targetBet);
        }
      }
    }
  }
}

function updateAllRoomsJackpot(jackpots) {
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomJackpot = lotoRoom.querySelector(".game__room-jackpot-sum");
      if (lotoRoomJackpot) {
        const targetJackpot = jackpots[`room${roomId}`];
        const currentJackpot = parseFloat(lotoRoomJackpot.innerHTML);

        if (targetJackpot !== currentJackpot) {
          animateNumberChange(lotoRoomJackpot, currentJackpot, targetJackpot);
        }
      }
    }
  }
}

export function animateNumberChange(element, startValue, endValue) {
  const duration = 2000;
  const framesPerSecond = 60;
  const frameDuration = Math.floor(1000 / framesPerSecond);
  const frames = Math.ceil(duration / frameDuration);
  const increment = (endValue - startValue) / frames;

  let currentFrame = 0;
  let currentValue = startValue;

  function updateValue() {
    currentFrame++;
    currentValue += increment;
    element.innerHTML = currentValue.toFixed(2);

    if (currentFrame < frames) {
      requestAnimationFrame(updateValue);
    } else {
      element.innerHTML = Number(endValue).toFixed(2);
    }
  }

  updateValue();
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

export function buyTickets(ws, roomId, bet) {
  let buyButton = document.querySelector(".loto-gamecontrolls__buy");
  buyButton.addEventListener("click", async function () {
    let ticketsCount = document.querySelector(
      ".loto-gamecontrolls__counter__value"
    );

    if (ticketsCount && ticketsCount.innerHTML == 0) {
      return;
    }

    let ticketsBody = document.querySelector(".loto-gamemain");
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let ticketsArray = [];

    const balance = +document.querySelector(".header__balance").innerHTML;
    const ticketsPrice = +ticketsCount.innerHTML * bet;
    if (balance < ticketsPrice) {
      impPopup.open("Недостаточно средств!", 400);
      return;
    }

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

export function createTicket(cells, ticketId) {
  let ticketsBody = document.querySelector(".loto-gamemain");
  if (ticketsBody) {
    let ticketContainer = document.createElement("div");
    let buttons = document.createElement("div");
    buttons.classList.add("ticket-buttons");
    ticketContainer.classList.add("ticket-container");
    let ticket = document.createElement("ul");
    ticket.classList.add("loto-gamemain__ticket");
    ticket.setAttribute("id", ticketId);
    cells.forEach((cell) => {
      let ticketCell = document.createElement("li");
      ticketCell.classList.add("ticket-cell");
      ticketCell.innerHTML = cell;
      ticket.appendChild(ticketCell);
    });
    let refreshButton = document.createElement("button");
    refreshButton.classList.add("loto-gamemain__ticket__refresh");
    refreshButton.innerHTML = "Обновить";
    refreshButton.addEventListener("click", async function () {
      let ticketData = impLotoGame.generateLotoCard();
      let cells = ticketData.newCard;
      let ticketId = ticketData.id;
      ticket.innerHTML = "";
      cells.forEach((cell) => {
        let ticketCell = document.createElement("li");
        ticketCell.classList.add("ticket-cell");
        ticketCell.innerHTML = cell;
        ticket.appendChild(ticketCell);
      });
      ticket.setAttribute("id", ticketId);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("loto-gamemain__ticket__delete");
    deleteButton.innerHTML = "Удалить";
    deleteButton.addEventListener("click", async function () {
      if (!ticket.classList.contains("bought-ticket")) {
        // check if tickets > 1, then delete
        const tickets = document.querySelectorAll(".loto-gamemain__ticket");
        if (tickets.length > 1) {
          ticketContainer.remove();
          const counter = document.querySelector(
            ".loto-gamecontrolls__counter__value"
          );
          const counterValue = +counter.innerHTML;
          counter.innerHTML = counterValue - 1;
        }
      }
    });

    buttons.appendChild(refreshButton);
    buttons.appendChild(deleteButton);
    ticketContainer.appendChild(buttons);
    ticketContainer.appendChild(ticket);
    ticketsBody.appendChild(ticketContainer);
  }

  // let tickets = msg.tickets;
  // tickets.forEach((ticket) => {
  //   let cells = ticket.ticketCells;
  //   let id = ticket.ticketId;
  //   let ticketsBody = document.querySelector(".loto-gamemain");
  //   if (ticketsBody) {
  //     let ticketContainer = document.createElement("div");
  //     let ticket = document.createElement("ul");
  //     ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
  //     ticket.setAttribute("id", id);
  //     cells.forEach((cell) => {
  //       let ticketCell = document.createElement("li");
  //       ticketCell.classList.add("ticket-cell");
  //       ticketCell.innerHTML = cell;
  //       ticket.appendChild(ticketCell);
  //     });
  //     let refreshButton = document.createElement("button");
  //     refreshButton.classList.add("loto-gamemain__ticket__refresh");
  //     refreshButton.innerHTML = "Сменить билет";
  //     refreshButton.addEventListener("click", async function () {
  //       let ticketData = impLotoGame.generateLotoCard();
  //       let cells = ticketData.newCard;
  //       let ticketId = ticketData.id;
  //       ticket.innerHTML = "";
  //       cells.forEach((cell) => {
  //         let ticketCell = document.createElement("li");
  //         ticketCell.classList.add("ticket-cell");
  //         ticketCell.innerHTML = cell;
  //         ticket.appendChild(ticketCell);
  //       });
  //       ticket.setAttribute("id", ticketId);
  //     });
  //     ticketContainer.appendChild(ticket);
  //     ticketContainer.appendChild(refreshButton);
  //     ticketsBody.appendChild(ticketContainer);
  //   }
  // });
}

function startMenuTimerLobby(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomTimer = lotoRoom.querySelector(".game__until-start-timer");

      if (timers[`room${roomId}`] == null) {
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
        }
      } else {
        let countDownDate = new Date(timers[`room${roomId}`]).getTime() + 30000;
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
        }, 50);
        activeTimers.push(timer);
      }
    }
  }
}

function startMenuTimerGame(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomTimer = lotoRoom.querySelector(".game__until-finish-timer");

      if (timers[`room${roomId}`] == null) {
        if (lotoRoom.classList.contains("game-started")) {
          lotoRoom.classList.remove("game-started");
        }
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
        }
      } else {
        //добавляем клас на комнату
        lotoRoom.classList.add("game-started");

        let countDownDate = new Date(timers[`room${roomId}`]).getTime();
        let timer = setInterval(function () {
          let now = new Date().getTime();
          let distance = countDownDate - now;
          if (distance < 0) {
            if (lotoRoom.classList.contains("game-started")) {
              lotoRoom.classList.remove("game-started");
            }
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
        }, 50);
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

  // let tickets = msg.tickets;
  // tickets.forEach((ticket) => {
  //   let cells = ticket.ticketCells;
  //   let id = ticket.ticketId;
  //   let ticketsBody = document.querySelector(".loto-gamemain");
  //   if (ticketsBody) {
  //     let ticketContainer = document.createElement("div");
  //     let ticket = document.createElement("ul");
  //     ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
  //     ticket.setAttribute("id", id);
  //     cells.forEach((cell) => {
  //       let ticketCell = document.createElement("li");
  //       ticketCell.classList.add("ticket-cell");
  //       ticketCell.innerHTML = cell;
  //       ticket.appendChild(ticketCell);
  //     });
  //     let refreshButton = document.createElement("button");
  //     refreshButton.classList.add("loto-gamemain__ticket__refresh");
  //     refreshButton.innerHTML = "Сменить билет";
  //     refreshButton.addEventListener("click", async function () {
  //       let ticketData = impLotoGame.generateLotoCard();
  //       let cells = ticketData.newCard;
  //       let ticketId = ticketData.id;
  //       ticket.innerHTML = "";
  //       cells.forEach((cell) => {
  //         let ticketCell = document.createElement("li");
  //         ticketCell.classList.add("ticket-cell");
  //         ticketCell.innerHTML = cell;
  //         ticket.appendChild(ticketCell);
  //       });
  //       ticket.setAttribute("id", ticketId);
  //     });
  //     ticketContainer.appendChild(ticket);
  //     ticketContainer.appendChild(refreshButton);
  //     ticketsBody.appendChild(ticketContainer);
  //   }
  // });
}

function deleteTickets() {
  let ticketsBody = document.querySelector(".loto-gamemain");
  let ticketContainers = ticketsBody.querySelectorAll(".ticket-container");
  // let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");

  ticketContainers.forEach((container) => {
    let ticket = container.querySelector(".loto-gamemain__ticket");
    if (!ticket.classList.contains("bought-ticket")) {
      container.remove();
    }
  });
}

function deleteTicket() {
  let ticketsBody = document.querySelector(".loto-gamemain");
  let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
  let ticket = tickets[tickets.length - 1];
  const ticketContainer = ticket.parentElement;
  if (ticket) {
    if (!ticket.classList.contains("bought-ticket")) {
      ticketContainer.remove();
      return true;
    }
  }
  return false;
}

function setBet(data) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoBet = lotoGameInfo.querySelector(".loto-gameinfo__bet");
    lotoBet.querySelector("span").innerHTML = `${data.bet}`;
  }
}

function updateOnline(online) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoOnline = lotoGameInfo.querySelector(".loto-gameinfo__online");
    lotoOnline.querySelector("span").innerHTML = `${online}`;
  }
}
function updateBank(bank) {
  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoBank = lotoGameInfo.querySelector(".loto-gameinfo__bank");
    const targetBank = bank;
    const currentBank = parseFloat(lotoBank.querySelector("span").innerHTML);

    if (targetBank !== currentBank) {
      animateNumberChange(
        lotoBank.querySelector("span"),
        currentBank,
        targetBank
      );
    }
  }
}

function updateJackpot(jackpot) {
  let lotoJackpot = document.querySelector(".room-jackpot-sum");
  if (lotoJackpot) {
    const targetJackpot = jackpot;
    const currentJackpot = parseFloat(lotoJackpot.innerHTML);

    if (targetJackpot !== currentJackpot) {
      animateNumberChange(lotoJackpot, currentJackpot, targetJackpot);
    }
  }
}

function updatePrevBanks(banks) {
  const games = document.querySelector(".games");
  if (games) {
    const prevBanks = games.querySelectorAll(".game__room-prevbank-sum");
    prevBanks.forEach((prevBank, index) => {
      prevBank.innerHTML = banks[`room${index + 1}`].toFixed(2);
    });
  }
}

function deleteExitButton() {
  let lotoExitButton = document.querySelector(".loto-room-page__exit");
  if (lotoExitButton) {
    lotoExitButton.remove();
  }
}

export function counterTickets() {
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
    counterMinus.removeEventListener("click", addTickets);
    counterPlus.removeEventListener("click", deleteTickets);

    // if (boughtTicketsCounter < 6) {
    //   let ticketData = impLotoGame.generateLotoCard();
    //   let cells = ticketData.newCard;
    //   let ticketId = ticketData.id;
    //   createTicket(cells, ticketId);
    //   counterValue.innerHTML = boughtTicketsCounter + 1;
    // }

    counterMinus.addEventListener("click", deleteTickets);
    counterPlus.addEventListener("click", addTickets);

    function addTickets() {
      if (counterValue.innerHTML < 6) {
        counterValue.innerHTML = +counterValue.innerHTML + 1;
        let ticketData = impLotoGame.generateLotoCard();
        let cells = ticketData.newCard;
        let ticketId = ticketData.id;
        createTicket(cells, ticketId);
        impAudio.playTicket();
      }
    }
    function deleteTickets() {
      if (counterValue.innerHTML > 1) {
        let isDeleted = deleteTicket();
        if (isDeleted == true) {
          counterValue.innerHTML = +counterValue.innerHTML - 1;
          impAudio.playTicket();
        } else counterValue.innerHTML = +counterValue.innerHTML;
      }
    }
  }
}
