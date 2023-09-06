import * as impAuth from "./authorization.js";
import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";
import * as impAdminNav from "./admin-navigation.js";
import * as impAudio from "./audio.js";
import * as impLeaders from "./leaders.js";
import * as impAuthInterface from "./authinterface.js";

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
  let preloader = document.querySelector(".page-preloader");
  let header = document.querySelector("header");
  let main = document.querySelector(".main__container");

  if (main) {
    main.innerHTML = `
      <section class="profile-page">
          <div class="profile-page__header">
            <img src="img/profile.png" alt="user" />
            <h2>user</h2>
          </div>
  
          <div class="profile__buttons">
            <a class="profile__button profile__balance-button">
              <img src="img/profile icons/balance.png" alt="balance" />
              <p>БАЛАНС:</p>
              <span class="profile__balance"> <span>0</span> ₼ </span>
              <img
                src="img/profile icons/plus.png"
                alt="balance"
                class="curpointer"
              />
            </a>
            <a class="profile__button curpointer">
              <img src="img/profile icons/profile.png" alt="balance" />
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
           
            <a class="profile__button curpointer game-history">
              <img src="img/profile icons/games.png" alt="balance" />
              <p>МОИ ИГРЫ</p>
              <img src="img/profile icons/chevron-right.png" alt="ИГРЫ" />
            </a>
            <a class="profile__button curpointer user-bonuses">
              <img src="img/profile icons/balance.png" alt="БОНУСЫ" />
              <p>БОНУСЫ</p>
              <img src="img/profile icons/chevron-right.png" alt="БОНУСЫ" />
            </a>
            <a class="profile__button">
              <img src="img/profile icons/sound.png" alt="ЗВУК" />
              <p>ЗВУК</p>
              <div class="profile__button-switcher curpointer">
                <button class="profile__button-switcher-on active">ON</button>
                <button class="profile__button-switcher-off">OFF</button>
              </div>
            </a> 
            <a class="profile__button  user-cask-color">
              <div class="text-block">Цвет боченков</div>
              <div class="casks-block">
              <div color="default" color-code="#F6BA9E" class="setting-cask default"></div>

                <div
                  color="red"
                  color-code="#FF5F5F"
                  class="setting-cask red "
                ></div>
                <div color="purple" color-code="#C870FF" class="setting-cask purple"></div>
              </div>
            </a>
            ${
              (await impAuth.isAdmin())
                ? `
                <a class="profile__button payments">
                  <img src="img/profile icons/balance.png" />
                  <p>ВЫПЛАТЫ</p>
                  <img
                    src="img/profile icons/chevron-right.png"
                    alt="ВЫПЛАТЫ"
                  />
                </a>                
                
                <a class="profile__button admin">
                  <img src="img/profile icons/profile.png" />
                  <p>АДМИН-ПАНЕЛЬ</p>
                  <img
                    src="img/profile icons/chevron-right.png"
                    alt="АДМИН-ПАНЕЛЬ"
                  />
                </a>
                `
                : ``
            }
          </div>
          <div class="profile-page__footer">
            <button class="logout">
              <p>ВЫЙТИ</p>
              <img src="img/logout.png" alt="logout" />
            </button>
          </div>
        </section>
    `;

    // убираем хедер

    header.classList.add("d-none");
    main.classList.remove("header__padding");

    // добавляем навигацию сайта
    let footer = document.querySelector("#footer");
    if (footer && footer.classList.contains("d-none")) {
      footer.classList.remove("d-none");
      main.classList.add("footer__padding");
    }
    let userInfo = await getProfileInfo();
    if (userInfo == false) {
      location.hash = "#";
      return;
    }
    if (!preloader.classList.contains("d-none")) {
      preloader.classList.add("d-none");
    }

    // кнопка изменения цвета
    const localCaskColor = localStorage.getItem("cask-color");
    const colors = document.querySelectorAll(".casks-block .setting-cask");
    colors.forEach((color) => {
      color.classList.remove("active");

      if (color.getAttribute("color") == localCaskColor) {
        color.classList.add("active");
      }
    });

    colors.forEach((color) => {
      color.addEventListener("click", () => {
        colors.forEach((color) => color.classList.remove("active"));
        color.classList.add("active");
        localStorage.setItem(
          "cask-color-code",
          color.getAttribute("color-code")
        );
        localStorage.setItem("cask-color", color.getAttribute("color"));
      });
    });

    // ставим active для кнопки с цветом из localstorage
    const caskColor = localStorage.getItem("cask-color");
    const caskColorCode = localStorage.getItem("cask-color-code");
    if (caskColor && caskColorCode) {
      const cask = document.querySelector(`.setting-cask[color=${caskColor}]`);
      if (cask) {
        cask.classList.add("active");
      }
    }

    // вставляем ник и баланс
    let profilePage = document.querySelector(".profile-page");
    let usernameBlock = profilePage.querySelector(".profile-page__header h2");
    usernameBlock.innerHTML = userInfo.username;

    let usernameBalance = profilePage.querySelector(".profile__balance span");
    usernameBalance.innerHTML = userInfo.balance.toFixed(2);

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
      // убираем навигацию сайта
      let footer = document.querySelector("#footer");
      if (footer && !footer.classList.contains("d-none")) {
        footer.classList.add("d-none");
        main.classList.remove("footer__padding");
      }
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
      // убираем навигацию сайта
      let footer = document.querySelector("#footer");
      if (footer && !footer.classList.contains("d-none")) {
        footer.classList.add("d-none");
        main.classList.remove("footer__padding");
      }
    });

    const gameHistoryButton = document.querySelector(".game-history");
    gameHistoryButton.addEventListener("click", async () => {
      preloader.classList.remove("d-none");
      await openUserGames();
      preloader.classList.add("d-none");
    });

    // const userRatingButton = document.querySelector(".user-rating");
    // userRatingButton.addEventListener("click", () => {
    //   preloader.classList.remove("d-none");
    //   location.hash = "#leaders";
    //   preloader.classList.add("d-none");
    // });

    const bonusesButton = document.querySelector(".user-bonuses");
    bonusesButton.addEventListener("click", async () => {
      await openUserBonuses();
      // убираем навигацию сайта
      let footer = document.querySelector("#footer");
      if (footer && !footer.classList.contains("d-none")) {
        footer.classList.add("d-none");
        main.classList.remove("footer__padding");
      }
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

    // payments
    const paymentsButton = document.querySelector(".payments");
    if (paymentsButton) {
      paymentsButton.addEventListener("click", async () => {
        openPayments();
      });
    }

    // admin
    const adminButton = document.querySelector(".profile__button.admin");
    if (adminButton) {
      adminButton.addEventListener("click", async () => {
        await impAdminNav.redirectToAdminPage();
      });
    }
  }
}

export async function openBalance() {
  const main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  let footer = document.querySelector("#footer");

  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  if (!header.classList.contains("d-none")) {
    header.classList.add("d-none");
    main.classList.remove("header__padding");
  }
  // удаляем навигацию сайта
  if (footer && !footer.classList.contains("d-none")) {
    footer.classList.add("d-none");
    main.classList.remove("footer__padding");
  }
  main.innerHTML = `
  <section class="profile-page bg-white deposit">
    <div class="profile-page__header">
      <img src="img/logo-red.png" alt="Luxary games" />
    </div>

    <div class="profile-page__card">
      <p class="profile-page__card-username">${userInfo.username}</p>
      <p class="profile-page__card-balance"><span>${userInfo.balance.toFixed(
        2
      )}</span> ₼</p>
      <div class="profile-page__card-buttons">
        <button style="font-size: 18px;" class="profile-page__card-button deposit red">ДЕПОЗИТ</button>
        <button style="font-size: 18px;" class="profile-page__card-button withdraw yellow">ВЫПЛАТЫ</button>
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
    ".profile-page__card-button.deposit"
  );
  depositButton.addEventListener("click", async function () {
    await openDeposit();
  });

  const withdrawButton = document.querySelector(
    ".profile-page__card-button.withdraw"
  );
  withdrawButton.addEventListener("click", async function () {
    await openWithdraw();
  });
  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    location.hash = "#profile";
    // openProfilePage();
  });
}

async function openDeposit() {
  const main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  main.classList.remove("footer__padding");
  main.innerHTML = `
  <section class="profile-page deposit">
    <div class="deposit__content">
      <div class="button__credit-cards">
        <div class="button__credit-card">
          <img src="img/visa-mastercard.png" alt="cards" />
          <div class="credit-card__text">
            Принимаем все карты, в том числе Apple Pay, Google Pay через Stripe
          </div>
        </div>
      </div>

      <div class="deposit__form">
        <h2 class="deposit__form-username">${userInfo.username}</h2>
        <div class="deposit__form-money">
          <h2>СУММА:</h2>
          <div class="deposit__form-content">
            <input class="deposit__form-sum" placeholder="0" type="number" />
            <span>₼</span>
            <div class="deposit__form-ready-sums">
              <button class="deposit__form-ready-sum">
                5
              </button>
              <button class="deposit__form-ready-sum">
                25
              </button>
              <button class="deposit__form-ready-sum">
                50
              </button>
              <button class="deposit__form-ready-sum">
                100
              </button>
              <button class="deposit__form-ready-sum">
                250
              </button>
            </div>
          </div>
        </div>
        <div class="deposit__form-wrapper">
        <p class="deposit__form-minimum">Минимальный: 2.00$</p>
        <button class="deposit__form-button">ВНЕСТИ ДЕПОЗИТ<span style="margin-left: 7px; font-weight: 600;">0$</span></button>
        </div>
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

  const currencyRate = await impHttp.getCurrencyRate();
  console.log(currencyRate.data.rate);
  const dollarRate = currencyRate.data.rate || 1.705;

  const sumInput = document.querySelector(".deposit__form-sum");

  const readySumButtons = document.querySelectorAll(".deposit__form-ready-sum");

  readySumButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sumInput = document.querySelector(".deposit__form-sum");
      sumInput.value = button.innerText;
      dollarsSum.innerHTML = (+button.innerText / +dollarRate).toFixed(2) + "$";
    });
  });

  const dollarsSum = document.querySelector(".deposit__form-button span");

  sumInput.addEventListener("input", () => {
    dollarsSum.innerHTML = (+sumInput.value / +dollarRate).toFixed(2) + "$";
  });

  const depositButton = document.querySelector(".deposit__form-button");
  depositButton.addEventListener("click", async function () {
    const sumInput = document.querySelector(".deposit__form-sum");
    const sum = parseFloat(sumInput.value);
    if (isNaN(sum)) {
      impPopup.open("Введите сумму");
      return;
    }
    if (+dollarsSum.innerHTML < 2) {
      impPopup.open("Минимальная сумма 2.00₼");
      return;
    }
    const result = await impHttp.deposit(sum);
    if (result.status == 200) {
      impPopup.open("Депозит успешно зачислен");
      impAuthInterface.updateBalance(result.data.balance);
      location.hash = "#profile";
    } else {
      impPopup.open("Ошибка");
    }
  });
  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    openBalance();
  });
}

async function openWithdraw() {
  const main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  main.innerHTML = `
  <section class="withdraw-page withdraw">
    <div class="withdraw-page__container">
      <div class="withdraw-page_form withdraw-form">
          <div class="withdraw-form__item"><label for="withdraw-form-card-number">Номер карты</label><input id="withdraw-form-cart-number" type="number"></div>
          <div class="withdraw-form__item"><label for="withdraw-form-card-name">Имя владельца</label><input id="withdraw-form-cart-name" type="text"></div>
          <div class="withdraw-form__item row"><label>Дата окончания срока</label><div class="date-input"><input placeholder="ММ" id="withdraw-form-cart-mounth" type="number"> / <input placeholder="ГГ" id="withdraw-form-cart-year"  type="number"></div> </div>
          <div class="withdraw-form__item"><label for="withdraw-form-sum">Сумма </label><input id="withdraw-form-sum" type="number"></div>
          <button class="withdraw-form__item-button">Выплата</button>

          <button class="go-back">
            <p>НАЗАД</p>
            <img src="img/logout.png" alt="logout" />
          </button>
        </div>
        
        <div class="withdraw-page__footer">
          
        </div>
    </div>
  </section>
  `;

  const goBackButton = document.querySelector(".withdraw-page .go-back");
  goBackButton.addEventListener("click", function () {
    openBalance();
  });

  let withdrawButton = document.querySelector(
    ".withdraw-page .withdraw-form__item-button"
  );
  withdrawButton.addEventListener("click", async function () {
    const withdrawInput = document.querySelector("#withdraw-form-sum");
    let withdrawAmount = withdrawInput.value;

    let errorsCounter = 0;
    // сбрасываем ошибки
    let errors = document.querySelectorAll(".withdraw-page .error");
    errors.forEach((error) => {
      error.classList.remove("error");
    });

    // парсим номер карты
    let cardNumber = document.querySelector(
      ".withdraw-page #withdraw-form-cart-number"
    );
    let cardNumberValue = cardNumber.value;

    if (!/^\d{13,16}$/.test(cardNumberValue)) {
      cardNumber.classList.add("error");
      errorsCounter++;
    }
    // парсим имя владельца на латинеце
    let cardName = document.querySelector(
      ".withdraw-page #withdraw-form-cart-name"
    );
    let cardNameValue = cardName.value;
    if (!/^[a-zA-Z]+$/.test(cardNameValue)) {
      cardName.classList.add("error");
      errorsCounter++;
    }

    // Проверка, что имя не пустое и не слишком короткое
    if (cardNameValue.length < 2) {
      cardName.classList.add("error");
      errorsCounter++;
    }

    // проверка мм\гг
    let cardDateBlock = document.querySelector(".withdraw-page .date-input");
    let cardMM = document.querySelector(
      ".withdraw-page #withdraw-form-cart-mounth"
    );
    let cardMMValue = cardMM.value;
    let cardYY = document.querySelector(
      ".withdraw-page #withdraw-form-cart-year"
    );
    let cardYYValue = cardYY.value;
    // if (cardMMValue.length > 99 || cardYYValue.length > 99) {
    //   cardDateBlock.classList.add("error");
    // }
    // if (cardMMValue.length < 1 || cardYYValue.length < 1) {
    //   cardDateBlock.classList.add("error");
    // }
    if (
      cardMMValue > 12 ||
      cardYYValue < 23 ||
      cardMMValue > 12 ||
      cardYYValue > 99 ||
      cardMMValue.length < 1 ||
      cardYYValue.length < 1 ||
      cardMMValue.length > 2 ||
      cardYYValue.length > 2
    ) {
      cardDateBlock.classList.add("error");
      errorsCounter++;
    }
    // withdrawAmount,
    // cardNumber,
    // cardHolder,
    // validity,
    if (withdrawAmount == "" || withdrawAmount == null || withdrawAmount == 0) {
      errorsCounter++;
    }

    if (errorsCounter == 0) {
      let response = await impHttp.createPayout(
        withdrawAmount,
        cardNumberValue,
        cardNameValue,
        `${cardMMValue}/${cardYYValue}`
      );
      if (response.data.message == "ERR_NOT_ENOUGH_BALANCE") {
        impPopup.openErorPopup("Недостаточно денег");
        return;
      }

      if (response.status == 200) {
        impPopup.open(
          "Ваша заявка принята на выплату! В течение 3 рабочих дней вы получите свой выегрышь."
        );

        cardName.value = "";
        cardYY.value = "";
        cardMM.value = "";
        cardNumber.value = "";
        withdrawInput.value = "";
      }
    } else {
      impPopup.openErorPopup("Ошибка! Проверьте введенные данные");
    }
  });
}

async function openUserDetails() {
  let userInfo = await getProfileInfo();
  if (userInfo == false) {
    return;
  }
  const main = document.querySelector(".main__container");
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
          <a class="profile__button curpointer transactions">
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

  const transactionsButtons = document.querySelector(".transactions");
  transactionsButtons.addEventListener("click", async () => {
    await openTransactions();
  });

  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }

  const goBackButton = document.querySelector(".go-back");
  goBackButton.addEventListener("click", function () {
    openProfilePage();
  });
}

async function openUserGames() {
  let main = document.querySelector(".main__container");
  if (main) {
    const userGames = await impHttp.getUserGames();

    main.innerHTML = `
      <div class="main__container">
        <section class="user-game-history">
          <div class="pader user-game-history-header">
            <div class="user-game-history-header__back">
              <p>ВЫЙТИ</p>
              <img src="img/logout.png" alt="logout" /></div>
            <h3 class="user-game-history-header__title">Моя статистика</h3>
          </div>
          <div class="user-game-history__main-wrapper">            
          
          <div class="user-game-history__main">            
          </div>
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
        `${game.isWinner ? "won" : "lose"}`,
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
          Сума выигрыша: <span>${game.winSum.toFixed(2)}</span> ₼
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
          )}</span> ₼
        </div>
        <div class="game-item__row game-item__bet">
          Ставка: <span class="game-item__bet-sum">${(
            game.bet * game.tickets.length
          ).toFixed(2)}</span> ₼
        </div>
        <div class="game-item__row game-item__bank">
          Общий банк: <span class="game-item__bank-sum">${game.bank.toFixed(
            2
          )}</span> ₼
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

      // убираем навигацию сайта
      let footer = document.querySelector("#footer");
      if (footer && !footer.classList.contains("d-none")) {
        footer.classList.add("d-none");
        main.classList.remove("footer__padding");
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

async function openUserBonuses() {
  let main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  main.innerHTML = `
  <div class="change-tokens-page">
  
  <div class="change-tokens-page__container">
    <div class="change-tokens-page-form">
      <div class="change-tokens-page-form__title">
        Ваш баланс <span>0</span> поинтов
      </div>
      <div class="change-tokens-page-form__info">
        Коефициент обмена 100 / 0.20₼
      </div>
      <div class="change-tokens-page-form__block">
        <div class="change-tokens-page-form__block-row">
          <p>Поинтов для обмена</p>
          <input type="number" />
        </div>
        <div class="change-tokens-page-form__block-row">
          <div class="get-sum-block">  <p>Вы получите:</p>
            <span>0 ₼</span></div>
        
        <button class="change-tokens-page-form__block-button">Обмен</button>

        </div>
      </div>
      <div class="change-tokens-page-form__alert-text">Обмен осуществляется минимально от 100 поинтов</div>
      <button class="change-tokens-page__exit-button"> 
        <p>ВЫЙТИ</p>
        <img src="img/logout.png" alt="logout" /> 
      </button>
    </div>
    <div class="change-tokens-page-description">За каждую сыгранную игру вы получаете бонусные очки, бонусные очки это ваш кэшбэк которых можно обменять на реальные деньги</div>
  </div>
</div>
  `;

  const exitButton = document.querySelector(".change-tokens-page__exit-button");
  exitButton.addEventListener("click", function () {
    openProfilePage();
  });

  const input = document.querySelector(".change-tokens-page-form__block input");
  const balanceSpan = document.querySelector(
    ".change-tokens-page-form__title span"
  );

  const stats = await impHttp.getUserStats();

  if (stats.status == 200) {
    const balance = stats.data.lotoTokensBalance;

    balanceSpan.innerHTML = balance.toFixed(2);
  }

  const result = document.querySelector(
    ".change-tokens-page-form__block-row span"
  );

  input.addEventListener("input", (e) => {
    const value = e.target.value;

    let addedBalance = 0;
    addedBalance += Math.floor(value / 100) / 5;
    const remainder = value % 100;

    if (remainder >= 1 && remainder < 10) {
      addedBalance += 0.02;
    } else if (remainder >= 10 && remainder <= 20) {
      addedBalance += 0.04;
    } else if (remainder > 20 && remainder <= 30) {
      addedBalance += 0.05;
    } else if (remainder > 30 && remainder <= 40) {
      addedBalance += 0.06;
    } else if (remainder > 40 && remainder <= 50) {
      addedBalance += 0.1;
    } else if (remainder > 50 && remainder <= 60) {
      addedBalance += 0.13;
    } else if (remainder > 60 && remainder <= 70) {
      addedBalance += 0.14;
    } else if (remainder > 70 && remainder <= 80) {
      addedBalance += 0.15;
    } else if (remainder > 80 && remainder < 100) {
      addedBalance += 0.17;
    }

    result.innerHTML = `${addedBalance.toFixed(2)} ₼`;
  });

  const exhangeButton = document.querySelector(
    ".change-tokens-page-form__block-button"
  );

  exhangeButton.addEventListener("click", async () => {
    const tokens = input.value;

    if (tokens < 100) {
      impPopup.openErorPopup("Минимальная сумма обмена 100 поинтов");
      return;
    }

    // if (tokens > balance) {
    //   impPopup.openErorPopup("Недостаточно поинтов для обмена");
    // }

    const response = await impHttp.exchangeTokens(tokens);

    if (response.data.message == "ERR_NOT_ENOUGH_TOKENS") {
      impPopup.openErorPopup("Недостаточно поинтов для обмена");
      return;
    } else if (response.data.message == "ERR_LESS_100") {
      impPopup.openErorPopup("Минимальная сумма обмена 100 поинтов");
      return;
    }

    impPopup.open("Поинты успешно обменены", 200);

    impAuthInterface.updateBalance(response.data.balance);

    const stats = await impHttp.getUserStats();
    if (stats.status == 200) {
      const balance = stats.data.lotoTokensBalance;

      balanceSpan.innerHTML = balance.toFixed(2);
    }
  });
}

export function openChangePasswordForm() {
  let main = document.querySelector(".main__container");

  // let profilePage = document.createElement("div");
  // profilePage.classList.add(".password-form");
  main.innerHTML = `
  <div class = 'password-form'>
  <div class="password-form-main">
    <div class="password-form-main__block profile-block">
      <div class="password-form-block__section">
        <div class="password-form-block__item">
          <label for="old-password">Старый пароль</label>
          <input type="password" id="old-password" class=""> 
        </div>
        <div class="password-form-block__item">
          <label for="new-password">Новый пароль</label>
          <input type="password" id="new-password" class="">
        </div>
        <div class="password-form-block__item">
          <label for="new-password-repeat">Повторите новый пароль</label>
          <input type="password" id="new-password-repeat" class="">
        </div>
        <div class="password-form-block__item password-button change-password">
          <h4>Изменить пароль</h4>
        </div>

        <div class="password-form-block__exit-button">
          <p>НАЗАД</p>
          <img src="img/logout.png" alt="logout" />
        </div>
      </div>
    </div>
  </div>
  </div>
  `;

  let profilePage = document.querySelector(".password-form");

  // выйти назад в профиль
  let buttonBack = document.querySelector(".password-form-block__exit-button");
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

async function openPayments() {
  const main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  main.innerHTML = `
  <section class="admin-withdraw-page admin-withdraw">
    <div class="admin-withdraw__content">
      <div class="admin-withdraw__table">
        <div class="admin-withdraw-table__header table-header">
          <div class="table-header__item">Ник</div>
          <div class="table-header__item">Игры</div>
          <div class="table-header__item">Пополнял</div>
          <div class="table-header__item">Вывод</div>
          <div class="table-header__item">Карта</div>
          <div class="table-header__item">Получатель</div>
          <div class="table-header__item">Срок действия</div>
        </div>
        <div class="admin-withdraw-table__body table-body">
          
        </div>
      </div>
      <button class = 'admin-withdraw-submit-button'>сохранить</button>
    </div>
  </section>
  `;

  const submitButton = document.querySelector(".admin-withdraw-submit-button");
  submitButton.addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(".item-card-checked");

    const payouts = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        payouts.push(+checkbox.getAttribute("payoutId"));
      }
    });

    // disable checkboxes
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.disabled = true;
      }
    });

    const result = await impHttp.checkPayouts(payouts);
    if (result.status == 200) {
      impPopup.open("Выплаты успешно подтверждены");
    } else {
      impPopup.openErorPopup("Ошибка при подтверждении выплат");
    }
  });

  const { data: payments } = await impHttp.getPayouts();

  const tableBody = document.querySelector(".table-body");

  payments.forEach((user) => {
    user.payouts.forEach((payout) => {
      const paymentItem = document.createElement("div");
      paymentItem.classList.add("table-body__item", "user-withdraw-item");
      if (payout.checked) {
        paymentItem.classList.add("accepted");
      }
      console.log(typeof payout.checked, payout.checked);
      paymentItem.innerHTML = `
        <div class="user-withdraw-item__item item-username">${user.username}</div>
        <div class="user-withdraw-item__item item-games">${user.stat.gameLotoPlayed}</div>
        <div class="user-withdraw-item__item item-topup">${user.stat.deposited}</div>
        <div class="user-withdraw-item__item item-withdraw">${payout.withdrawAmount}</div>
        <div class="user-withdraw-item__item item-card">${payout.cardNumber}</div>
        <div class="user-withdraw-item__item item-card-name">${payout.cardHolder}</div>
        <div class="user-withdraw-item__item item-card-date">${payout.validity}</div>
        <input class="user-withdraw-item__item item-card-checked" type="checkbox" name="" payoutId=${payout.id} id="">
      `;

      tableBody.appendChild(paymentItem);

      let flag = paymentItem.querySelector(".item-card-checked");

      flag.addEventListener("input", (e) => {
        if (flag.checked) {
          paymentItem.classList.add("accepted");
        } else {
          paymentItem.classList.remove("accepted");
        }
      });

      if (payout.checked) {
        flag.checked = true;
        flag.disabled = true;
      } else {
        flag.checked = false;
      }
    });
  });
}

async function openTransactions() {
  const main = document.querySelector(".main__container");
  let header = document.querySelector("header");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  main.innerHTML = `
    <section class="transactions-page">
      <div class="transactions__content">
        <div class="transactions__table">
          <div class="transactions-table__header">
            <div class="table-header__item">Ник</div>
            <div class="table-header__item">Тип</div>
            <div class="table-header__item">Сумма</div>
            <div class="table-header__item">Дата</div>
          </div>
          <div class="transactions-table__body">
          </div>
        </div>
      </div>
    </section>
  `;

  const { data: users } = await impHttp.getPayouts();
  console.log(users[0]);
  let transactions = [];
  const userId = window.userId;
  users.forEach((user) => {
    if (user.id == userId) {
      user?.payouts.forEach((payout) => {
        transactions.push({
          username: user.username,
          type: "Вывод",
          sum: payout.withdrawAmount,
          date: new Date(payout.createdAt).toLocaleString("ru-RU"),
        });
      });
      user?.deposits.forEach((deposit) => {
        transactions.push({
          username: user.username,
          type: "Депозит",
          sum: deposit.depositAmount,
          date: new Date(deposit.createdAt).toLocaleString("ru-RU"),
        });
      });
    }
  });

  // sort transactions by date
  transactions.sort((a, b) => {
    return Date.parse(b.date) - Date.parse(a.date);
  });

  transactions.forEach((transaction) => {
    const payoutItem = document.createElement("div");
    payoutItem.classList.add("transactions-table__item");
    payoutItem.innerHTML = `
    <p>${transaction.username}</p>
    <p>${transaction.type}</p>
    <p>${transaction.sum}</p>
    <p>${transaction.date}</p>
  `;
    const tableBody = document.querySelector(".transactions-table__body");
    tableBody.appendChild(payoutItem);
  });
}

async function getProfileInfo() {
  let userInfo = await impAuth.getUser();
  return userInfo;
}

export function openUserStatsPopup() {}
