import * as impAuth from "./modules/authorization.js";
import * as impLotoNav from "./modules/loto-navigation.js";
import * as impNav from "./modules/navigation.js";
import * as impHttp from "./modules/http.js";
import * as impAdminNav from "./modules/admin-navigation.js";
import * as impMoveElement from "./modules/move-element.js";
let preloader = document.querySelector(".page-preloader");
impAuth.registrationForm();
impAuth.createLoginForm();
// impNav.addHashListeners();

impNav.applyDefaultSettings();

if (await impAuth.isAuth()) {
  location.hash = "";
  impNav.hideAuthorization();

  if (await impAuth.isAdmin()) {
    impAdminNav.createAdminButton();
  }
  let ws = impLotoNav.connectWebsocketFunctions();
  impNav.pageNavigation(ws);
  impNav.addHashListeners(ws);

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

  // const ticketsResponce = await impHttp.getTickets();
  // if (ticketsResponce.status == 200) {
  //   let userTickets = ticketsResponce.data;
  //   if (
  //     userTickets.length > 0 &&
  //     !location.hash.includes("loto-game") &&
  //     !location.hash.includes("loto-room")
  //   ) {
  //     const roomId = userTickets[0].gameLevel;
  //     const isGameStartedRes = await impHttp.isGameStarted(roomId);
  //     if (isGameStartedRes.status == 200) {
  //       let isGameStarted = isGameStartedRes.data;
  //       if (JSON.parse(isGameStarted) == true) {
  //         location.hash = `#loto-game-${roomId}`;
  //       } else {
  //         location.hash = `#loto-room-${roomId}`;
  //       }
  //     } else {
  //       if (!preloader.classList.contains("d-none")) {
  //         preloader.classList.add("d-none");
  //       }
  //     }
  //   } else {
  //     if (!preloader.classList.contains("d-none")) {
  //       preloader.classList.add("d-none");
  //     }
  //   }
  // } else {
  //   if (!preloader.classList.contains("d-none")) {
  //     preloader.classList.add("d-none");
  //   }
  // }
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
