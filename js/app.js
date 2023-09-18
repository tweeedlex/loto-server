import * as impAuth from "./modules/authorization.js";
import * as impLotoNav from "./modules/loto-navigation.js";
import * as impNav from "./modules/navigation.js";
import * as impHttp from "./modules/http.js";
import * as impAdminNav from "./modules/admin-navigation.js";
import * as impMoveElement from "./modules/move-element.js";
import * as impLocalization from "./modules/localize.js";
import * as impPopup from "./modules/popup.js";
window.ws = null;

let preloader = document.querySelector(".page-preloader");
let siteLanguage = await impLocalization.getCurrentSiteLang();
window.siteLanguage = siteLanguage;
impLocalization.translateMainPage();
impLocalization.translateAuthPage();
console.log(siteLanguage);
impAuth.registrationForm();
impAuth.createLoginForm();

impNav.applyDefaultSettings();

impNav.addUnauthorizedHashListeners();

if (await impAuth.isAuth()) {
  location.hash = "";
  impNav.hideAuthorization();

  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }
  let ws = impLotoNav.connectWebsocketFunctions();
  impNav.pageNavigation(ws);
  impNav.addHashListeners(ws);
  // impNav.addHashListenersWS(ws);

  // проверка на активные игры в даный момент
  const ticketsResponce = await impHttp.getTickets();
  if (ticketsResponce.status == 200) {
    let userTickets = ticketsResponce.data;
    if (userTickets.length == 0) {
      impNav.addListeners(ws);
      preloader.classList.add("d-none");
    } else {
    }
  }
}

// если сайт стал офлайн то показываем окно ошибки

window.addEventListener("offline", (event) => {
  let siteLanguage = window.siteLanguage;
  impPopup.openConnectionErorPopup(
    `${siteLanguage.popups.connectionErrorText}`
  );
});
