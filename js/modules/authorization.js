import * as impHttpRequests from "./http.js";
import * as impInterface from "./authinterface.js";
import * as impNav from "./navigation.js";
import * as impLotoNav from "./loto-navigation.js";
import * as impAdminNav from "./admin-navigation.js";
import * as impPopup from "./popup.js";

export function registrationForm() {
  // let openFormButtons = document.querySelectorAll(".open-registration");
  let registrationPopup = document.querySelector(".registration");

  // openFormButtons.forEach((openRegistration) => {
  //   openRegistration.addEventListener("click", function () {
  //     if (openRegistration.classList.contains("registration-button")) {
  //       createRegistrationForm();
  //     } else if (openRegistration.classList.contains("login-button")) {
  //       createLoginForm();
  //     }

  //     if (!registrationPopup.classList.contains("opened")) {
  //       registrationPopup.classList.add("opened");
  //     }
  //     if (registrationPopup.classList.contains("opened")) {
  //       document.body.style.overflow = "hidden";
  //     } else {
  //       document.body.style.overflow = "auto";
  //     }
  //   });
  // });

  // form functions

  let openLoginButton = registrationPopup.querySelector(".open-login");
  if (openLoginButton) {
    openLoginButton.addEventListener("click", function () {
      createLoginForm();
    });
  }

  let openRegistrationButton =
    registrationPopup.querySelector(".open-registration");
  if (openRegistrationButton) {
    openRegistrationButton.addEventListener("click", function () {
      createRegistrationForm();
    });
  }

  const languageSelectButton = document.querySelector(".select-language");
  languageSelectButton.addEventListener("click", function () {
    impPopup.openChangeLanguage();
  });

  // button.addEventListener("click", function () {
  //   if (button.classList.contains("registration-button")) {
  //     if (!button.classList.contains("active")) {
  //       createRegistrationForm();
  //     }
  //   } else if (button.classList.contains("login-button")) {
  //     if (!button.classList.contains("active")) {
  //       createLoginForm();
  //     }
  //   }
  // });
}

export function createRegistrationForm() {
  const siteLanguage = window.siteLanguage;
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formHeaderText = form.querySelector(".form-header__heading");
  formHeaderText.innerHTML = siteLanguage.authPage.registration.title;

  let formBody = form.querySelector(".form-body");

  formBody.innerHTML = `<div class="form-body-registration">
  <input
    type="text"
    placeholder="${siteLanguage.authPage.registration.usernameText}"
    class="form-body__input username-input"
  />

  <input
    type="text"
    placeholder="${siteLanguage.authPage.registration.nameText}"
    class="form-body__input name-input"
  />

  <input
    type="text"
    placeholder="${siteLanguage.authPage.registration.emailText}"
    class="form-body__input email-input"
  />

  <input
    type="password"
    placeholder="${siteLanguage.authPage.registration.passwordText}"
    class="form-body__input password-input"
  />
  <input
    type="password"
    placeholder="${siteLanguage.authPage.registration.repeatPasswordText}"
    class="form-body__input repeat-password-input"
  />

  <label class="registration-label">
    <input
      type="checkbox"
      class="form-body__checkbox"
      id="registration-age-checkbox"
    />
    <span class="form-body__checkbox-text age">
      ${siteLanguage.authPage.registration.ageAccept}
    </span>
  </label>

  <label class="registration-label">
    <input
      type="checkbox"
      class="form-body__checkbox"
      id="registration-terms-checkbox"
    />
    <span class="form-body__checkbox-text terms">
      ${siteLanguage.authPage.registration.termsAccept} <a href="#conditions" target="_blank" class="form-body__link">${siteLanguage.authPage.registration.termsLink}</a> ${siteLanguage.authPage.registration.and} <a href="#privacy-policy" target="_blank" class="form-body__link">${siteLanguage.authPage.registration.privacyLink}</a>.
    </span>
  </label>

  <button class="form-body__button registration-button">
    ${siteLanguage.authPage.registration.registerButtonText}
  </button>

  <div class="form-body__no-account">
    <a>${siteLanguage.authPage.registration.haveAccount}</a>
    <button class="form-body__registration open-login">
      ${siteLanguage.authPage.registration.loginButtonText}
    </button>
  </div>
</div>`;

  let openLoginButton = registrationPopup.querySelector(".open-login");
  if (openLoginButton) {
    openLoginButton.addEventListener("click", function () {
      createLoginForm();
    });
  }

  let submitButton = registrationPopup.querySelector(".registration-button");
  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    let errorBlock = document.querySelector(".auth-form-error");
    errorBlock.innerHTML = "";
    let passwordValue =
      registrationPopup.querySelector(".password-input").value;
    let repeatPasswordValue = registrationPopup.querySelector(
      ".repeat-password-input"
    ).value;

    if (passwordValue != repeatPasswordValue) {
      errorBlock.innerHTML = "Пароли не совпадают";
      return;
    }

    let email = registrationPopup.querySelector(".email-input").value;
    let password = registrationPopup.querySelector(".password-input").value;
    let username = registrationPopup.querySelector(".username-input").value;
    let name = registrationPopup.querySelector(".name-input").value;

    const ageCheckbox = document.querySelector("#registration-age-checkbox");
    const termsCheckbox = document.querySelector(
      "#registration-terms-checkbox"
    );

    if (!ageCheckbox.checked) {
      errorBlock.innerHTML = siteLanguage.popups.confirmAge;
      return;
    }

    if (!termsCheckbox.checked) {
      errorBlock.innerHTML = siteLanguage.popups.confirmTerms;
      return;
    }

    const registerData = {
      username,
      email,
      password,
      name,
    };

    let response = await impHttpRequests.registration(registerData);
    if (response.status == 200) {
      // registrationPopup.classList.remove("opened");
      // alert("Аккаунт создан, войдите в него");
      createLoginForm();
    } else {
      errorBlock.innerHTML = response.data.message;
    }
  });
}

export function createLoginForm() {
  let siteLanguage = window.siteLanguage;
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formHeaderText = form.querySelector(".form-header__heading");
  formHeaderText.innerHTML = siteLanguage.authPage.login.title;

  let formBody = form.querySelector(".form-body");

  formBody.innerHTML = `<div class="form-body-login">
  <p class="username-label">${siteLanguage.authPage.login.usernameText}</p>
  <input
    type="text"
    placeholder="${siteLanguage.authPage.login.yourUsername}"
    class="form-body__input username-input"
  />
  <p class="password-label">${siteLanguage.authPage.login.passwordText}</p>
  <input
    type="password"
    placeholder="${siteLanguage.authPage.login.yourPassword}"
    class="form-body__input password-input"
  />
  <button class="form-body__button login-button">${siteLanguage.authPage.login.loginButtonText}</button>
  <div class="form-body__no-account">
    <a>${siteLanguage.authPage.login.noAccount}</a>
    <button class="form-body__registration open-registration">
      ${siteLanguage.authPage.login.registerButtonText}
    </button>
  </div>
</div>`;

  let openRegistrationButton =
    registrationPopup.querySelector(".open-registration");
  if (openRegistrationButton) {
    openRegistrationButton.addEventListener("click", function () {
      createRegistrationForm();
    });
  }

  let submitButton = registrationPopup.querySelector(".login-button");

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();
    let username = registrationPopup.querySelector(".username-input").value;
    let password = registrationPopup.querySelector(".password-input").value;
    let loginData = {
      username,
      password,
    };
    let response = await impHttpRequests.login(loginData);
    if (response.status == 200) {
      // show auth interface
      registrationPopup.classList.remove("opened");
      impInterface.showUserInterface(response.data.user);
      window.username = response.data.username;
      window.userId = response.data.id;
      if (await isAuth()) {
        let ws = impLotoNav.connectWebsocketFunctions();
        impNav.addHashListeners(ws);
        // impNav.addHashListenersWS(ws);
        impNav.addListeners(ws);
        impNav.pageNavigation(ws);
        // проверка на активные игры в даный момент
        const ticketsResponce = await impHttpRequests.getTickets();
        if (ticketsResponce.status == 200) {
          let preloader = document.querySelector(".page-preloader");
          let userTickets = ticketsResponce.data;
          if (
            userTickets.length > 0 &&
            !location.hash.includes("loto-game") &&
            !location.hash.includes("loto-room")
          ) {
            const roomId = userTickets[0].gameLevel;
            const isGameStartedRes = await impHttpRequests.isGameStarted(
              roomId
            );
            if (isGameStartedRes.status == 200) {
              let isGameStarted = isGameStartedRes.data;
              if (JSON.parse(isGameStarted) == true) {
                location.hash = `#loto-game-${roomId}`;
              } else {
                location.hash = `#loto-room-${roomId}`;
              }
            } else {
              if (!preloader.classList.contains("d-none")) {
                preloader.classList.add("d-none");
              }
            }
          } else {
            if (!preloader.classList.contains("d-none")) {
              preloader.classList.add("d-none");
            }
          }
        } else {
          if (!preloader.classList.contains("d-none")) {
            preloader.classList.add("d-none");
          }
        }
      }
      console.log(response.data.user.isAdmin);
      if (response.data.user.isAdmin) {
        impAdminNav.createAdminButton();
      }
    } else {
      const errorBlock = document.querySelector(".auth-form-error");

      errorBlock.innerHTML = response.data.message;
    }
  });
}

export async function isAdmin() {
  let response = await impHttpRequests.getUser();
  if (response.status == 200) {
    if (response.data.isAdmin == true) {
      return true;
    } else return false;
  }
}

export async function getUser() {
  let response = await impHttpRequests.getUser();
  if (response.status == 200) {
    return response.data;
  } else {
    return false;
  }
}

export async function isAuth() {
  let response = await impHttpRequests.checkAuth();
  if (response?.status == 200 || response?.statusText == "OK") {
    let registrationPopup = document.querySelector(".registration");
    registrationPopup.classList.remove("opened");
    impInterface.showUserInterface(response.data);

    window.username = response.data.username;
    window.userId = response.data.id;

    return true;
  } else {
    return false;
  }
}

function resetActiveBtn(buttonsArr) {
  buttonsArr.forEach((item) => {
    if (item.classList.contains("active")) {
      item.classList.remove("active");
    }
  });
}

// const headerExitButton = document.querySelector(".header__exit");
// headerExitButton.addEventListener("click", async function () {
//   localStorage.removeItem("token");
//   location.reload();
// });
