import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";
import * as impNav from "./navigation.js";
import * as impPopup from "./popup.js";
import * as impAudio from "./audio.js";

let preloader = document.querySelector(".page-preloader");

let lotoTimer = null;
let timerStarted = false;

let intervals = [];
let activeTimers = {
  room1: null,
  room2: null,
  room3: null,
  room4: null,
  room5: null,
};
let activeFinishTimers = {
  room1: null,
  room2: null,
  room3: null,
  room4: null,
  room5: null,
};

export const connectWebsocketFunctions = () => {
  // const ws = new WebSocket(`ws://localhost:5001/game`);
  const ws = new WebSocket(`wss://loto-server-new.onrender.com/game`);
  window.ws = ws;
  let clientId = createClientId();

  ws.onopen = () => {
    console.log("Подключение установлено");
    ws.send(
      JSON.stringify({
        clientId: clientId,
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
      case "logoutUser":
        console.log(msg);
        localStorage.removeItem("token");
        location.username = null;
        let disconnectMsg = {
          reason: "anotherConnection",
        };
        ws.close(1000, JSON.stringify(disconnectMsg));
        impPopup.openAnotherAccountEnterPopup(ws);
        // impPopup.open("На ваш акккаунт вошли с другого места!", 100, false);
        // location.reload();
        break;
      case "getAllInfo":
        updateAllRoomsOnline(msg.rooms);
        updateAllRoomsBet(msg.bank);

        for (let room = 1; room <= 5; room++) {
          let roomTimer = activeTimers[`room${room}`];
          if (roomTimer != null) {
            roomTimer = null;
            clearInterval(roomTimer);
          }
        }
        // for (let timer of activeTimers) {
        //   clearInterval(timer);
        // }
        await startMenuTimerLobby(msg.timers);

        for (let room = 1; room <= 5; room++) {
          let roomTimer = activeFinishTimers[`room${room}`];
          if (roomTimer != null) {
            roomTimer = null;
            clearInterval(roomTimer);
          }
        }

        // for (let timer of activeFinishTimers) {
        //   clearInterval(timer);
        // }
        await startMenuTimerGame(msg.timers);
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
        for (let room = 1; room <= 5; room++) {
          let roomTimer = activeTimers[`room${room}`];
          if (roomTimer != null) {
            roomTimer = null;
            clearInterval(roomTimer);
          }
        }
        // for (let timer of activeTimers) {
        //   clearInterval(timer);
        // }
        await startMenuTimerLobby(msg.timers);

        break;
      case "allRoomsFinishTimers":
        // console.log(msg);
        for (let room = 1; room <= 5; room++) {
          let roomTimer = activeFinishTimers[`room${room}`];
          if (roomTimer != null) {
            roomTimer = null;
            clearInterval(roomTimer);
          }
        }
        // for (let timer of activeFinishTimers) {
        //   clearInterval(timer);
        // }
        await startMenuTimerGame(msg.timers);

        break;
      case "updateBalance":
        impNav.updateBalance(msg.balance);
        break;
      case "connectGame":
        console.log(msg);
        // проверка есть ли юзер в комнате
        checkUserBeforeEnterRoom(msg);
        // добавление информации о комнате
        setBet(msg);
        updateOnline(msg.online);
        if (msg.startedAt != null) {
          console.log(msg.startedAt);
          deleteExitButton();
          if (lotoTimer == null) {
            startLotoTimer(msg.startedAt);
          }
        }

        updatIngameBank(msg.bank);

        if (msg.isJackpotPlaying == true) {
          animateJackpot();
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
          impPopup.openErorPopup("Произошла ошибка при покупке билета!");
          return;
        }
        deleteTickets();
        createTickets(msg);
        // update counter
        const counter = document.querySelector(
          ".loto-gamecontrolls__counter__value"
        );
        counter.innerHTML = document.querySelectorAll(
          ".loto-gamemain__ticket"
        ).length;
        // deleteExitButton();
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
        impPopup.openErorPopup("Вы не купили билеты для игры!");
        break;
      case "updateRoomTimer":
        console.log(msg);
        if (msg.startedAt != null) {
          console.log(msg.startedAt);
          if (lotoTimer == null) {
            deleteExitButton();
            startLotoTimer(msg.startedAt);
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
        console.log(msg);
        location.hash = `#loto-game-${msg.roomId}?bet=${msg.bet}&bank=${msg.bank}&jackpot=${msg.jackpot}&online=${msg.online}&isJackpotPlaying=${msg.isJackpotPlaying}`;
        break;
      case "sendNewCask":
        impLotoGame.createCask(ws, msg.cask, msg.caskNumber, msg.pastCasks);
        await impLotoGame.colorDropedCasks(msg.pastCasks);
        break;

      case "jackpotWon":
        impLotoGame.showJackpotWon(msg.winner, msg.sum);
        break;

      case "winGame":
        console.log(msg);
        impLotoGame.checkWin(
          msg.winners,
          msg.bank,
          msg.winnersAmount,
          msg.isJackpotWon,
          msg.jackpotData,
          msg.winnersData
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

  ws.onclose = (info) => {
    console.log(info);
    if (info.reason != "" && info.reason != " ") {
      let infoReason = JSON.parse(info.reason);
      if (infoReason != "" && infoReason.reason == "anotherConnection") {
        return;
      } else {
        const newWs = connectWebsocketFunctions();
        window.ws = newWs;
        location.hash = "";
        impNav.pageNavigation(newWs);
        return;
      }
    } else {
      const newWs = connectWebsocketFunctions();
      window.ws = newWs;
      location.hash = "";
      impNav.pageNavigation(newWs);
    }
  };

  return ws;
};

function setLoader(roomId) {
  const room = document.querySelector(`.loto-room-${roomId}`);
  if (!room.classList.contains("finishing")) {
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
      impPopup.openErorPopup(
        "Игра уже началась. Если вы хотите принять участие в игре, подождите ее окончания!"
      );
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
  let block1, block2, block3;

  const gameContent = document.querySelector(".loto-game-room-page-content");
  const gameProcess = document.querySelector(".loto-game-room__gameprocess");
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
        const initialBlock = document.querySelector(
          ".loto-gameinfo__information-left.initial"
        );
        if (initialBlock) {
          initialBlock.remove();
        }

        if (!block1) {
          let block = document.createElement("div");
          block.classList.add("loto-gameinfo__information-left", "left1");
          block.innerHTML = `У <span>0</span> карточек осталось 1 номер`;
          gameContent.insertBefore(block, gameProcess);
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
        const initialBlock = document.querySelector(
          ".loto-gameinfo__information-left.initial"
        );
        if (initialBlock) {
          initialBlock.remove();
        }

        if (!block2) {
          let block = document.createElement("div");
          block.classList.add("loto-gameinfo__information-left", "left2");
          block.innerHTML = `У <span>0</span> карточек осталось 2 номерa`;
          gameContent.insertBefore(block, gameProcess);
        }
        block2 = document.querySelector(".left2 span");
        block2.innerHTML = msg.left2;
      }

      break;
    case "left3":
      if (msg.left3 > 0) {
        const initialBlock = document.querySelector(
          ".loto-gameinfo__information-left.initial"
        );
        if (initialBlock) {
          initialBlock.remove();
          let block = document.createElement("div");
          block.classList.add("loto-gameinfo__information-left", "left3");
          block.innerHTML = `У <span>0</span> карточек осталось 3 номерa`;
          gameContent.insertBefore(block, gameProcess);
        }
        block3 = document.querySelector(".left3 span");
        block3.innerHTML = msg.left3;
      }

      break;
  }
};

async function startLotoTimer(strtedAt) {
  // стартуем таймер
  let lobbyPage = document.querySelector(".loto-room-page");
  if (lobbyPage) {
    console.log("start loto timer");
    let timerBlock = document.querySelector(".loto-room-page__timer span");
    const startedAt = new Date(strtedAt).getTime();
    // const targetTime = startedAt + 5 * 60 * 1000; // 5 minutes in milliseconds
    const targetTime = startedAt + 30 * 1000; // 5 minutes in milliseconds
    let nowClientTime = await NowClientTime();

    let distance = targetTime - nowClientTime;
    if (lotoTimer != null) {
      clearInterval(lotoTimer);
      lotoTimer = null;
    }
    lotoTimer = setInterval(async () => {
      distance -= 1000;
      console.log(distance);
      if (distance <= 0) {
        clearInterval(lotoTimer);
        lotoTimer = null;
        console.log("finish loto timer");
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
    }, 1000);
  }
}

async function NowClientTime() {
  const date = await axios.get(
    "https://api.api-ninjas.com/v1/worldtime?city=London",
    {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "rpWZR9MlW23ZoAcHMLIWhw==KcixnFSk5PKTcK58",
      },
    }
  );

  const time = new Date(date.data.datetime).getTime();

  // return time + 60 * 60 * 1000;
  return time - 60 * 60 * 1000;
  // return time - 7200000;
  // return time;
}

function updateAllRoomsOnline(onlineArr) {
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomOnline = lotoRoom.querySelector(".lobby-room-online span");
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
      let lotoRoomBet = lotoRoom.querySelector(".lobby-room-bet span");
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
  if (buyButton) {
    buyButton.addEventListener("click", async function () {
      let ticketsCount = document.querySelector(
        ".loto-gamecontrolls__counter__value"
      );

      if (ticketsCount && ticketsCount.innerHTML == 0) {
        return;
      }

      let ticketsBody = document.querySelector(".loto-gamemain");
      let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
      const boughtTickets = ticketsBody.querySelectorAll(".bought-ticket");
      if (boughtTickets.length == tickets.length) {
        return;
      }
      let ticketsArray = [];

      const balance = +document.querySelector(".header__balance").innerHTML;
      const ticketsPrice = +ticketsCount.innerHTML * bet;
      if (balance < ticketsPrice) {
        impPopup.openErorPopup(
          "Вам не хватает баланса. Пожалуйста, увеличьте свой баланс. "
        );
        return;
      }

      tickets.forEach((ticket) => {
        if (!ticket.classList.contains("bought-ticket")) {
          let ticketCells = ticket.querySelectorAll(".ticket-cell");
          let ticketId = ticket.getAttribute("id");
          let ticketInfo = {};
          let ticketCellsArray = [];
          ticketCells.forEach((cell) => {
            let cellNumber = cell.querySelector(".ticket-cell-number");
            let number = cellNumber.innerHTML;
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
      let ticketCellNumber = document.createElement("div");
      ticketCellNumber.classList.add("ticket-cell-number");
      ticketCellNumber.innerHTML = cell;
      ticketCell.appendChild(ticketCellNumber);
      ticket.appendChild(ticketCell);
    });
    let refreshButton = document.createElement("button");
    refreshButton.classList.add("loto-gamemain__ticket__refresh");

    refreshButton.innerHTML = `<img src="img/refresh-ticket.png" alt="" /> Обновить`;
    refreshButton.addEventListener("click", async function () {
      let ticketData = impLotoGame.generateLotoCard();
      let cells = ticketData.newCard;
      let ticketId = ticketData.id;
      ticket.innerHTML = "";
      cells.forEach((cell) => {
        let ticketCell = document.createElement("li");
        ticketCell.classList.add("ticket-cell");
        let ticketCellNumber = document.createElement("div");
        ticketCellNumber.classList.add("ticket-cell-number");
        ticketCellNumber.innerHTML = cell;
        ticketCell.appendChild(ticketCellNumber);
        ticket.appendChild(ticketCell);
      });
      impAudio.playRefreshTicket();
      ticket.setAttribute("id", ticketId);
    });
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("loto-gamemain__ticket__delete");
    deleteButton.innerHTML = `<img src="img/remove-ticket.png" alt="" /> Удалить`;
    deleteButton.addEventListener("click", async function () {
      if (!ticket.classList.contains("bought-ticket")) {
        // check if tickets > 1, then delete
        const tickets = document.querySelectorAll(".loto-gamemain__ticket");
        if (tickets.length > 1) {
          ticketContainer.remove();
          impAudio.playDeleteTicket();
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
}

async function startMenuTimerLobby(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);
      let lotoRoomTimer = lotoRoom.querySelector(
        ".room-left__item-timer-block .timer-block__timer"
      );

      if (timers[`room${roomId}`] == null) {
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
          if (activeTimers[`room${roomId}`] != null) {
            clearInterval(activeTimers[`room${roomId}`]);
            activeTimers[`room${roomId}`] = null;
          }
          // clearInterval(activeTimers[roomId - 1]);
          // return;
        }
      } else {
        let lotoRoomTimerText = lotoRoom.querySelector(
          ".room-left__item-timer-block .timer-block__text"
        );
        lotoRoomTimerText.innerHTML = "Начинается";
        lotoRoom.classList.add("starting");
        let countDownDate = new Date(timers[`room${roomId}`]).getTime() + 30000;

        let nowClientTime = await NowClientTime();

        let distance = countDownDate - nowClientTime;

        if (activeTimers[`room${roomId}`] != null) {
          clearInterval(activeTimers[`room${roomId}`]);
          activeTimers[`room${roomId}`] = null;
        }
        let timer = setInterval(async function () {
          distance -= 1000;
          if (distance <= 0) {
            clearInterval(activeTimers[`room${roomId}`]);
            activeTimers[`room${roomId}`] = null;

            lotoRoomTimer.innerHTML = "00:00";
          } else if (distance > 0) {
            const minutes = Math.floor(distance / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add leading zeros for formatting
            const formattedMinutes = String(minutes).padStart(2, "0");
            const formattedSeconds = String(seconds).padStart(2, "0");
            if (lotoRoomTimer) {
              lotoRoomTimer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
            }
          }
        }, 1000);
        activeTimers[`room${roomId}`] = timer;
      }
    }
  }
}

async function startMenuTimerGame(timers) {
  // get all timers on the page
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    for (let roomId = 1; roomId <= 5; roomId++) {
      let lotoRoom = mainPage.querySelector(`.loto-room-${roomId}`);

      let lotoRoomTimer = lotoRoom.querySelector(
        ".room-left__item-timer-block .timer-block__timer"
      );

      if (timers[`room${roomId}`] == null) {
        if (lotoRoom.classList.contains("finishing")) {
          if (activeFinishTimers[`room${roomId}`] != null) {
            clearInterval(activeFinishTimers[`room${roomId}`]);
            activeFinishTimers[`room${roomId}`] = null;
          }
          lotoRoom.classList.remove("finishing", "starting");
          let lotoRoomTimerText = lotoRoom.querySelector(
            ".room-left__item-timer-block .timer-block__text"
          );
          lotoRoomTimerText.innerHTML = "Ожидание";
        }
        if (lotoRoomTimer) {
          lotoRoomTimer.innerHTML = "00:00";
        }
      } else {
        // очищаем интервал если он был

        if (activeFinishTimers[`room${roomId}`] != null) {
          clearInterval(activeFinishTimers[`room${roomId}`]);
          activeFinishTimers[`room${roomId}`] = null;
        }

        //добавляем клас на комнату
        let lotoRoomTimerText = lotoRoom.querySelector(
          ".room-left__item-timer-block .timer-block__text"
        );
        lotoRoomTimerText.innerHTML = "Закончится";
        lotoRoom.classList.add("finishing");

        let countDownDate = new Date(timers[`room${roomId}`]).getTime();

        let nowClientTime = await NowClientTime();

        let distance = nowClientTime - countDownDate;

        // запускаем новый интервал
        let timer = setInterval(async function () {
          distance = distance + 1000;
          const minutes = Math.floor(distance / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          const formattedMinutes = String(minutes).padStart(2, "0");
          const formattedSeconds = String(seconds).padStart(2, "0");

          if (lotoRoomTimer) {
            lotoRoomTimer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
          }
        }, 1000);

        activeFinishTimers[`room${roomId}`] = timer;
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
        let ticketCellNumber = document.createElement("div");
        ticketCellNumber.classList.add("ticket-cell-number");
        ticketCellNumber.innerHTML = cell;
        ticketCell.appendChild(ticketCellNumber);
        ticket.appendChild(ticketCell);
      });
      ticketsBody.appendChild(ticket);
    }
  });
}

function deleteTickets() {
  let ticketsBody = document.querySelector(".loto-gamemain");
  let ticketContainers = ticketsBody.querySelectorAll(".ticket-container");

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
  let lotoGameInfo = document.querySelector(".loto-room-page");
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
function updatIngameBank(bank) {
  let lotoGameInfo = document.querySelector(".loto-game-room-page");
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

export function animateJackpot() {
  let lotoJackpot = document.querySelector(".room-jackpot-sum");
  if (lotoJackpot) {
    lotoJackpot.classList.add("animating");
  }
}

function updateJackpot(jackpot) {
  let lotoJackpot = document.querySelector(".room-jackpot-sum span");
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
          impAudio.playDeleteTicket();
        } else counterValue.innerHTML = +counterValue.innerHTML;
      }
    }
  }
}

function createClientId() {
  // текущее время в миллисекундах
  const currentTimeMs = Date.now();

  //случайное число для обеспечения уникальности
  const randomValue = Math.floor(Math.random() * 100000);

  // уникальный идентификатор, объединив текущее время и случайное число
  const uniqueId = `${currentTimeMs}-${randomValue}`;

  return uniqueId;
}
