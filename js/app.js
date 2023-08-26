import * as impAuth from "./modules/authorization.js";
import * as impLotoNav from "./modules/loto-navigation.js";
import * as impNav from "./modules/navigation.js";
import * as impAdminNav from "./modules/admin-navigation.js";
impAuth.registrationForm();
impAuth.createLoginForm();
impNav.addHashListeners();

if (await impAuth.isAuth()) {
  location.hash = "";
  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }
  let ws = impLotoNav.connectWebsocketFunctions();
  impNav.pageNavigation(ws);
  impNav.addListeners(ws);
}
