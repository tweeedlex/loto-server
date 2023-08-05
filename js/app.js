import * as impAuth from "./modules/authorization.js";
import * as impLoto from "./modules/navigation.js";
import * as impHttp from "./modules/http.js";
impAuth.registrationForm();
impAuth.createLoginForm();

if (impAuth.isAuth()) {
  impHttp.clearAllConnectons();
  impLoto.lotoNavigation();
  // impLoto.showGeneralLotoOnline();
}
