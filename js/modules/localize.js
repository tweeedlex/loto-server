const loadLocalizationFile = async () => {
  const localize = await fetch("./js/modules/localize.json");
  let localizationFile = await localize.json();
  return localizationFile;
};

export async function getCurrentSiteLang() {
  const language = localStorage.getItem("language");
  let localizationFile = await loadLocalizationFile();
  if (!language) {
    localStorage.setItem("language", "ru");
    return localizationFile.ru;
  }
  switch (language) {
    case "ru":
      return localizationFile.ru;
    case "EN":
      return localizationFile.en;
    case "UA":
      return localizationFile.ua;
    case "AZ":
      return localizationFile.az;
    case "TR":
      return localizationFile.tr;
  }
}

export function translateMainPage() {
  let siteLanguage = window.siteLanguage;
  let mainPage = document.querySelector(".games");
  if (mainPage) {
    let timerBlocks = mainPage.querySelectorAll(".timer-block__text");
    let onlineBlocks = mainPage.querySelectorAll(".lobby-room-online p");
    let prevBankBlocks = mainPage.querySelectorAll(".prev-bank p");
    let priceTextBlocks = mainPage.querySelectorAll(".price-text");
    timerBlocks.forEach((timerBlock) => {
      timerBlock.innerHTML = siteLanguage.mainPage.gamecards.timerTextWaiting;
    });
    onlineBlocks.forEach((onlineBlock) => {
      onlineBlock.innerHTML = `${siteLanguage.mainPage.gamecards.onlineText}: <span>0</span>`;
    });
    prevBankBlocks.forEach((prevBankBlock) => {
      prevBankBlock.innerHTML = `${siteLanguage.mainPage.gamecards.bankText}: <span class="game__room-prevbank-sum">0</span> ₼`;
    });
    priceTextBlocks.forEach((priceTextBlock) => {
      priceTextBlock.innerHTML = `${siteLanguage.mainPage.gamecards.priceText}`;
    });
  }
}

export function translateProfilePage() {
  let siteLanguage = window.siteLanguage;
  let profilePage = document.querySelector(".profile-page");
  if (profilePage) {
    let usernameBlock = profilePage.querySelector(".username-label");
    let nameBlock = profilePage.querySelector(".name-label");
    let emailBlock = profilePage.querySelector(".email-label");
    let saveButtonBlock = profilePage.querySelector(".profile__save");
    let changeLangBlock = profilePage.querySelector(".change-language p");
    let transactionsBlock = profilePage.querySelector(".transactions p");
    let goBackBlock = profilePage.querySelector(".go-back p");
    usernameBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.usernameText;
    nameBlock.innerHTML = siteLanguage.profilePage.profileDetailsPage.nameText;
    emailBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.emailText;
    saveButtonBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.saveButtonText;
    changeLangBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.changeLanguageBtnText;
    transactionsBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.transactionsBtnText;
    goBackBlock.innerHTML =
      siteLanguage.profilePage.profileDetailsPage.returnBtnText;
  }
}

export function translateAuthPage() {
  let siteLanguage = window.siteLanguage;
  let authPage = document.querySelector(".registration");
  if (authPage && authPage.classList.contains("opened")) {
    let selectLanguageText = authPage.querySelector(
      ".select-language__text-top"
    );
    selectLanguageText.innerHTML = siteLanguage.authPage.chooseLanguage;

    let selectLanguageTextBottom = authPage.querySelector(
      ".select-language__text span"
    );

    switch (localStorage.getItem("language")) {
      case "ru":
        selectLanguageTextBottom.innerHTML = "Русский";
        break;
      case "EN":
        selectLanguageTextBottom.innerHTML = "English";
        break;
      case "UA":
        selectLanguageTextBottom.innerHTML = "Українська";
        break;
      case "AZ":
        selectLanguageTextBottom.innerHTML = "Azərbaycan";
        break;
      case "TR":
        selectLanguageTextBottom.innerHTML = "Türk";
        break;
    }

    let registration = authPage.querySelector(".form-body-registration");
    if (registration) {
      let regTitle = document.querySelector(".form-header__heading");
      regTitle.innerHTML = siteLanguage.authPage.registration.title;
      let username = registration.querySelector(".username-input");
      username.placeholder = siteLanguage.authPage.registration.usernameText;
      let name = registration.querySelector(".name-input");
      name.placeholder = siteLanguage.authPage.registration.nameText;
      let email = registration.querySelector(".email-input");
      email.placeholder = siteLanguage.authPage.registration.emailText;
      let password = registration.querySelector(".password-input");
      password.placeholder = siteLanguage.authPage.registration.passwordText;
      let repeatPassword = registration.querySelector(".repeat-password-input");
      repeatPassword.placeholder =
        siteLanguage.authPage.registration.repeatPasswordText;
      let age = registration.querySelector(".form-body__checkbox-text.age");
      age.innerHTML = siteLanguage.authPage.registration.ageAccept;

      let pivacyAndTerms = registration.querySelector(
        ".form-body__checkbox-text.terms"
      );
      pivacyAndTerms.innerHTML = ` ${siteLanguage.authPage.registration.termsAccept} <a href="#conditions" target="_blank" class="form-body__link">${siteLanguage.authPage.registration.termsLink}</a> ${siteLanguage.authPage.registration.and} <a href="#privacy-policy" target="_blank" class="form-body__link">${siteLanguage.authPage.registration.privacyLink}</a>.`;

      let registerButton = registration.querySelector(
        ".form-body__button.registration-button"
      );
      registerButton.innerHTML =
        siteLanguage.authPage.registration.registerButtonText;

      let haveAccount = registration.querySelector(".form-body__no-account a");
      haveAccount.innerHTML = siteLanguage.authPage.registration.haveAccount;

      let loginButton = registration.querySelector(".open-login");
      loginButton.innerHTML =
        siteLanguage.authPage.registration.loginButtonText;
    }

    let login = authPage.querySelector(".form-body-login");
    if (login) {
      let title = document.querySelector(".form-header__heading");
      title.innerHTML = siteLanguage.authPage.login.title;

      let usernameLabel = login.querySelector(".username-label");
      usernameLabel.innerHTML = siteLanguage.authPage.login.usernameText;
      let passwordLabel = login.querySelector(".password-label");
      passwordLabel.innerHTML = siteLanguage.authPage.login.passwordText;

      let username = login.querySelector(".username-input");
      username.placeholder = siteLanguage.authPage.login.yourUsername;
      let password = login.querySelector(".password-input");
      password.placeholder = siteLanguage.authPage.login.yourPassword;

      let loginButton = login.querySelector(".login-button");
      loginButton.innerHTML = siteLanguage.authPage.login.loginButtonText;

      let noAccount = login.querySelector(".form-body__no-account a");
      noAccount.innerHTML = siteLanguage.authPage.login.noAccount;

      let registerButton = login.querySelector(".form-body__registration");
      registerButton.innerHTML = siteLanguage.authPage.login.registerButtonText;
    }
  }
}
