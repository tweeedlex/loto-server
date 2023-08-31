import * as impHttp from "./http.js";
import * as impPopup from "./popup.js";

export function createAdminButton() {
  // // create button in header
  // const headerBlock = document.querySelector(".header__user");
  // const adminButton = document.createElement("button");
  // adminButton.classList.add("admin-button");
  // adminButton.textContent = "Admin";
  // headerBlock.appendChild(adminButton);
  // adminButton.addEventListener("click", () => {
  //   redirectToAdminPage();
  // });

  // create button in profile
  const profilePage = document.querySelector(".profile-page");
  if (profilePage) {
    const profileButtons = profilePage.querySelector(".profile__buttons.m20");
    const exitButton = profilePage.querySelector(".profile-page__footer");
    const adminButton = document.createElement("a");
    adminButton.classList.add("profile__button", "curpointer");
    adminButton.innerHTML = ` <img src="img/profile icons/profile.png" />
    <p>АДМИН-ПАНЕЛЬ</p>
    <img
      src="img/profile icons/chevron-right.png"
      alt="АДМИН-ПАНЕЛЬ"
    />`;

    profileButtons.appendChild(adminButton);
    adminButton.addEventListener("click", () => {
      redirectToAdminPage();
    });
  }
}

function addAdminFunctions() {
  const rooms = document.querySelectorAll(".admin-room");

  rooms.forEach((room) => {
    const botFlag = room.querySelector(".botFlag");
    const botCountInput = room.querySelector(".botCount");
    const ticketCountInput = room.querySelector(".ticketCount");
    const winChanceInput = room.querySelector(".winChance");
    const addBotBtn = room.querySelector(".addBotBtn");
    const roomId = room.getAttribute("roomId");

    if (botFlag.checked == false) {
      botCountInput.disabled = true;
      ticketCountInput.disabled = true;
      winChanceInput.disabled = true;
    }

    addBotBtn.addEventListener("click", () => {
      const botCountInput = room.querySelector(".botCount");
      const ticketCountInput = room.querySelector(".ticketCount");
      const winChanceInput = room.querySelector(".winChance");
      const roomId = room.getAttribute("roomId");
      // validation

      if (
        botCountInput.value < 0 ||
        ticketCountInput.value < 1 ||
        ticketCountInput.value > 6 ||
        winChanceInput.value < 1 ||
        winChanceInput.value > 100
      ) {
        // show popup
        impPopup.open("Ошибка. Введены некорректные данные", 400);
        return;
      }

      setAdminSettings(roomId);
    });

    botFlag.addEventListener("change", function () {
      const isChecked = botFlag.checked;

      botCountInput.disabled = !isChecked;
      ticketCountInput.disabled = !isChecked;
      winChanceInput.disabled = !isChecked;

      room.style.backgroundColor = isChecked ? "white" : "#f7f7f7";
    });
  });
}

async function redirectToAdminPage() {
  let header = document.querySelector("header");
  let main = document.querySelector("main");
  const footer = document.querySelector("footer");
  footer.classList.add("d-none");
  if (header.classList.contains("d-none")) {
    header.classList.remove("d-none");
    main.classList.add("header__padding");
  }
  let isCurrGamePage = document.querySelector(".loto-game-room-page");
  let isCurrLobbyPage = document.querySelector(".loto-room-page");

  // check if there is game in progress

  if (isCurrGamePage || isCurrLobbyPage) {
    impPopup.open("Нельзя перейти в админку во время игры", 400);
    return;
  }

  let lotoLeaders = await impHttp.getBotStats("loto");
  let showData = [];
  if (lotoLeaders.status == 200) {
    showData = lotoLeaders.data;
  } else {
    showData = [
      {
        moneyLost: 0,
        moneyWon: 0,
      },
    ];
  }

  let botWinStats = await impHttp.getAdminBotWins();
  let showbotWinStats = { room1: 0, room2: 0, room3: 0, room4: 0, room5: 0 };
  if (botWinStats.status == 200) {
    showbotWinStats = JSON.parse(botWinStats.data);
  }

  main.innerHTML = `
    <section class="admin">
      <div class="admin-room" roomId = "1">
        <div class="bot-stats">
          <h2>Статистика ботов</h2>
          <p>Денег выиграно: <span id="moneyLotoWon">${showData[0].moneyWon}</span></p>
          <p>Денег проиграно: <span id="moneyLotoLost">${showData[0].moneyLost}</span></p>
          <table>
            <tr>
              <th>Комната</th>
              <th>Количество побед</th>
            </tr>
            <tr>
              <td>Комната 1</td>
              <td>${showbotWinStats.room1}</td>
            </tr>
            <tr>
              <td>Комната 2</td>
              <td>${showbotWinStats.room2}</td>
            </tr>
            <tr>
              <td>Комната 3</td>
              <td>${showbotWinStats.room3}</td>
            </tr>
            <tr>
              <td>Комната 4</td>
              <td>${showbotWinStats.room4}</td>
            </tr>
            <tr>
              <td>Комната 5</td>
              <td>${showbotWinStats.room5}</td>
            </tr>
          </table>

        </div>
        <h2>Комната 1</h2>
        <label> <input type="checkbox" class="botFlag botFlag-1" /> Игра с ботами </label>
        <br />
        <label>
          Макс. количество ботов, 1бот = 1человек: <input type="number" class="botCount botCount-1" />  (по стандарту 4)
        </label>
        <br />
        <label>
          Макс. количество билетов: <input type="number" class="ticketCount ticketCount-1" /> (от 1 до 6)
        </label>
        <br />
        <label>
          Шанс победы, %: <input type="number" class="winChance winChance-1" step="0.01" /> (для команды ботов, от 1 до 100)
        </label>
        <br />
        <label>
          Джекпот:
          <input type="number" class="jackpot jackpot-1" step="0.01" />
        </label>
        <br />
        <label>
          Количество бочек для выигрыша джекпота: 
          <input type="number" class="maxCasksJackpot maxCasksJackpot-1" step="1" />
        </label>
        <br />
        <label> <input type="checkbox" class="canBotWinJackpot canBotWinJackpot-1" /> Бот может выиграть джекпот </label>
        <br />
        <button class="addBotBtn">Сохранить</button>
      </div>

      <div class="admin-room"  roomId = "2">
        <h2>Комната 2</h2>
        <label> <input type="checkbox" class="botFlag botFlag-2" /> Игра с ботами </label>
        <br />
        <label>
          Макс. количество ботов, 1бот = 1человек: <input type="number" class="botCount botCount-2" /> (по стандарту 4)
        </label>
        <br />
        <label>
          Макс. количество билетов на одного бота: <input type="number" class="ticketCount ticketCount-2" /> (от 1 до 6)
        </label>
        <br />
        <label>
          Шанс победы, %: <input type="number" class="winChance winChance-2" step="0.01" /> (для команды ботов, от 1 до 100%)
        </label>
        <br />
        <label>
          Джекпот:
          <input type="number" class="jackpot jackpot-1" step="0.01" />
        </label>        
        <br />
        <label>
          Количество бочек для выигрыша джекпота: 
          <input type="number" class="maxCasksJackpot maxCasksJackpot-2" step="1" />
        </label>
        <br />
        <label> <input type="checkbox" class="canBotWinJackpot canBotWinJackpot-2" /> Бот может выиграть джекпот </label>
        <br />
        <button class="addBotBtn">Сохранить</button>
      </div>

      <div class="admin-room" roomId = "3">
        <h2>Комната 3</h2>
        <label> <input type="checkbox" class="botFlag botFlag-3" /> Игра с ботами </label>
        <br />
        <label>
          Макс. количество ботов, 1бот = 1человек: <input type="number" class="botCount botCount-3" /> (по стандарту 4)
        </label>
        <br />
        <label>
          Макс. количество билетов: <input type="number" class="ticketCount ticketCount-3" /> (от 1 до 6)
        </label>
        <br />
        <label>
          Шанс победы: <input type="number" class="winChance winChance-3" step="0.01" /> (для команды ботов, от 1 до 100%)
        </label>
        <br />
        <label>
          Джекпот:
          <input type="number" class="jackpot jackpot-1" step="0.01" />
        </label>
        <br />
        <label>
          Количество бочек для выигрыша джекпота: 
          <input type="number" class="maxCasksJackpot maxCasksJackpot-3" step="1" />
        </label>
        <br />
        <label> <input type="checkbox" class="canBotWinJackpot canBotWinJackpot-3" /> Бот может выиграть джекпот </label>
        <br />
        <button class="addBotBtn">Сохранить</button>
      </div>

    <div class="admin-room" roomId = "4">
      <h2>Комната 4</h2>
        <label> <input type="checkbox" class="botFlag botFlag-3" /> Игра с ботами </label>
        <br />
        <label>
          Макс. количество ботов, 1бот = 1человек: <input type="number" class="botCount botCount-3" /> (по стандарту 4)
        </label>
        <br />
        <label>
          Макс. количество билетов: <input type="number" class="ticketCount ticketCount-3" /> (от 1 до 6)
        </label>
        <br />
        <label>
          Шанс победы: <input type="number" class="winChance winChance-3" step="0.01" /> (для команды ботов, от 1 до 100%)
        </label>
        <br />
        <label>
          Джекпот:
          <input type="number" class="jackpot jackpot-1" step="0.01" />
        </label>
        <br />
        <label>
          Количество бочек для выигрыша джекпота: 
          <input type="number" class="maxCasksJackpot maxCasksJackpot-4" step="1" />
        </label>
        <br />
        <label> <input type="checkbox" class="canBotWinJackpot canBotWinJackpot-4" /> Бот может выиграть джекпот </label>
        <br />
        <button class="addBotBtn">Сохранить</button>
      </div>

    <div class="admin-room" roomId = "5">
      <h2>Комната 5</h2>
        <label> <input type="checkbox" class="botFlag botFlag-3" /> Игра с ботами </label>
        <br />
        <label>
          Макс. количество ботов, 1бот = 1человек: <input type="number" class="botCount botCount-3" /> (по стандарту 4)
        </label>
        <br />
        <label>
          Макс. количество билетов: <input type="number" class="ticketCount ticketCount-3" /> (от 1 до 6)
        </label>
        <br />
        <label>
          Шанс победы: <input type="number" class="winChance winChance-3" step="0.01" /> (для команды ботов, от 1 до 100%)
        </label>
        <br />
        <label>
          Джекпот:
          <input type="number" class="jackpot jackpot-1" step="0.01" />
        </label>
        <br />
        <label>
          Количество бочек для выигрыша джекпота: 
          <input type="number" class="maxCasksJackpot maxCasksJackpot-5" step="1" />
        </label>
        <br />
        <label> <input type="checkbox" class="canBotWinJackpot canBotWinJackpot-5" /> Бот может выиграть джекпот </label>
        <br />
        <button class="addBotBtn">Сохранить</button>
      </div>

      <div class="admin-stats-container">
      <div class="admin-stats-row admin-stats-header">
        <div class="admin-stats-column name">Имя</div>
        <div class="admin-stats-column won-loto">Выиграно в лото</div>
        <div class="admin-stats-column lost-loto">Проиграно в лото</div>
        <div class="admin-stats-column won-nardy">Выиграно в нарды</div>
        <div class="admin-stats-column lost-nardy">Проиграно в нарды</div>
        <div class="admin-stats-column won-domino">Выиграно в домино</div>
        <div class="admin-stats-column lost-domino">Проиграно в домино</div>
        <div class="admin-stats-column won-money">Выиграно всего</div>
        <div class="admin-stats-column lost-money">Проиграно всего</div>
      </div>
    </div>
    </section>
  `;
  await getAdminSettings();
  addAdminFunctions();

  createUsersStatsTable();
}

async function createUsersStatsTable() {
  let usersdata = await impHttp.getAllUsersAdminStats();

  if (usersdata.status != 200) {
    return;
  }
  const container = document.querySelector(".admin-stats-container");
  container.innerHTML = "";
  for (let index = 0; index < usersdata.data.length; index++) {
    const userObject = usersdata.data[index];

    let statsRow = document.createElement("div");
    statsRow.classList.add("admin-stats-row");
    statsRow.innerHTML = `<div class="admin-stats-column name">${userObject.username}</div>
    <div class="admin-stats-column won-loto">${userObject.lotoWon}</div>
    <div class="admin-stats-column lost-loto">${userObject.lotoLost}</div>
    <div class="admin-stats-column won-nardy">${userObject.nardsWon}</div>
    <div class="admin-stats-column lost-nardy">${userObject.nardsLost}</div>
    <div class="admin-stats-column won-domino">${userObject.dominoWon}</div>
    <div class="admin-stats-column lost-domino">${userObject.dominoLost}</div>
    <div class="admin-stats-column won-money">${userObject.moneyWon}</div>
    <div class="admin-stats-column lost-money">${userObject.moneyLost}</div>`;
    container.appendChild(statsRow);
  }
}

async function getAdminSettings() {
  let response = await impHttp.getLotoSettings();

  if (response.status == 200) {
    const rooms = document.querySelectorAll(".admin-room");

    rooms.forEach((room) => {
      const botFlag = room.querySelector(".botFlag");
      const botCountInput = room.querySelector(".botCount");
      const ticketCountInput = room.querySelector(".ticketCount");
      const winChanceInput = room.querySelector(".winChance");
      const jackpotInput = room.querySelector(".jackpot");
      const maxCasksJackpot = room.querySelector(".maxCasksJackpot");
      const canBotWinJackpot = room.querySelector(".canBotWinJackpot");

      const roomId = room.getAttribute("roomId");

      const roomSettings = response.data.find(
        (item) => item.gameLevel == roomId
      );

      if (roomSettings) {
        botFlag.checked = roomSettings.allowBots;
        botCountInput.value = roomSettings.maxBots;
        ticketCountInput.value = roomSettings.maxTickets;
        winChanceInput.value = roomSettings.winChance;
        jackpotInput.value = roomSettings.jackpot;
        maxCasksJackpot.value = roomSettings.maxCasksJackpot;
        canBotWinJackpot.checked = roomSettings.canBotWinJackpot;
      }
    });
  } else {
  }
}

async function setAdminSettings(roomId) {
  const room = document.querySelector(`.admin-room[roomId="${roomId}"]`);

  const botFlag = room.querySelector(".botFlag");
  const botCountInput = room.querySelector(".botCount");
  const ticketCountInput = room.querySelector(".ticketCount");
  const winChanceInput = room.querySelector(".winChance");
  const jackpotInput = room.querySelector(".jackpot");
  const maxCasksJackpot = room.querySelector(".maxCasksJackpot");
  const canBotWinJackpot = room.querySelector(".canBotWinJackpot");

  const body = {
    allowBots: botFlag.checked,
    maxBots: botCountInput.value,
    maxTickets: ticketCountInput.value,
    winChance: winChanceInput.value,
    jackpot: jackpotInput.value,
    maxCasksJackpot: maxCasksJackpot.value,
    canBotWinJackpot: canBotWinJackpot.checked,
  };

  let response = await impHttp.setLotoSettings(roomId, body);
}
