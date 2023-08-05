import * as impHttpRequests from "./http.js";
import * as impInterface from "./authinterface.js";

export function registrationForm() {
  let openFormButtons = document.querySelectorAll(".open-registration");
  let registrationPopup = document.querySelector(".registration");

  openFormButtons.forEach((openRegistration) => {
    openRegistration.addEventListener("click", function () {
      if (openRegistration.classList.contains("registration-button")) {
        createRegistrationForm();
      } else if (openRegistration.classList.contains("login-button")) {
        createLoginForm();
      }

      if (!registrationPopup.classList.contains("opened")) {
        registrationPopup.classList.add("opened");
      }
      if (registrationPopup.classList.contains("opened")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    });
  });

  // form functions
  let formButtons = registrationPopup.querySelectorAll(".form-header__button");
  formButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (button.classList.contains("registration-button")) {
        if (!button.classList.contains("active")) {
          createRegistrationForm();
        }
      } else if (button.classList.contains("login-button")) {
        if (!button.classList.contains("active")) {
          createLoginForm();
        }
      }
    });
  });
}

export function createRegistrationForm() {
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formButtons = form.querySelectorAll(".form-header__button");
  let formBody = form.querySelector(".form-body");
  resetActiveBtn(formButtons);
  let button = form.querySelector(".registration-button");
  button.classList.add("active");
  let indicator = form.querySelector(".form-header__indicator");
  indicator.innerHTML = "";
  let indicatorLine = document.createElement("div");
  indicatorLine.classList.add("indicator-form__line");
  indicatorLine.style.left = "0";
  indicator.appendChild(indicatorLine);
  // clear
  formBody.innerHTML = "";

  // create lines

  let usernameInput = document.createElement("input");
  usernameInput.classList.add("form-body__input", "email-input");
  usernameInput.type = "text";

  usernameInput.placeholder = "Ваш никнейм";

  let emailInput = document.createElement("input");
  emailInput.classList.add("form-body__input", "email-input");
  emailInput.type = "text";

  emailInput.placeholder = "Ваш Email";

  let nameInput = document.createElement("input");
  nameInput.classList.add("form-body__input", "email-input");
  nameInput.type = "text";

  nameInput.placeholder = "Ваше имя";

  let passwordInput = document.createElement("input");
  passwordInput.classList.add("form-body__input", "password-input");
  passwordInput.type = "password";

  passwordInput.placeholder = "Ваш пароль";

  let repeatPasswordInput = document.createElement("input");
  repeatPasswordInput.classList.add("form-body__input", "password-input");
  repeatPasswordInput.type = "password";

  repeatPasswordInput.placeholder = "Повторите пароль";

  let submitButton = document.createElement("a");
  submitButton.classList.add("form-body__button", "registration-button");

  submitButton.innerHTML = "Зарегистрироватся";

  submitButton.addEventListener("click", async function () {
    let email = emailInput.value;
    let password = passwordInput.value;
    let username = usernameInput.value;
    let name = nameInput.value;

    const registerData = {
      username,
      email,
      password,
      name,
    };

    let request = await impHttpRequests.registration(registerData);
    if (request.status == 200) {
      // registrationPopup.classList.remove("opened");
      alert("Аккаунт создан, войдите в него");
      createLoginForm();
    } else {
      // ADD ERROR
    }
  });
  // append

  formBody.appendChild(usernameInput);
  formBody.appendChild(nameInput);
  formBody.appendChild(emailInput);
  formBody.appendChild(passwordInput);
  formBody.appendChild(repeatPasswordInput);
  formBody.appendChild(submitButton);
}

export function createLoginForm() {
  // toggler position
  let registrationPopup = document.querySelector(".registration");
  let form = registrationPopup.querySelector(".registration-form");
  let formButtons = form.querySelectorAll(".form-header__button");
  let formBody = form.querySelector(".form-body");
  resetActiveBtn(formButtons);
  let button = form.querySelector(".login-button");
  button.classList.add("active");
  let indicator = form.querySelector(".form-header__indicator");
  indicator.innerHTML = "";
  let indicatorLine = document.createElement("div");
  indicatorLine.classList.add("indicator-form__line");
  indicatorLine.style.right = "0";
  indicator.appendChild(indicatorLine);
  // clear
  formBody.innerHTML = "";

  // create lines

  let usernameInput = document.createElement("input");
  usernameInput.classList.add("form-body__input", "email-input");
  usernameInput.type = "text";

  usernameInput.placeholder = "Ваш никнейм";

  let passwordInput = document.createElement("input");
  passwordInput.classList.add("form-body__input", "password-input");
  passwordInput.type = "password";

  passwordInput.placeholder = "Ваш пароль";

  let submitButton = document.createElement("a");
  submitButton.classList.add("form-body__button", "registration-button");

  submitButton.innerHTML = "Войти";

  submitButton.addEventListener("click", async function () {
    let username = usernameInput.value;
    let password = passwordInput.value;

    let loginData = {
      username,
      password,
    };
    let request = await impHttpRequests.login(loginData);
    if (request.status == 200) {
      registrationPopup.classList.remove("opened");
      // show auth interface
    } else {
      // ADD ERROR
    }
  });

  formBody.appendChild(usernameInput);
  formBody.appendChild(passwordInput);
  formBody.appendChild(submitButton);
}

export async function isAuth() {
  let response = await impHttpRequests.checkAuth();
  if (response?.status == 200 || response?.statusText == "OK") {
    let registrationPopup = document.querySelector(".registration");
    registrationPopup.classList.remove("opened");
    impInterface.showUserInterface(response.data);
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
