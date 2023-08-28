import * as impAuth from "./modules/authorization.js";
import * as impLotoNav from "./modules/loto-navigation.js";
import * as impNav from "./modules/navigation.js";
import * as impAdminNav from "./modules/admin-navigation.js";
import * as impMoveElement from "./modules/move-element.js";
impAuth.registrationForm();
impAuth.createLoginForm();
impNav.addHashListeners();

if (await impAuth.isAuth()) {
  location.hash = "";
  impNav.hideAuthorization();
  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }
  let ws = impLotoNav.connectWebsocketFunctions();
  impNav.pageNavigation(ws);
  impNav.addListeners(ws);
}

// window.addEventListener("beforeunload", async function (e) {
//   e.preventDefault();
//   e.returnValue = ""; // Некоторые браузеры требуют присвоения значения
//   // alert("fdsfdssdfds");

//   // const { data: userTickets } = await impHttp.getTickets();
//   // console.log(userTickets);
//   // if (userTickets.length > 0) {
//   //   const roomId = userTickets[0].gameLevel;
//   //   console.log(roomId, typeof roomId);
//   //   location.hash = `#loto-room-${roomId}`;
//   // }
//   return;
// });
