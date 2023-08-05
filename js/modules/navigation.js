import * as impHttp from "./http.js";
import * as impLotoGame from "./loto-game.js";

export function lotoNavigation() {
  let lotoPage = document.querySelector("#loto");
  if (lotoPage) {
    let lotoRooms = lotoPage.querySelectorAll(".loto-room");

    lotoRooms.forEach((room) => {
      room.addEventListener("click", async function () {
        if (room.getAttribute("room") == 1) {
          let roomId = 1;
          let res = await impHttp.isGameStarted(roomId);
          if (res.data == true) {
            alert("Подождите пока предыдущая игра закончится");
            return;
          }

          let pageOpened = false;
          let gameStarted = false;

          let connectResponce = await impHttp.connectRoom(roomId);
          if (connectResponce.status == 200) {
            console.log("connected");
          }

          const eventSource = new window.EventSourcePolyfill(
            `${impHttp.API_URL}/game/get-messages?roomId=${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          eventSource.onmessage = function (event) {
            console.log(JSON.parse(event.data));
            let messageData = JSON.parse(event.data);
            if (!pageOpened) {
              openLotoRoom(eventSource, roomId);
              pageOpened = true;
            }
            // setTimeout(() => {
            // checkLotoQueue(eventSource, messageData, roomId);
            // }, 30000);
            updateLotoRoomInfo(eventSource, event.data, roomId);

            if (messageData.gameStatus == true) {
              countCards();
              if (!gameStarted) {
                impLotoGame.openGamePage(roomId, messageData, eventSource);
                gameStarted = true;
              }
              impLotoGame.gameInformation(roomId, messageData, eventSource);
            }
          };
        } else if (room.getAttribute("room") == 2) {
          let roomId = 2;
          let res = await impHttp.isGameStarted(roomId);
          if (res.data == true) {
            alert("Подождите пока предыдущая игра закончится");
            return;
          }

          let pageOpened = false;
          let gameStarted = false;

          let connectResponce = await impHttp.connectRoom(roomId);
          if (connectResponce.status == 200) {
            console.log("connected");
          }

          const eventSource = new window.EventSourcePolyfill(
            `${impHttp.API_URL}/game/get-messages?roomId=${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          eventSource.onmessage = function (event) {
            let messageData = JSON.parse(event.data);
            if (!pageOpened) {
              openLotoRoom(eventSource, roomId);
              // setTimeout(() => {
              //   checkLotoQueue(eventSource, messageData, roomId);
              // }, 30000);
              pageOpened = true;
            }

            updateLotoRoomInfo(eventSource, event.data, roomId);

            // checkLotoQueue(eventSource, messageData, roomId);
            if (messageData.gameStatus == true) {
              countCards();
              if (!gameStarted) {
                impLotoGame.openGamePage(roomId, messageData, eventSource);
                gameStarted = true;
              }
              impLotoGame.gameInformation(roomId, messageData, eventSource);
            }
          };
        } else if (room.getAttribute("room") == 3) {
          let roomId = 3;
          let res = await impHttp.isGameStarted(roomId);
          if (res.data == true) {
            alert("Подождите пока предыдущая игра закончится");
            return;
          }

          let pageOpened = false;
          let gameStarted = false;

          let connectResponce = await impHttp.connectRoom(roomId);
          if (connectResponce.status == 200) {
            console.log("connected");
          }

          const eventSource = new window.EventSourcePolyfill(
            `${impHttp.API_URL}/game/get-messages?roomId=${roomId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          eventSource.onmessage = function (event) {
            console.log(JSON.parse(event.data));
            let messageData = JSON.parse(event.data);
            if (!pageOpened) {
              openLotoRoom(eventSource, roomId);
              // setTimeout(() => {
              //   checkLotoQueue(eventSource, messageData, roomId);
              // }, 30000);
              pageOpened = true;
            }

            updateLotoRoomInfo(eventSource, event.data, roomId);

            // checkLotoQueue(eventSource, messageData, roomId);
            if (messageData.gameStatus == true) {
              countCards();
              if (!gameStarted) {
                impLotoGame.openGamePage(roomId, messageData, eventSource);
                gameStarted = true;
              }
              impLotoGame.gameInformation(roomId, messageData, eventSource);
            }
          };
        }
      });
    });
  }
}

// export function showGeneralLotoOnline() {
//   const eventSource = new window.EventSourcePolyfill(
//     `${impHttp.API_URL}/game/get-loto-online`,
//     {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     }
//   );

//   // {room1: 0, room2: 12, room3: 0}

//   eventSource.onmessage = function (event) {
//     console.log(event.data);
//     let onlineData = JSON.parse(event.data);
//     // console.log(onlineData);

//     let lotoRooms = document.querySelectorAll(".loto-room");
//     lotoRooms.forEach((lotoRoom) => {
//       if (lotoRoom.getAttribute("room") == 1) {
//         let lotoRoomOnline = lotoRoom.querySelector(".game__online");
//         lotoRoomOnline.innerHTML = onlineData.room1;
//       }
//       if (lotoRoom.getAttribute("room") == 2) {
//         let lotoRoomOnline = lotoRoom.querySelector(".game__online");
//         lotoRoomOnline.innerHTML = onlineData.room2;
//       }
//       if (lotoRoom.getAttribute("room") == 3) {
//         let lotoRoomOnline = lotoRoom.querySelector(".game__online");
//         lotoRoomOnline.innerHTML = onlineData.room3;
//       }
//     });
//   };
// }

async function checkLotoQueue(eventSource, data, roomId) {
  if (data.information.online < 2) {
    let responce = await impHttp.disconnectRoom(roomId);
    eventSource.close();
    // window.location.reload();
  }
}

function openLotoRoom(eventSource, roomId) {
  let body = document.querySelector("main");
  body.innerHTML = `  <div class="loto-room-page">
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

  let cells = impLotoGame.generateLotoCard();
  createTicket(cells);
  counterTickets();
  buyTickets();

  // set timer untill the game

  // exit from room
  let exitButton = document.querySelector(".loto-room-page__exit");
  exitButton.addEventListener("click", async function () {
    let responce = await impHttp.disconnectRoom(roomId);
    eventSource.close();
    if (responce?.status == 200) {
      location.reload();
    } else {
      alert("error");
    }
  });
}

async function setLotoGameTimer(eventSource, roomData, roomId) {
  let timerBlock = document.querySelector(".loto-room-page__timer");
  const startedAt = new Date(roomData.information.startedAt).getTime();
  // const targetTime = startedAt + 5 * 60 * 1000; // 5 minutes in milliseconds
  const targetTime = startedAt + 30 * 1000; // 5 minutes in milliseconds

  const timer = setInterval(async () => {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      clearInterval(timer);
      if (timerBlock) {
        timerBlock.innerHTML = "00:00";
      }

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

    if (roomData.gameStatus == true) {
      clearInterval(timer);
      if (timerBlock) {
        timerBlock.innerHTML = "00:00";
      }
    }
  }, 10);
}

function countCards() {
  let userCards = document.querySelectorAll(".bought-ticket");
  console.log(userCards);
  if (userCards.length == 0) {
    alert("купите карточки для начала игры");
    location.reload();
  }
}

async function buyTickets() {
  let buyButton = document.querySelector(".loto-gamecontrolls__buy");
  buyButton.addEventListener("click", async function () {
    let ticketsBody = document.querySelector(".loto-gamemain");
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let ticketsArray = [];

    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      let ticketCellsArray = [];
      ticketCells.forEach((cell) => {
        let number = cell.innerHTML;
        ticketCellsArray.push(number);
      });
      ticketsArray.push(ticketCellsArray);
    });

    let responce = await impHttp.buyTickets(ticketsArray);
    if (responce.status == 200) {
      tickets.forEach((ticket) => {
        ticket.classList.add("bought-ticket");
      });
    }
  });
}

async function createTicket(cells) {
  let ticketsBody = document.querySelector(".loto-gamemain");
  if (ticketsBody) {
    let ticket = document.createElement("ul");
    ticket.classList.add("loto-gamemain__ticket");

    cells.forEach((cell) => {
      let ticketCell = document.createElement("li");
      ticketCell.classList.add("ticket-cell");
      ticketCell.innerHTML = cell;
      ticket.appendChild(ticketCell);
    });
    ticketsBody.appendChild(ticket);
  }
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

function updateLotoRoomInfo(eventSource, data, roomId) {
  let roomData = JSON.parse(data);

  setLotoGameTimer(eventSource, roomData, roomId);

  let lotoGameInfo = document.querySelector(".loto-gameinfo");
  if (lotoGameInfo) {
    let lotoOnline = lotoGameInfo.querySelector(".loto-gameinfo__online");
    let lotoBet = lotoGameInfo.querySelector(".loto-gameinfo__bet");
    let lotoBank = lotoGameInfo.querySelector(".loto-gameinfo__bank");

    lotoOnline.querySelector(
      "span"
    ).innerHTML = `${roomData.information.online}`;
    lotoBet.querySelector("span").innerHTML = `${roomData.information.bet}p`;
    lotoBank.querySelector("span").innerHTML = `${roomData.information.bank}p`;
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
        let cells = impLotoGame.generateLotoCard();
        createTicket(cells);
      }
    });
  }
}
