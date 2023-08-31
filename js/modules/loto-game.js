import * as impHttp from "./http.js";
import * as impLotoNav from "./loto-navigation.js";
import * as impPopup from "./popup.js";
import * as impAudio from "./audio.js";
import * as impMoveElement from "./move-element.js";

export const getBetByRoomId = (roomId) => {
  let bet;
  switch (roomId) {
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
  return bet;
};

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

const deleteNumbers = (card) => {
  const newCard = [...card];
  // delete 4 numbers from each row

  for (let i = 0; i < 3; i++) {
    let row = newCard.slice(i * 9, i * 9 + 9);
    let numbers = [];
    for (let j = 0; j < 9; j++) {
      if (row[j] != " ") {
        numbers.push(j);
      }
    }

    let numbersToDelete = generateRandomNumbersWithoutRepeats(0, 8, 4);
    numbersToDelete.forEach((number) => {
      row[number] = " ";
    });

    for (let j = 0; j < 9; j++) {
      newCard[i * 9 + j] = row[j];
    }
  }

  return newCard;
};

export function generateLotoCard() {
  let card = [];

  for (let i = 0; i < 27; i++) {
    card.push(0);
  }

  for (let i = 1; i <= 9; i++) {
    const column = generateRandomNumbersWithoutRepeats(i * 10 - 9, i * 10, 3);

    for (let j = 0; j < 3; j++) {
      let index = j * 9 + i - 1;
      card[index] = column[j];
    }
  }

  let isValid = false;
  let newCard;

  while (!isValid) {
    isValid = true;
    newCard = deleteNumbers(card);

    for (let i = 0; i < 9; i++) {
      if (
        newCard[i] == " " &&
        newCard[i + 9] == " " &&
        newCard[i + 18] == " "
      ) {
        isValid = false;
      }
    }

    let rows = [];
    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j < 9; j++) {
        rows.push(newCard[j]);
      }
    }

    // check if each row has 5 numbers
    for (let i = 0; i < 27; i += 9) {
      let row = rows.slice(i, i + 9);
      let count = 0;
      row.forEach((cell) => {
        if (cell != " ") {
          count++;
        }
      });

      if (count != 5) {
        isValid = false;
      }
    }
  }

  // make unique id
  let id = "";
  for (let i = 0; i < 27; i++) {
    if (newCard[i] != " ") {
      id += newCard[i];
    }
  }
  id += new Date().getTime();

  return { newCard, id };
}

export async function openGamePage(
  online = null,
  bet = null,
  bank = null,
  roomId = null,
  jackpot = null
) {
  let body = document.querySelector("main");
  body.innerHTML = `  
  <div class="loto-game-room-page">
    <div class="loto-game-room-page-content">
      <div class="room-jackpot">
        <div class="room-jackpot-sum">
          <img src="img/jackpot-icon.png" alt="" /><span>${
            jackpot != null ? Number(jackpot).toFixed(2) : 0
          }</span> ₼
        </div>
        <div class="room-jackpot-question">
          <img src="img/question-tag.png" alt="" />
        </div>
      </div>
      <div class="loto-room__gameinfo loto-gameinfo">
        <div class="loto-gameinfo__top-row">
          <p class="loto-gameinfo__top-row-item loto-gameinfo__bet">
            Ставка: <span>${bet != null ? bet : 0}</span> ₼
          </p>
          <p class="loto-gameinfo__top-row-item loto-gameinfo__bank">
            Банк: <span>${bank != null ? Number(bank).toFixed(2) : 0}</span> ₼
          </p>
          <div class="loto-room-page__exit-wrapper"></div>
        </div>
        <div
          class="loto-gameinfo__bottom-row loto-game-gameinfo__bottom-row"
        >
          <p class="loto-gameinfo__online">
            <img src="img/online-icon.png" alt="" /> <span>${
              online != null ? online : 0
            }</span>
          </p>
          <p class="loto-gameinfo__auto-button active">
            <img src="img/autogame-icon.png" alt="" /><span>АВТО</span>
          </p>
          <p class="loto-gameinfo__sounds-button active">
            <img src="img/profile icons/sound.png" alt="" />
          </p>
          <p class="loto-gameinfo__jackpot-block-wrapper"></p>
        </div>
      </div>
      <div class="loto-gameinfo__information-left left3">
        У <span>0</span> карточек осталось 3 номера
      </div>

      <div class="loto-game-room__gameprocess">
      </div>
      <div class="loto-gamemain__body">
        <div class="col-div loto-game-room__main loto-gamemain"></div>
      </div>
    </div>
  </div>
  `;

  impMoveElement.moveElement(
    "loto-game-room-page-content",
    "room-jackpot",
    "loto-gameinfo",
    "loto-gameinfo__jackpot-block-wrapper",
    768
  );

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

  const jackpotInformationButton = document.querySelector(
    ".room-jackpot-question"
  );

  jackpotInformationButton.addEventListener("click", function () {
    impPopup.openJackpotInfoPopup();
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

  // убираем навигацию сайта
  let footer = document.querySelector("#footer");
  if (footer && !footer.classList.contains("d-none")) {
    footer.classList.add("d-none");
  }
  // показываем билеты
  let userCards = await impHttp.getTickets();
  userCards = userCards.data;
  showUserTickets(userCards, roomId);

  // добавляем функционал на кнопку "авто игра"
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
}

export function showJackpotWon(winner, sum) {
  if (winner == window.userId) {
    // impPopup.open(
    //   `Поздравляем вы выиграли джекпот! Ваша сумма выигрыша составила ${sum.toFixed(
    //     2
    //   )}М`,
    //   200
    // );
    // setTimeout(() => {
    //   const popup = document.querySelector(".popup");
    //   impPopup.close(popup);
    // }, 5000);
  }

  const jackpotSum = document.querySelector(".room-jackpot-sum");
  if (jackpotSum) {
    jackpotSum.innerHTML = "выигран!";
  }
}

export function showUserTickets(tickets, roomId) {
  // удаляем все старые
  let oldTickets = document.querySelectorAll(".bought-ticket");
  oldTickets.forEach((item) => {
    item.remove();
  });

  if (tickets.length == 0) {
    return;
  }
  // создаем новые
  let boughtTicketsCounter = 0;
  tickets.forEach((ticket) => {
    if (ticket.gameLevel == roomId) {
      boughtTicketsCounter++;
      let cells = JSON.parse(ticket.card);
      let id = ticket.id;
      let ticketStatus = ticket.isActive;
      let ticketsBody = document.querySelector(".loto-gamemain");
      if (ticketsBody) {
        let ticket = document.createElement("ul");
        ticket.classList.add("loto-gamemain__ticket", "bought-ticket");
        if (ticketStatus == false) {
          ticket.classList.add("unavailable");
        }
        ticket.setAttribute("id", id);
        ticket.setAttribute("choosedCasks", JSON.stringify([]));
        ticket.setAttribute("mustBeChoosed", JSON.stringify([]));
        ticket.setAttribute("unavailableCasks", JSON.stringify([]));
        cells.forEach((cell) => {
          let ticketCell = document.createElement("li");
          ticketCell.classList.add("ticket-cell");
          ticketCell.innerHTML = cell;
          ticket.appendChild(ticketCell);
        });
        ticketsBody.appendChild(ticket);
      }
    }
  });
  let roomTicketCouner = document.querySelector(".loto-gamecontrolls__counter");
  if (roomTicketCouner) {
    let counterValue = roomTicketCouner.querySelector(
      ".loto-gamecontrolls__counter__value"
    );
    counterValue.innerHTML = boughtTicketsCounter || 1;
  }
}

export function showUserTicketsInLobby(tickets, roomId) {
  tickets.forEach((ticket) => {
    if (ticket.gameLevel == roomId) {
      let cells = JSON.parse(ticket.card);
      let id = ticket.id;
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
    }
  });
}

export function createCask(ws, cask, caskNumber, pastCasks) {
  let gameprocessBlock = document.querySelector(".loto-game-room__gameprocess");
  let caskBlock = document.createElement("div");

  if (cask <= 10) {
    impAudio.playNumber(cask);
  }
  caskBlock.classList.add("loto-game-room__cask");
  caskBlock.innerHTML = cask;

  let caskNumberBlock = document.createElement("span");
  caskNumberBlock.innerHTML = caskNumber;
  caskNumberBlock.classList.add("cask-number");

  // убираем все бочки что старее 5
  if (gameprocessBlock.children.length > 5) {
    gameprocessBlock.removeChild(gameprocessBlock.children[0]);
  }
  // убираем все цвета с бочек
  gameprocessBlock.querySelectorAll(".loto-game-room__cask").forEach((cask) => {
    cask.classList.remove("active");
  });
  // удаляем предидущик номера бочки
  let allOldCasks = document.querySelectorAll(".cask-number");
  allOldCasks.forEach((oldCaskNum) => {
    if (oldCaskNum) {
      oldCaskNum.remove();
    }
  });
  // Устанавливаем желтый цвет только для последней вставленной бочки
  caskBlock.classList.add("active");
  caskBlock.appendChild(caskNumberBlock);
  gameprocessBlock.appendChild(caskBlock);

  // получаем состояние кнопки авто
  let buttonAuto = document.querySelector(".loto-gameinfo__auto-button");
  if (buttonAuto) {
    if (buttonAuto.classList.contains("active")) {
      colorCask(cask, pastCasks);
    } else if (!buttonAuto.classList.contains("active")) {
      checkChoosedCasks(ws, pastCasks);
      selectCaskByFinger(pastCasks);
    }
  }
}

function checkChoosedCasks(ws, pastCasks) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        if (!cell.classList.contains("droped")) {
          if (pastCasks.includes(Number(cell.innerHTML))) {
            cell.classList.add("droped");
            let mustBeChoosed = ticket.getAttribute("mustBeChoosed");
            ticket.setAttribute(
              "mustBeChoosed",
              JSON.stringify([
                ...JSON.parse(mustBeChoosed),
                Number(cell.innerHTML),
              ])
            );
          }
        } else {
          // если число не отмечено и оно есть в mustbechoosed, при том что оно так же есть в pastcasks без последних 5, значит ставим крестик и билет не активен
          const pastCasksWithoutLastSeven = pastCasks.slice(0, -7);
          if (
            pastCasksWithoutLastSeven.includes(Number(cell.innerHTML)) &&
            JSON.parse(ticket.getAttribute("mustBeChoosed")).includes(
              Number(cell.innerHTML)
            ) &&
            !cell.classList.contains("active")
          ) {
            cell.classList.add("unavailable");
            const unavailableCasks =
              JSON.parse(ticket.getAttribute("unavailableCasks")) || [];
            ticket.setAttribute(
              "unavailableCasks",
              JSON.stringify([...unavailableCasks, +cell.innerHTML])
            );
            if (!ticket.classList.contains("unavailable")) {
              ticket.classList.add("unavailable");
              let ticketId = ticket.getAttribute("id");

              ws.send(
                JSON.stringify({
                  method: "cancelCard",
                  cardId: ticketId,
                })
              );
            }
          }
        }
      });
    });
  }
}

function selectCaskByFinger(pastCasks) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    // удалить все евент листенеры с билетов
    let pastTickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let listeners = [];
    pastTickets.forEach((ticket, index) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        cell.removeEventListener("click", listeners[index]);
      });
    });

    // добавить новый евент листенер на билеты
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      ticketCells.forEach((cell) => {
        let listener = colorThisCask(cell, pastCasks, ticket);
        listeners.push(listener);
        cell.addEventListener("click", listener);
      });
    });
  }

  function colorThisCask(cell, pastCasks, ticket) {
    return function (event) {
      let thisCellNumber = Number(cell.innerHTML);
      if (
        pastCasks.includes(thisCellNumber) &&
        !cell.classList.contains("unavailable")
      ) {
        if (!cell.classList.contains("active")) {
          impAudio.playSuccess();
        }
        cell.classList.add("active");
        // обновляем все выбраные бочки
        let allActiveCasks = ticket.querySelectorAll(".ticket-cell.active");
        const activeCaskNumbers = [];
        for (let i = 0; i < allActiveCasks.length; i++) {
          let activeCaskNumber = allActiveCasks[i].innerHTML;
          activeCaskNumbers.push(Number(activeCaskNumber));
        }

        ticket.setAttribute("choosedcasks", JSON.stringify(activeCaskNumbers));
        console.log(ticket.getAttribute("choosedcasks"));
      }
    };
  }
}

function colorCask(cask, pastCasks) {
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    // заполнение новой выпавшей циферки
    tickets.forEach((ticket) => {
      let ticketCells = ticket.querySelectorAll(".ticket-cell");
      // if (!ticket.classList.contains("unavailable")) {
      ticketCells.forEach((cell) => {
        if (
          !cell.classList.contains("active") &&
          !cell.classList.contains("unavailable")
        ) {
          if (cask == Number(cell.innerHTML)) {
            impAudio.playSuccess();
            cell.classList.add("active");
            let allActiveCasks = ticket.querySelectorAll(".ticket-cell.active");
            ticket.setAttribute("choosedcasks", allActiveCasks.length);
          }
        }
      });
      // }
    });
  }
}

export async function colorDropedCasks(pastCasks) {
  const page = document.querySelector(".loto-game-room-page");

  if (!page.classList.contains("auto-filled")) {
    page.classList.add("auto-filled");

    let ticketsBody = document.querySelector(".loto-game-room__main");
    const { data: ticketsData } = await impHttp.getTickets();

    if (ticketsBody) {
      let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
      // заполнение старых цифр которые сейчас не заполнены
      tickets.forEach((ticket) => {
        const ticketData = ticketsData.find(
          (item) => item.id == ticket.getAttribute("id")
        );
        if (ticketData.isActive == false) {
          ticket.classList.add("unavailable");
        }
        let ticketCells = ticket.querySelectorAll(".ticket-cell");
        const unavailableCasks =
          JSON.parse(ticket.getAttribute("unavailableCasks")) || [];
        ticketCells.forEach((cell) => {
          if (
            ticketData.isActive == true &&
            !cell.classList.contains("active") &&
            !cell.classList.contains("unavailable")
          ) {
            if (pastCasks.includes(Number(cell.innerHTML))) {
              impAudio.playSuccess();
              if (
                !unavailableCasks.includes(+cell.innerHTML) &&
                ticketData.isActive == true
              ) {
                cell.classList.add("active");
              }
              let allActiveCasks = ticket.querySelectorAll(
                ".ticket-cell.active"
              );
              ticket.setAttribute("choosedcasks", allActiveCasks.length);
            }
          } else if (
            ticketData.isActive == false &&
            pastCasks.includes(Number(cell.innerHTML))
          ) {
            cell.classList.add("unavailable");
          }
        });
      });
    }
  }
}

export function checkWin(
  winners,
  bank,
  winnersAmount,
  isJackpotWon,
  jackpotData,
  winnersData
) {
  let winnersIds = winners;
  let ticketsBody = document.querySelector(".loto-game-room__main");
  if (ticketsBody) {
    let tickets = ticketsBody.querySelectorAll(".loto-gamemain__ticket");
    let winTickets = 0;
    tickets.forEach((ticket) => {
      let ticketId = ticket.getAttribute("id");
      if (winnersIds.includes(ticketId)) {
        winTickets++;
      }
    });

    const wonSum = (bank / winnersAmount) * winTickets;

    let jackpotWonMessage = "";
    if (isJackpotWon) {
      jackpotWonMessage = "Джекпот был выигран!";
    } else {
      jackpotWonMessage = "Джекпот не был выигран.";
    }

    if (winTickets > 0) {
      impAudio.playLoading();
      impPopup.openEndGamePopup(
        `Поздравляем, вы выиграли ${(bank / winnersData.length).toFixed(2)} ₼!`,
        200,
        winnersData,
        bank,
        isJackpotWon,
        jackpotData
      );
      // impPopup.open(
      //   `Общее количество победивших билетов ${winnersAmount}. Из них ваших ${winTickets}, сума выигрыша ${wonSum}. Поздравляем! \n${jackpotWonMessage}`,
      //   200,
      //   winnersData
      // );
      return;
    } else {
      impAudio.playLoading();
      impPopup.openEndGamePopup(
        "К сожалению вы не смогли выиграть попробуйте еще раз.",
        400,
        winnersData,
        bank,
        isJackpotWon,
        jackpotData
      );
    }
  }
}
