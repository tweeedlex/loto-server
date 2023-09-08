import * as impNav from "./navigation.js";
import * as impHttp from "./http.js";
import * as impAudio from "./audio.js";

// 100 предупреждения
// 200 выиграш
// 300 проиграш
// 400 ошибка в игре
// 500 анонс

const isPopupOpened = () => {
  return document.querySelector(".popup") ? true : false;
};

export const open = (text, status, showButton = false, ws = null) => {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "default-popup");
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

export const openErorPopup = (text) => {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "error-popup");
  popupElement.innerHTML = `<div class="popup__body">
  <div class="popup__content">
    <div class="popup-header">
      <p>Ошибка</p>
      <img src="img/error-icon.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <button class="popup__button">Закрыть</button>
  </div>
</div>`;

  body.appendChild(popupElement);

  const closeButton = document.querySelector(".popup__button");
  closeButton.addEventListener("click", function () {
    close(popupElement);
  });
};

export function close(element) {
  element.remove();
}

export const openAnotherAccountEnterPopup = (ws) => {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
  <div class="popup__body another-account-popup">
  <div class="popup__content">
    <div class="popup__img">
      <img src="img/popup-alert.png" alt="" />
    </div>
    <div class="popup__text">
      В ваш аккаунт вошли с другого места!
    </div>
    <div class="popup__buttons">
      <button class="popup__button popup__submit-button">Понятно</button>
    </div>
  </div>
</div>`;

  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);
    location.reload();
  });
};

export const openSuuccessBonusesChange = (ws) => {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
        <div class="popup__body success-bonuses-change-popup">
          <div class="popup__content">
           
            <div class="popup__text">
              Вы успешно обменяли бонусы!
            </div>
            <div class="popup__buttons">
              <button class="popup__button popup__submit-button">Ок</button>
            </div>
          </div>
        </div>`;
  body.appendChild(popupElement);

  const button = body.querySelector(".popup__submit-button");
  button.addEventListener("click", async () => {
    close(popupElement);
  });
};

export const openExitPopup = (text, roomId, bet = null) => {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup");
  popupElement.innerHTML = `
  <div class="popup__body exit-room-popup">
  <div class="popup__content">
    <div class="popup__img">
      <img src="img/popup-alert.png" alt="" />
    </div>
    <div class="popup__text">
      ${text}
    </div>
    <div class="popup__buttons">
      <button class="popup__button popup__submit-button red">Да</button>
      <button class="popup__button close-popup green">Нет</button>
    </div>
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
  if (isPopupOpened()) {
    return;
  }
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
    winnerItemWon.innerHTML = `${wonSum.toFixed(2)}₼`;

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
  if (isPopupOpened()) {
    return;
  }
  if (isJackpotWon) {
    const body = document.querySelector("body");
    let popupElement = document.createElement("div");
    popupElement.classList.add("popup", "jackpot-popup");
    popupElement.innerHTML = `
    <div class="popup__body jackpot-popup__body">
      <div class="popup__content jackpot-popup__content">
        <div class="jackpot-popup__jackpot-img">
          <img src="img/jackpot-text.png" alt="" />
        </div>
        <div class="jackpot-popup__jackpot animation"><span>${jackpotData.jackpotSum}</span>₼</div>
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
      <div class="jackpot-popup__jackpot-img">
        <img src="img/jackpot-text.png" alt="" />
      </div>
      <div class="jackpot-popup__jackpot animation"><span>${jackpotData.jackpotSum}</span>₼</div>
      <div class="popup__title jackpot-popup__title visible">
      Джекпот не выигран, попробуйте испытать свою удачу в следующей игре!
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

export function openJackpotInfoPopup() {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "jackpot-popup");
  popupElement.innerHTML = `
  <div class="popup__body jackpot-info-popup">
  <div class="popup__content">
    <div class="popup__text">
      Джекпот играет за 20 ходов, если в течение 20 ходов заполнить 1 любой
      ряд (верхний/средний/нижний), то вы будете победителем
      джекпота.
    </div>
    <img src="img/jackpot-info-image.png" class="jackpot-popup-image">
    <div class="popup-button__gotit">Понятно</div>
  </div>
</div>
      `;

  let gotItBtn = popupElement.querySelector(".popup-button__gotit");
  gotItBtn.addEventListener("click", function () {
    close(popupElement);
  });

  body.appendChild(popupElement);
}

export function openInfoTokensPopup() {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "jackpot-popup");
  popupElement.innerHTML = `
  <div class="popup__body jackpot-info-popup">
    <div class="popup__content">
      <div class="popup__text popup__text-bold">
        Уважаемые игроки накопив баллы вы можете обменить их на ₼.
        Для обмена вам требуется минимум 100 бонусов.
        Курс Обмена 100 бонусов = 0.20 ₼
      </div>
      <div class="tokens-popup-table">
        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              0.20 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              2 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              0.50 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              5 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              1.00 ₼
            </p>
          </div>

          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              10 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              5.00 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              50 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>

        <div class="tokens-popup-table__item">
          <div class="tokens-table-item-left">
            <img class="tokens-popup-left-image" src="img/money-arm.png" width="40" alt="icon">
            <p class="tokens-popup-left-text">
              10.00 ₼
            </p>
          </div>
          <div class="tokens-table-item-right">
            <p class="tokens-popup-right-text">
              100 coin
            </p>
            <img class="tokens-popup-right-image" src="img/room-tokens-decor.png" alt="icon">
          </div>
        </div>
      </div>
      <div class="popup-button__gotit">Понятно</div>
    </div>
  </div>
  `;

  let gotItBtn = popupElement.querySelector(".popup-button__gotit");
  gotItBtn.addEventListener("click", function () {
    close(popupElement);
  });

  body.appendChild(popupElement);
}

export function openChangeLanguage() {
  if (isPopupOpened()) {
    return;
  }
  const body = document.querySelector("body");
  let popupElement = document.createElement("div");
  popupElement.classList.add("popup", "change-language-popup");
  popupElement.innerHTML = `
  <div class="popup__body change-language-popup">
  <div class="popup__content language-popup-content">
    <div class="popup__text popup__text-bold">
      Выберите язык
    </div>
    <div class="change-language-popup__buttons">
      <button lang="ru" class="language-popup__button">Русский</button>
      <button lang="UA" class="language-popup__button">Українська</button>
      <button lang="AZ-TR" class="language-popup__button">Azərbaycan dili</button>
      <button lang="EN" class="language-popup__button">English</button>
    </div>
  </div>
  `;

  const languageButtons = popupElement.querySelectorAll(
    ".language-popup__button"
  );
  languageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let lang = button.getAttribute("lang");
      localStorage.setItem("language", lang);
      impAudio.setLanguage(lang);
      close(popupElement);
    });
  });

  body.appendChild(popupElement);
}
