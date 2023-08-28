import * as impNav from "./navigation.js";
import * as impHttp from "./http.js";

// 100 предупреждения
// 200 выиграш
// 300 проиграш
// 400 ошибка в игре
// 500 анонс

export const open = (text, status, showButton = false, ws = null) => {
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content ${status === 200 ? "popup__content_won" : ""} ${
    status === 300 ? "popup__content_lost" : ""
  }">
    <button class="popup__close"></button>
    <div class="popup__text ${status === 400 ? "popup__text-red" : ""}">
      ${text}
    </div>
    ${showButton ? `<button class="popup__button">Продолжить</button>` : ""}
  </div>
</div>`;

  body.appendChild(popupElement);

  if (showButton) {
    const button = body.querySelector(".popup__button");
    button.addEventListener("click", () => {
      close(popupElement);
      ws.close(
        1000,
        JSON.stringify({ method: "exitGame", userId: window.userId })
      );
    });
  }
  const closeButton = document.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });
};

export function close(element) {
  element.remove();
}

export const openExitPopup = (text, roomId, bet = null) => {
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
  <div class="popup__body">
    <div class="popup__content">
      <button class="popup__close close-popup"></button>
      <div class="popup__text">
        ${text}
      </div>
      <button class="popup__button popup__submit-button red">Да</button>
      <button class="popup__button close-popup green">Нет</button>
    </div>
  </div>`;

  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);
    let responce = await impHttp.deleteTicketsReturnBalance(roomId, bet);
    if (responce.status == 200) {
      impNav.updateBalance(responce.data.balance);
      location.hash = "";
    } else {
      open("Ошибка выхода из игры", 300);
    }
    // responce.data.balance
  });

  const closeButtons = document.querySelectorAll(".close-popup");
  closeButtons.forEach((closeButton) => {
    closeButton.addEventListener("click", function () {
      close(popupElement);
    });
  });
};

export const openEndGamePopup = (
  title,
  status,
  winnersData,
  bank,
  isJackpotWon,
  jackpotData
) => {
  //status
  //200 - ok
  //400 - error
  let wonSum = bank / winnersData.length;

  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "end-game-popup");

  popupElement.innerHTML = `
  <div class="popup__body end-game-popup__body">
  <div class="popup__content end-game-popup__content">
    <button class="popup__close-timer close-popup-timer">00</button>
    <div class="popup__title end-game-popup__title">
      ${title}
    </div>
    <div class="popup__text end-game-popup__text">
      Список победителей:
    </div>
    <div class="end-game-popup__winners-wrapper">
      <div class="end-game-popup__winners end-game-winners">
        
      </div>
    </div>
  </div>
</div>
    `;

  // вставляем победителей и их билеты

  let winnersBody = popupElement.querySelector(".end-game-winners");
  winnersData.forEach((winnerData) => {
    let winnerItem = document.createElement("div");
    winnerItem.classList.add("end-game-winners__item");

    let winnerItemHeader = document.createElement("div");
    winnerItemHeader.classList.add("end-game-winners__item-header");

    let winnerItemName = document.createElement("div");
    winnerItemName.classList.add("end-game-winners__item-name");
    winnerItemName.innerHTML = `${winnerData.userName}`;

    let winnerItemWon = document.createElement("div");
    winnerItemWon.classList.add("end-game-winners__item-won");
    winnerItemWon.innerHTML = `${wonSum}`;

    winnerItemHeader.appendChild(winnerItemName);
    winnerItemHeader.appendChild(winnerItemWon);
    winnerItem.appendChild(winnerItemHeader);

    winnerData.cards.forEach((card) => {
      let ticket = document.createElement("div");
      ticket.classList.add("end-game-winners__item-ticket");

      card.forEach((cellNumber) => {
        let cellItem = document.createElement("div");
        cellItem.classList.add("end-game-winners__item-ticket-cell");
        let cellNumberItem = document.createElement("div");
        cellNumberItem.classList.add("end-game-winners__item-ticket-number");
        cellNumberItem.innerHTML = cellNumber;
        if (cellNumber != " ") {
          cellItem.classList.add("active");
        }
        cellItem.appendChild(cellNumberItem);
        ticket.appendChild(cellItem);
      });

      winnerItem.appendChild(ticket);
    });
    winnersBody.appendChild(winnerItem);
  });

  // запускаем таймер до следующего переключения на попап

  var timerElement = popupElement.querySelector(".close-popup-timer");

  // Устанавливаем начальное значение таймера
  var seconds = 10;

  // Функция обновления таймера
  function updateTimer() {
    timerElement.textContent = seconds;
    seconds--;
    timerElement.innerHTML = seconds;

    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerElement.innerHTML = 0;
      close(popupElement);
      openJackpotPopup(isJackpotWon, jackpotData);
    }
  }

  var timerInterval = setInterval(updateTimer, 1000);

  body.appendChild(popupElement);

  // const closeButtons = document.querySelectorAll(".close-popup");
  // closeButtons.forEach((closeButton) => {
  //   closeButton.addEventListener("click", function () {
  //     close(popupElement);
  //   });
  // });
};

function openJackpotPopup(isJackpotWon, jackpotData) {
  if (isJackpotWon) {
    const body = document.querySelector("body");
    let popupElement = document.createElement("div");
    popupElement.classList.add("popup", "jackpot-popup");
    popupElement.innerHTML = `
    <div class="popup__body jackpot-popup__body">
      <div class="popup__content jackpot-popup__content">
        <div class="jackpot-popup__jackpot animation">${jackpotData.jackpotSum}</div>
        <div class="popup__title jackpot-popup__title visible">
          Джекпот был выигран игроком ${jackpotData.jackpotWinnerName}!
        </div>
      </div>
    </div>
      `;
    body.appendChild(popupElement);
    setTimeout(() => {
      close(popupElement);
    }, 11000);
  } else {
    const body = document.querySelector("body");
    let popupElement = document.createElement("div");
    popupElement.classList.add("popup", "jackpot-popup");
    popupElement.innerHTML = `
    <div class="popup__body jackpot-popup__body">
      <div class="popup__content jackpot-popup__content">
        <div class="jackpot-popup__jackpot animation">${jackpotData.jackpotSum}</div>
        <div class="popup__title jackpot-popup__title visible">
          Джекпот не был выигран!
        </div>
      </div>
    </div>
      `;
    body.appendChild(popupElement);
    setTimeout(() => {
      close(popupElement);
    }, 11000);
  }
}
