import * as impHttpRequests from "./http.js";
import * as impInterface from "./authinterface.js";
import * as impNav from "./navigation.js";
import * as impLotoNav from "./loto-navigation.js";
import * as impAdminNav from "./admin-navigation.js";

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
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formHeaderText = form.querySelector(".form-header__heading");
  formHeaderText.innerHTML = "Регистрация";

  let formBody = form.querySelector(".form-body");

  formBody.innerHTML = `<div class="form-body-registration">
  <input
    type="text"
    placeholder="Имя"
    class="form-body__input name-input"
  />

  <input
    type="text"
    placeholder="username"
    class="form-body__input username-input"
  />

  <input
    type="text"
    placeholder="Ваш email"
    class="form-body__input email-input"
  />

  <input
    type="password"
    placeholder="Ваш пароль"
    class="form-body__input password-input"
  />
  <input
    type="password"
    placeholder="Повтор пароля"
    class="form-body__input repeat-password-input"
  />
  <button class="form-body__button registration-button">
    ЗАРЕГИСТРИРОВАТЬСЯ
  </button>

  <div class="form-body__no-account">
    <a>Есть аккаунт?</a>
    <button class="form-body__registration open-login">
      Войти
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
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formHeaderText = form.querySelector(".form-header__heading");
  formHeaderText.innerHTML = "Авторизация";

  let formBody = form.querySelector(".form-body");

  formBody.innerHTML = `<div class="form-body-login">
  <p>Имя пользователя</p>
  <input
    type="text"
    placeholder="Ваш username"
    class="form-body__input username-input"
  />
  <p>Пароль</p>
  <input
    type="password"
    placeholder="Ваш пароль"
    class="form-body__input password-input"
  />
  <button class="form-body__button login-button">Войти</button>
  <div class="form-body__no-account">
    <a>Нет аккаунта?</a>
    <button class="form-body__registration open-registration">
      Регистрация
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
        impNav.addListeners(ws);
        impNav.pageNavigation(ws);
      }
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
