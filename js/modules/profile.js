import * as impAuth from "./authorization.js";
import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";

export async function openProfilePage() {
  let main = document.querySelector("main");
  if (main) {
    let userInfo = await getProfileInfo();

    if (userInfo == false) {
      return;
    }
    main.innerHTML = `<div class="main__container">
    <section class="password-form">
      <div class="password-form-header">
        <h3 class="password-form-header__title">Профиль игрока</h3>
      </div>
      <div class="password-form-main">
        <div class="password-form-main__block profile-block">
          <div class="profile-block__section">
            <div class="profile-block__item button">
              <h4>Баланс: <span>${userInfo.balance.toFixed(2)}</span></h4>
              <div class="topup-balance">+</div>
            </div>
          </div>
          <div class="profile-block__section">
            <h3 class="profile-block__item title">
              Информация об аккаунте
            </h3>
            <p class="profile-block__item text">
              Имя: <span class="profile-name">${userInfo.name}</span>
            </p>
            <p class="profile-block__item text">
              Почта: <span class="profile-email">${userInfo.email}</span>
            </p>
            <p class="profile-block__item text">
              Username: <span class="profile-username">${
                userInfo.username
              }</span>
            </p>
            <div class="profile-block__item button change-password">
              <h4>Изменить пароль</h4>
            </div>
          </div>
          <div class="profile-block__section">
            <h3 class="profile-block__item title">Другое</h3>
            <div class="profile-block__item button" id="user-game-stats">
              <h4>Статистика игр</h4>
            </div>
            <div class="profile-block__item button">
              <h4>Транзакции</h4>
            </div>
            <div class="profile-block__item button exit logout-button">
              <h4>Выйти</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>`;
  }

  const gameStatsButton = document.querySelector("#user-game-stats");
  gameStatsButton.addEventListener("click", function () {
    openUserGames();
  });

  const changePasswordButton = document.querySelector(".change-password");
  changePasswordButton.addEventListener("click", function () {
    openChangePasswordForm();
  });

  let profilePage = document.querySelector(".password-form");
  let logoutButton = profilePage.querySelector(".logout-button");
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token");
    location.reload();
  });
}

async function openUserGames() {
  let main = document.querySelector("main");
  if (main) {
    const userGames = await impHttp.getUserGames();

    main.innerHTML = `
      <div class="main__container">
        <section class="user-game-history">
          <div class="pader user-game-history-header">
            <div class="user-game-history-header__back"><</div>
            <h3 class="user-game-history-header__title">Статистика игрока</h3>
          </div>
          <div class="user-game-history__main">            
          </div>
        </section>
      </div>
    `;

    // выйти назад в профиль
    let buttonBack = document.querySelector(".user-game-history-header__back");
    if (buttonBack) {
      buttonBack.addEventListener("click", function () {
        openProfilePage();
      });
    }

    let mainBlock = document.querySelector(".user-game-history__main");
    userGames.data.forEach((game, index) => {
      // создаем игру с истории юзера
      game.tickets = JSON.parse(game.tickets);
      game.casks = JSON.parse(game.casks);
      let gameitem = document.createElement("div");
      gameitem.classList.add(
        "user-game__item",
        "game-item",
        `game-item-${index}`
      );
      gameitem.innerHTML = `
        <div class="game-item__tickets-block">
          <!-- tickets -->
        </div>
        <div class="game-item__row game-item__isWon">
          Результат: <span>${game.isWinner ? "Победил" : "Проиграл"}</span>
        </div>
        <div class="game-item__row game-item__winSum">
          Сума выигрыша: <span>${game.winSum.toFixed(2)}</span>M
        </div>
        <div class="game-item__row game-item__last-index">
          Ход: <span class="game-item__last-index-num">${game.winIndex}</span>
        </div>
        <div class="game-item__row game-item__jackpotWon">
          Джекпот выигран:
          <span class="game-item__jackpotWon-status">${
            game.isJackpotWon ? "да" : "нет"
          }</span>
        </div>
        <div class="game-item__row game-item__price">
          Цена билета: <span class="game-item__price-sum">${game.bet.toFixed(
            2
          )}</span>M
        </div>
        <div class="game-item__row game-item__bet">
          Ставка: <span class="game-item__bet-sum">${(
            game.bet * game.tickets.length
          ).toFixed(2)}</span>M
        </div>
        <div class="game-item__row game-item__bank">
          Общий банк: <span class="game-item__bank-sum">${game.bank.toFixed(
            2
          )}</span>M
        </div>
      `;

      mainBlock.appendChild(gameitem);
      let gameItem = document.querySelector(`.game-item-${index}`);
      let ticketsBodyBlock = gameItem.querySelector(
        ".game-item__tickets-block"
      );
      if (ticketsBodyBlock) {
        createHistoryUserTickets(
          ticketsBodyBlock,
          userGames.data[index].tickets
        );
      }
    });
  }
}

function createHistoryUserTickets(parent, tickets) {
  // ticket = ticket.card;
  tickets.forEach((ticket) => {
    let ticketCard = JSON.parse(ticket.card);
    let ticketBlock = document.createElement("ul");
    ticketBlock.classList.add("loto-gamemain__ticket");
    ticketCard.forEach((cell) => {
      let ticketCell = document.createElement("li");
      ticketCell.classList.add("ticket-cell");
      ticketCell.innerHTML = cell;
      ticketBlock.appendChild(ticketCell);
    });
    parent.appendChild(ticketBlock);
  });
  // let tickets =
  // tickets.forEach(ticket=>{
  //   ticket.forEach(cell=>{
  //     let ticketCell = document.createElement("li");
  //     ticketCell.classList.add("ticket-cell");
  //     ticketCell.innerHTML = cell;
  //     ticket.appendChild(ticketCell);
  //   })
  // })
  // let ticket = document.createElement("ul");
  //   ticket.classList.add("loto-gamemain__ticket");
  //   // ticket.setAttribute("id", ticketId);
  //   cells.forEach((cell) => {
  //     let ticketCell = document.createElement("li");
  //     ticketCell.classList.add("ticket-cell");
  //     ticketCell.innerHTML = cell;
  //     ticket.appendChild(ticketCell);
  //   });
  //   ticketsBody.appendChild(ticket);
}

export function openChangePasswordForm() {
  let profilePage = document.querySelector(".password-form");
  profilePage.innerHTML = `
  <div class="password-form-header">
    <div class="password-form-header__back"><</div>
    <h3 class="password-form-header__title">Изменение пароля</h3>
  </div>
  <div class="password-form-main">
    <div class="password-form-main__block profile-block">
      <div class="password-form-block__section">
        <div class="password-form-block__item">
          <label for="old-password">Старый пароль</label>
          <input type="password" id="old-password" class="password-form-block__item input"> 
        </div>
        <div class="password-form-block__item">
          <label for="new-password">Новый пароль</label>
          <input type="password" id="new-password" class="password-form-block__item input">
        </div>
        <div class="password-form-block__item">
          <label for="new-password-repeat">Повторите новый пароль</label>
          <input type="password" id="new-password-repeat" class="password-form-block__item input">
        </div>
        <div class="password-form-block__item password-button change-password">
          <h4>Изменить пароль</h4>
        </div>
      </div>
    </div>
  </div>
  `;

  // выйти назад в профиль
  let buttonBack = document.querySelector(".password-form-header__back");
  if (buttonBack) {
    buttonBack.addEventListener("click", function () {
      openProfilePage();
    });
  }

  // кнопка изменения пароля
  let changePasswordButton = profilePage.querySelector(".change-password");
  changePasswordButton.addEventListener("click", async function () {
    let oldPassword = document.querySelector("#old-password").value;
    let newPassword = document.querySelector("#new-password").value;
    let newPasswordRepeat = document.querySelector(
      "#new-password-repeat"
    ).value;
    if (newPassword != newPasswordRepeat) {
      impPopup.open("Пароли не совпадают", 400);
      return;
    }

    let data = {
      password: oldPassword,
      newPassword: newPassword,
    };

    let status = await impHttp.changePassword(data);
    if (status.data == false) {
      impPopup.open("Неверный пароль", 400);
      return;
    }
    impPopup.open("Пароль успешно изменен", 200);
    openProfilePage();
  });
}

async function getProfileInfo() {
  let userInfo = await impAuth.getUser();
  return userInfo;
}

export function openUserStatsPopup() {}
