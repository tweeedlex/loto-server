import * as impAuth from "./authorization.js";
import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";
import * as impAdminNav from "./admin-navigation.js";
import * as impAudio from "./audio.js";
import * as impLeaders from "./leaders.js";

// export async function openProfilePage() {
//   let main = document.querySelector("main");
//   if (main) {
//     let userInfo = await getProfileInfo();

//     if (userInfo == false) {
//       return;
//     }
//     main.innerHTML = `<div class="main__container">
//     <section class="password-form">
//       <div class="password-form-header">
//         <h3 class="password-form-header__title">Профиль игрока</h3>
//       </div>
//       <div class="password-form-main">
//         <div class="password-form-main__block profile-block">
//           <div class="profile-block__section">
//             <div class="profile-block__item button">
//               <h4>Баланс: <span>${userInfo.balance.toFixed(2)}</span></h4>
//               <div class="topup-balance">+</div>
//             </div>
//           </div>
//           <div class="profile-block__section">
//             <h3 class="profile-block__item title">
//               Информация об аккаунте
//             </h3>
//             <p class="profile-block__item text">
//               Имя: <span class="profile-name">${userInfo.name}</span>
//             </p>
//             <p class="profile-block__item text">
//               Почта: <span class="profile-email">${userInfo.email}</span>
//             </p>
//             <p class="profile-block__item text">
//               Username: <span class="profile-username">${
//                 userInfo.username
//               }</span>
//             </p>
//             <div class="profile-block__item button change-password">
//               <h4>Изменить пароль</h4>
//             </div>
//           </div>
//           <div class="profile-block__section">
//             <h3 class="profile-block__item title">Другое</h3>
//             <div class="profile-block__item button" id="user-game-stats">
//               <h4>Статистика игр</h4>
//             </div>
//             <div class="profile-block__item button">
//               <h4>Транзакции</h4>
//             </div>
//             <div class="profile-block__item button exit logout-button">
//               <h4>Выйти</h4>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   </div>`;
//   }

//   const gameStatsButton = document.querySelector("#user-game-stats");
//   gameStatsButton.addEventListener("click", function () {
//     openUserGames();
//   });

//   const changePasswordButton = document.querySelector(".change-password");
//   changePasswordButton.addEventListener("click", function () {
//     openChangePasswordForm();
//   });

//   let profilePage = document.querySelector(".password-form");
//   let logoutButton = profilePage.querySelector(".logout-button");
//   logoutButton.addEventListener("click", function () {
//     localStorage.removeItem("token");
//     location.reload();
//   });
// }

let preloader = document.querySelector(".page-preloader");

export async function openProfilePage() {
  let main = document.querySelector("main");
  if (main) {
    let userInfo = await getProfileInfo();
    if (userInfo == false) {
      return;
    }
    main.innerHTML = `
      <section class="profile-page">
        <div class="profile-page__header">
          <img src="img/profile.png" alt="user" />
          <h2>${userInfo.username}</h2>
        </div>

        <div class="profile__buttons">
          <a class="profile__button profile__balance-button">
            <img src="img/profile icons/balance.png" alt="balance" />
            <p>БАЛАНС:</p>
            <span class="profile__balance"> <span>${userInfo.balance.toFixed(
              2
            )}</span> ₼ </span>
            <img
              src="img/profile icons/plus.png"
              alt="balance"
              class="curpointer"
            />
          </a>
          <a class="profile__button curpointer">
            <img src="img/profile icons/balance.png" alt="balance" />
            <div class="profile__button-text profile-details">
              <p>ДЕТАЛИ ПРОФИЛЯ</p>
              <span>Персональные данные</span>
            </div>
            <img
              src="img/profile icons/chevron-right.png"
              alt="ДЕТАЛИ ПРОФИЛЯ"
            />
          </a>
          <a class="profile__button curpointer profile__change-password-button">
            <img src="img/profile icons/password.png" alt="balance" />
            <p>СМЕНА ПАРОЛЯ</p>
            <img
              src="img/profile icons/chevron-right.png"
              alt="СМЕНА ПАРОЛЯ"
            />
          </a>
          <a class="profile__button curpointer">
            <img src="img/profile icons/chat.png" alt="balance" />
            <div class="profile__button-text">
              <p>ЧАТ</p>
              <span>Тех. поддержка</span>
            </div>
            <img src="img/profile icons/chevron-right.png" alt="ЧАТ" />
          </a>
          <a class="profile__button curpointer game-history">
            <img src="img/profile icons/games.png" alt="balance" />
            <p>ИГРЫ</p>
            <img src="img/profile icons/chevron-right.png" alt="ИГРЫ" />
          </a>
          <a class="profile__button curpointer user-rating">
            <img src="img/profile icons/games.png" alt="balance" />
            <p>Рейтинг победителей</p>
            <img src="img/profile icons/chevron-right.png" alt="Рейтинг" />
          </a>
          <a class="profile__button">
            <img src="img/profile icons/sound.png" alt="ЗВУК" />
            <p>ЗВУК</p>
            <div class="profile__button-switcher curpointer">
              <button class="profile__button-switcher-on active">ON</button>
              <button class="profile__button-switcher-off">OFF</button>
            </div>
          </a>
        </div>
        <div class="profile-page__footer">
          <button class="logout">
            <p>ВЫЙТИ</p>
            <img src="img/logout.png" alt="logout" />
          </button>
        </div>
      </section>
    `;

    const soundSwitcher = document.querySelector(".profile__button-switcher");
    const soundOn = document.querySelector(".profile__button-switcher-on");
    const soundOff = document.querySelector(".profile__button-switcher-off");

    let menuSoundsAllowed = localStorage.getItem("sounds-menu");
    let gameSoundsAllowed = localStorage.getItem("sounds-game");

    if (menuSoundsAllowed == "true" || gameSoundsAllowed == "true") {
      soundOn.classList.add("active");
      soundOff.classList.remove("active");
    } else {
      soundOn.classList.remove("active");
      soundOff.classList.add("active");
    }

    const toggleSound = () => {
      if (soundOn.classList.contains("active")) {
        soundOn.classList.remove("active");
        soundOff.classList.add("active");
        localStorage.setItem("sounds-game", false);
        localStorage.setItem("sounds-menu", false);
        impAudio.setGameSoundsAllowed(false);
        impAudio.setMenuSoundsAllowed(false);
      } else {
        soundOn.classList.add("active");
        soundOff.classList.remove("active");
        localStorage.setItem("sounds-game", true);
        localStorage.setItem("sounds-menu", true);
        impAudio.setGameSoundsAllowed(true);
        impAudio.setMenuSoundsAllowed(true);
      }
    };

    soundSwitcher.addEventListener("click", () => {
      toggleSound();
    });

    const profileDetailsButton = document.querySelector(".profile-details");
    profileDetailsButton.addEventListener("click", async function () {
      preloader.classList.remove("d-none");
      await openUserDetails();
      preloader.classList.add("d-none");
    });

    const balanceButton = document.querySelector(".profile__balance-button");
    balanceButton.addEventListener("click", async function () {
      preloader.classList.remove("d-none");
      await openBalance();
      preloader.classList.add("d-none");
    });

    const changePasswordButton = document.querySelector(
      ".profile__change-password-button"
    );
    changePasswordButton.addEventListener("click", function () {
      openChangePasswordForm();
    });

    const gameHistoryButton = document.querySelector(".game-history");
    gameHistoryButton.addEventListener("click", async () => {
      preloader.classList.remove("d-none");
      await openUserGames();
      preloader.classList.add("d-none");
    });

    const userRatingButton = document.querySelector(".user-rating");
    userRatingButton.addEventListener("click", () => {
      preloader.classList.remove("d-none");
      location.hash = "#leaders";
      preloader.classList.add("d-none");
    });

    const logoutButton = document.querySelector(".logout");
    logoutButton.addEventListener("click", async function () {
      await impHttp.logout();
      localStorage.setItem("token", "");
      // открываем форму регистрации для анимации
      const registration = document.querySelector(".registration");
      registration.classList.add("opened");
      // и потом у нас перезагружаеться страница
      location.reload();
    });
  }
}

export async function openBalance() {
  const main = document.querySelector("main");
  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  main.innerHTML = `
  <section class="profile-page bg-white deposit">
    <div class="profile-page__header">
      <img src="img/logo-red.png" alt="Luxary games" />
    </div>

    <div class="profile-page__card">
      <p class="profile-page__card-username">${userInfo.username}</p>
      <p class="profile-page__card-balance"><span>11.00</span> ₼</p>
      <div class="profile-page__card-buttons">
        <button class="profile-page__card-button red">ДЕПОЗИТ</button>
        <button class="profile-page__card-button yellow">ВЫПЛАТЫ</button>
      </div>
    </div>
    <div class="profile-page__footer black">
      <button class="go-back go-back-black">
        <p>НАЗАД</p>
        <img src="img/logout-black.png" alt="logout" />
      </button>
    </div>
  </section>
  `;

  const depositButton = document.querySelector(
    ".profile-page__card-button.red"
  );
  depositButton.addEventListener("click", async function () {
    await openDeposit();
  });
  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    location.href = "#profile";
    openProfilePage();
  });
}

async function openDeposit() {
  const main = document.querySelector("main");
  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  main.innerHTML = `
  <section class="profile-page deposit">
    <div class="profile-page__header">
      <img src="img/logo.png" alt="Luxary games" class="logo-deposit" />
    </div>

    <div class="deposit__content">
      <div class="button__credit-cards">
        <div class="button__credit-card">
          <img src="img/AZ-flag.png" alt="AZ" />
          <div class="credit-card__text">
            <p class="bold">Банковские карты</p>
            <p>Азербайджана</p>
          </div>
        </div>
        <div class="button__credit-card">
          <img src="img/ZALUPA-flag.png" alt="AZ" />
          <div class="credit-card__text">
            <p class="bold">Банковские карты</p>
            <p>России</p>
          </div>
        </div>
      </div>

      <div class="deposit__form">
        <h2 class="deposit__form-username">${userInfo.username}</h2>
        <div class="deposit__form-money">
          <h2>СУММА:</h2>
          <div class="deposit__form-content">
            <input class="deposit__form-sum" type="number" />
            <p class="deposit__form-subtitle">
              Манат / Рублей (в зависимости от выбора Карты).
            </p>
          </div>
        </div>
        <button class="deposit__form-button">ВНЕСТИ ДЕПОЗИТ</button>
      </div>
    </div>

    <div class="profile-page__footer">
      <button class="go-back">
        <p>НАЗАД</p>
        <img src="img/logout.png" alt="logout" />
      </button>
    </div>
  </section>
  `;

  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    openBalance();
  });
}

async function openUserDetails() {
  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  const main = document.querySelector("main");
  main.innerHTML = `
  <section class="profile-page">
    <div class="profile-page__header">
      <img src="img/profile.png" alt="user" />
      <p class="profile-page__header-subtitle">Сменить аватар</p>
    </div>
    <div class="profile__buttons">
      <div class="profile-info__form">
        <p>Имя пользователя</p>
        <input
          type="text"
          placeholder="${userInfo.username}"
          class="form-body__input email-input"
        />
        <p>Ваше имя</p>
        <input
          type="text"
          placeholder="${userInfo.name}"
          class="form-body__input password-input"
        />
        <p>Ваша почта</p>
        <input
          type="text"
          placeholder="${userInfo.email}"
          class="form-body__input password-input"
        />
        </div>
        <button class="profile__save">
          Сохранить
        </button>
        <div class="profile__buttons m20">
          <a class="profile__button curpointer">
            <img src="img/profile icons/lang.png" />
            <p>СМЕНИТЬ ЯЗЫК</p>
            <img
              src="img/profile icons/chevron-right.png"
              alt="СМЕНИТЬ ЯЗЫК"
            />
          </a>
          <a class="profile__button curpointer">
            <img src="img/profile icons/dep.png" />
            <p>ТРАНЗАКЦИИ</p>
            <img
              src="img/profile icons/chevron-right.png"
              alt="ТРАНЗАКЦИИ"
            />
          </a>
          
        </div>
        <div class="profile-page__footer">
          <button class="go-back">
            <p>НАЗАД</p>
            <img src="img/logout.png" alt="logout" />
          </button>
        </div>
      </div>
    </div>
  </section>
  `;

  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }

  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    openProfilePage();
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

      mainBlock.insertBefore(gameitem, mainBlock.firstChild);

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
  let main = document.querySelector("main");

  // let profilePage = document.createElement("div");
  // profilePage.classList.add(".password-form");
  main.innerHTML = `
  <div class = 'password-form'>
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
  </div>
  `;

  let profilePage = document.querySelector(".password-form");

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
