import * as lotoNav from "../loto/loto-navigation.js";
let activeTurnTimers = [];

export const setDominoTableInfo = (msg) => {
  const playersArr = msg.players;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = +user.userId;

  const playerData = playersArr.find((player) => player.userId == userId);
  const playerTilesArr = playerData.tiles;

  const tableBlock = document.querySelector(".domino-game-page-table-block");
  const marketBlock = document.querySelector(".domino-table-store__score");
  marketBlock.innerHTML = msg.market.length;
  let emenyPlayerNum = 1;
  msg.players.forEach((player, i) => {
    if (!(player.userId == userId)) {
      tableBlock.innerHTML += `
      <div
        class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-${emenyPlayerNum}"
        userId="${+player.userId}"
        username="${player.username}"
      >
        <div class="domino-enemy-player__img">
          <img src="img/profile.png" alt="" /><span>${
            player.tiles.length
          }</span>
        </div>
        <div class="domino-enemy-player__info">
          <h2 class="domino-enemy-player__name">${player.username}</h2>
          <span class="domino-enemy-player__score">${player.score}/50</span>
        </div>
      </div>
      `;

      emenyPlayerNum++;
    }
  });

  drawUserInfo(playerData, user);
  drawPlayerTiles(playerTilesArr);
};

export const updateGameScene = (scene, player) => {
  let currClientGameScene = localStorage.getItem("dominoGameScene");
  if (currClientGameScene) {
    currClientGameScene = JSON.parse(currClientGameScene);
  }

  if (!currClientGameScene) {
    localStorage.setItem("dominoGameScene", JSON.stringify(scene));
    let currClientGameScene = localStorage.getItem("dominoGameScene");
    currClientGameScene = JSON.parse(currClientGameScene);
    drawGameScene(currClientGameScene, scene);
  } else if (currClientGameScene && currClientGameScene != scene) {
    localStorage.setItem("dominoGameScene", JSON.stringify(scene));
    drawGameScene(currClientGameScene, scene);
  }
};

const drawGameScene = (currScene, newScene, player) => {
  let newLeftTiles = [];
  let newRightTiles = [];

  // draw first tile

  const tableBlock = document.querySelector(".domino-game-table__table");
  const existedTiles = tableBlock.querySelectorAll(".domino-game-table__tile");
  // console.log(existTiles, existedTiles.length);
  if (existedTiles.length == 0) {
    tableBlock.innerHTML = "";
    newScene.forEach((tile) => {
      tableBlock.innerHTML += `
      <div class="domino-game-table__tile ${
        tile.rotate ? "rotated" : ""
      }" tileid="${+tile.id}">
        <div class="domino-game-table__tile-half domino-game-dots-${tile.left}">
          ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.left)}
        </div>
        <div class="domino-game-table__tile-half domino-game-dots-${
          tile.right
        }">
          ${`<div class="domino-game-tile__dot"></div>`.repeat(tile.right)}
        </div>
      </div>
      `;
    });
    return;
  }

  for (
    let i = 0;
    i < newScene.indexOf(newScene.find((tile) => tile.id == currScene[0].id));
    i++
  ) {
    newLeftTiles.push(newScene[i]);
  }

  // find index of last tile of currScene in newScene

  // let number = newScene.indexOf(currScene[currScene.length - 1]);

  for (
    let i =
      newScene.indexOf(
        newScene.find((tile) => tile.id == currScene[currScene.length - 1].id)
      ) + 1;
    i < newScene.length;
    i++
  ) {
    console.log(newScene[i]);
    newRightTiles.push(newScene[i]);
  }

  // draw new tiles left

  newLeftTiles.forEach((tile) => {
    const existedTiles = tableBlock.querySelectorAll(
      ".domino-game-table__tile"
    );
    const firstTile = existedTiles[0];

    const newTile = document.createElement("div");
    newTile.classList.add("domino-game-table__tile");
    if (tile.rotate) {
      newTile.classList.add("rotated");
    }
    newTile.setAttribute("tileid", tile.id);

    const newTileLeft = document.createElement("div");
    newTileLeft.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.left}`
    );
    newTileLeft.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.left
    )}`;

    const newTileRight = document.createElement("div");
    newTileRight.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.right}`
    );
    newTileRight.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.right
    )}`;

    newTile.appendChild(newTileLeft);
    newTile.appendChild(newTileRight);

    tableBlock.insertBefore(newTile, firstTile);
  });

  // tiles to right
  newRightTiles.forEach((tile) => {
    const existedTiles = tableBlock.querySelectorAll(
      ".domino-game-table__tile"
    );

    const newTile = document.createElement("div");
    newTile.classList.add("domino-game-table__tile");
    if (tile.rotate) {
      newTile.classList.add("rotated");
    }
    newTile.setAttribute("tileid", tile.id);

    const newTileLeft = document.createElement("div");
    newTileLeft.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.left}`
    );
    newTileLeft.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.left
    )}`;

    const newTileRight = document.createElement("div");
    newTileRight.classList.add(
      "domino-game-table__tile-half",
      `domino-game-dots-${tile.right}`
    );
    newTileRight.innerHTML = `${`<div class="domino-game-tile__dot"></div>`.repeat(
      tile.right
    )}`;

    newTile.appendChild(newTileLeft);
    newTile.appendChild(newTileRight);

    tableBlock.appendChild(newTile);
  });
};

const drawUserInfo = (playerData, user) => {
  const userBlock = document.querySelector(".domino-game-user");
  const usernameBlock = userBlock.querySelector(".domino-game-user__name");
  const userScoreBlock = userBlock.querySelector(
    ".domino-game-user__score span"
  );

  usernameBlock.innerHTML = user.username;
  userScoreBlock.innerHTML = playerData.score;
};

export const tilesController = (roomId, tableId, playerMode) => {
  let tiles = document.querySelectorAll(".domino-game__tile");

  tiles.forEach((tile) => {
    tile.removeEventListener("click", addTileEventListeners);
  });
  tiles.forEach((tile) => {
    const clickHandler = addTileEventListeners(
      tile,
      roomId,
      tableId,
      playerMode
    );
    tile.addEventListener("click", clickHandler);
  });

  function addTileEventListeners(tile, roomId, tableId, playerMode) {
    return function () {
      if (tile.classList.contains("disabled")) {
        return;
      }
      const user = JSON.parse(localStorage.getItem("user"));
      if (window.currentTurn) {
        if (user.userId != window.currentTurn) {
          return;
        }
      }

      let tiles = document.querySelectorAll(".domino-game__tile");
      tiles.forEach((tile) => {
        tile.classList.add("disabled");
        tile.classList.remove("highlight");
      });

      const left = +tile
        .querySelector(".domino-tile__half:first-child")
        .classList[1].split("-")[2];
      const right = +tile
        .querySelector(".domino-tile__half:last-child")
        .classList[1].split("-")[2];
      const id = +tile.getAttribute("tileid");

      window.ws.send(
        JSON.stringify({
          method: "playDominoTurn",
          roomId: roomId,
          tableId: tableId,
          playerMode: playerMode,
          tile: { left, right, id },
        })
      );
    };
  }
};

export const openTilesMarket = (market) => {
  let mainContainer = document.querySelector(".main__container");

  let marketPopup = document.createElement("div");
  marketPopup.classList.add("popup", "market-popup");
  marketPopup.innerHTML = `
    <div class="market-popup__body">
      ${`<div class="market-popup__item">
        <img src="img/logo-img-90deg.png" alt="" />
      </div>`.repeat(market.length)}
    </div>
  `;

  mainContainer.appendChild(marketPopup);

  let marketTileItem = document.querySelectorAll(".market-popup__item");
  marketTileItem.forEach((tile) => {
    tile.addEventListener("click", function () {
      const user = JSON.parse(localStorage.getItem("user"));
      tile.classList.add("market-tile__used");
      window.ws.send(
        JSON.stringify({
          method: "getMarketTile",
          userId: user.userId,
        })
      );
    });
  });
};

export const getMarketTile = (tile, msg) => {
  let userTilesBlock = document.querySelector(".domino-game__tiles");

  let userTile = document.createElement("div");
  userTile.classList.add("domino-game__tile", "domino-tile", "disabled");
  userTile.setAttribute("tileid", tile.id);
  userTile.innerHTML = `
    <div class="domino-tile__half domino-dots-${tile.left}">

    ${`<div class="domino-tile__dot"></div>`.repeat(tile.left)}
    </div>
    <div class="domino-tile__half domino-dots-${tile.right}">
    ${`<div class="domino-tile__dot"></div>`.repeat(tile.right)}
    </div>
  `;
  userTilesBlock.appendChild(userTile);

  // подсвечиваем если доминошка подходит
  tilesState(msg.turn, msg.scene);

  // добавляем функционал на доминошку
  addTileFunction(userTile, msg.dominoRoomId, msg.tableId, msg.playerMode);

  let marketPopup = document.querySelector(".market-popup");
  if (msg.closeMarket) {
    marketPopup.remove();
  }
};

export function updateMarketNum(marketNumber, playerId = null) {
  console.log(marketNumber, playerId);
  let dominoTableMarket = document.querySelector(".domino-table-store");
  if (dominoTableMarket) {
    let tableMarketScore = document.querySelector(".domino-table-store__score");
    if (tableMarketScore) {
      tableMarketScore.innerHTML = marketNumber;
    }
  }
  if (playerId) {
    animateMarketGettingTile(playerId);
  }
}

function animateMarketGettingTile(playerId) {}

export function updateEnemysTilesCount(tilesData) {
  console.log(tilesData);
  tilesData.forEach((userTiles) => {
    let enemyUser = document.querySelector(
      `.domino-game-table__enemy-player[userid="${userTiles.userId}"]`
    );
    if (enemyUser) {
      let enemyUserTilesCount = enemyUser.querySelector(
        ".domino-enemy-player__img span"
      );
      if (enemyUserTilesCount) {
        enemyUserTilesCount.innerHTML = +userTiles.tilesNumber;
      }
    }
  });
}

const addTileFunction = (tile, roomId, tableId, playerMode) => {
  tile.addEventListener("click", function () {
    if (tile.classList.contains("disabled")) {
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (window.currentTurn) {
      if (user.userId != window.currentTurn) {
        return;
      }
    }

    let tiles = document.querySelectorAll(".domino-game__tile");
    tiles.forEach((tile) => {
      tile.classList.add("disabled");
      tile.classList.remove("highlight");
    });

    const left = +tile
      .querySelector(".domino-tile__half:first-child")
      .classList[1].split("-")[2];
    const right = +tile
      .querySelector(".domino-tile__half:last-child")
      .classList[1].split("-")[2];
    const id = +tile.getAttribute("tileid");

    window.ws.send(
      JSON.stringify({
        method: "playDominoTurn",
        roomId: roomId,
        tableId: tableId,
        playerMode: playerMode,
        tile: { left, right, id },
      })
    );
  });
};

export const tilesState = (turn, scene) => {
  console.log(scene);
  let dominoGamePage = document.querySelector(".domino-game-page");
  if (dominoGamePage) {
    let userTiles = document.querySelectorAll(".domino-game__tile");

    userTiles.forEach((tile) => {
      tile.classList.add("disabled");
      tile.classList.remove("highlight");
    });

    let user = localStorage.getItem("user");
    user = JSON.parse(user);

    if (turn == user.userId) {
      if (scene.length == 0) {
        // find double tiles in user tiles
        let doubleTiles = [];
        userTiles.forEach((tile) => {
          let left = +tile
            .querySelector(".domino-tile__half:first-child")
            .classList[1].split("-")[2];
          let right = +tile
            .querySelector(".domino-tile__half:last-child")
            .classList[1].split("-")[2];
          if (left == right) {
            doubleTiles.push(tile);
          }
        });

        // highlight all double tiles
        doubleTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });
        return;
      }
      if (scene.length > 0) {
        // get right and left tiles
        let leftTile = scene[0];
        let rightTile = scene[scene.length - 1];

        // get left and right dots
        let leftDots = leftTile.left;
        let rightDots = rightTile.right;

        console.log("leftDots", leftDots);
        console.log("rightDots", rightDots);

        // find tiles with left and right dots in user tiles
        let leftTiles = [];
        let rightTiles = [];

        userTiles.forEach((tile) => {
          let left = +tile
            .querySelector(".domino-tile__half:first-child")
            .classList[1].split("-")[2];
          let right = +tile
            .querySelector(".domino-tile__half:last-child")
            .classList[1].split("-")[2];
          if (left == leftDots || right == leftDots) {
            leftTiles.push(tile);
          }
          if (right == rightDots || left == rightDots) {
            rightTiles.push(tile);
          }
        });
        console.log("leftTiles", leftTiles);
        console.log("rightTiles", rightTiles);

        // highlight all tiles with left and right dots
        leftTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });

        rightTiles.forEach((tile) => {
          tile.classList.remove("disabled");
          tile.classList.add("highlight");
        });
      }
    }
  }
};

const drawPlayerTiles = (playerTilesArr) => {
  const playerTiles = document.querySelector(".domino-game__tiles");
  playerTiles.innerHTML = "";
  playerTilesArr.forEach((tile) => {
    playerTiles.innerHTML += `
    <div class="domino-game__tile domino-tile disabled" tileid="${+tile.id}">
      <div class="domino-tile__half domino-dots-${tile.left}">
        ${`<div class="domino-tile__dot"></div>`.repeat(tile.left)}
      </div>
      <div class="domino-tile__half domino-dots-${tile.right}">
        ${`<div class="domino-tile__dot"></div>`.repeat(tile.right)}
      </div>
    </div>
    `;
  });
};

export const deletePlayerTiles = (deletedTileId, tilesArr) => {
  const playerTiles = document.querySelector(".domino-game__tiles");

  let tileToDelete = playerTiles.querySelector(
    `.domino-game__tile[tileid="${+deletedTileId}"]`
  );

  tileToDelete.remove();
};

export const setDominoTurn = async (currentTurn, turnTime, players = null) => {
  startDominoTurnTimer(currentTurn, turnTime);
};

const startDominoTurnTimer = async (currentTurn, currTurnTime) => {
  activeTurnTimers.forEach((timer) => {
    // console.log(timer);
    clearInterval(timer);
  });

  let dominoRoom = document.querySelector(".domino-game-page");
  if (dominoRoom) {
    let user = localStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
    }

    let allEnemyes = document.querySelectorAll(
      `.domino-game-table__enemy-player`
    );
    allEnemyes.forEach((enemy) => {
      enemy.classList.remove("green-border");
    });

    let existingTimer = document.querySelector(".user-avatar__countdown");
    if (existingTimer) {
      let userBlock = document.querySelector(".domino-game-user__avatar");
      userBlock.classList.remove("current-turn");
      existingTimer.remove();
    }

    if (user.userId == currentTurn) {
      let userBlock = document.querySelector(".domino-game-user__avatar");
      userBlock.classList.add("current-turn");
      let userTurnTimer = document.createElement("div");
      userTurnTimer.classList.add("user-avatar__countdown");
      let countDownDate = new Date(currTurnTime).getTime() + 25000;
      let nowClientTime = await lotoNav.NowClientTime();
      let distance = countDownDate - nowClientTime;
      let timer = setInterval(() => {
        distance -= 1000;
        if (distance < 0) {
          activeTurnTimers.forEach((timer) => {
            clearInterval(timer);
          });
        } else {
          const minutes = Math.floor(distance / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          // Add leading zeros for formatting
          const formattedMinutes = String(minutes).padStart(2, "0");
          const formattedSeconds = String(seconds).padStart(2, "0");
          // console.log(`${formattedMinutes}:${formattedSeconds}`);

          userTurnTimer.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
        }
      }, 1000);
      let existingTimer = document.querySelector(".user-avatar__countdown");
      if (existingTimer) {
        existingTimer.remove();
      }

      activeTurnTimers.forEach((timer) => {
        clearInterval(timer);
      });
      activeTurnTimers = [];
      activeTurnTimers.push(timer);
      userBlock.appendChild(userTurnTimer);
    } else {
      // console.log("currEnemysTurn", currentTurn);

      let enemyTurn = document.querySelector(
        `.domino-game-table__enemy-player[userId="${currentTurn}"]`
      );

      enemyTurn.classList.add("green-border");
      // console.log(enemyTurn);
    }
  }
};

export function reconnectFillTable(msg) {
  let {
    scene,
    market,
    turnQueue,
    turn,
    turnTime,
    players,
    userTiles,
    roomId,
    tableId,
    playerMode,
  } = msg;

  const user = JSON.parse(localStorage.getItem("user"));

  updateGameScene(scene);

  let playerData = players.find((player) => player.userId == user.userId);
  console.log(playerData);
  playerData.score = playerData.points;

  drawPlayerTiles(userTiles);
  drawUserInfo(playerData, user);

  tilesState(turn, scene);
  tilesController(roomId, tableId, playerMode);

  let marketLength = market.length;
  updateMarketNum(marketLength);

  setDominoTurn(turn, turnTime, players);

  const tableBlock = document.querySelector(".domino-game-page-table-block");
  let emenyPlayerNum = 1;
  console.log(players);
  players.forEach((player, i) => {
    console.log(player);
    if (!(player.userId == user.userId)) {
      tableBlock.innerHTML += `
      <div
        class="domino-game-table__enemy-player domino-enemy-player domino-enemy-player-${emenyPlayerNum}"
        userId="${+player.userId}"
        username="${player.username}"
      >
        <div class="domino-enemy-player__img">
          <img src="img/profile.png" alt="" /><span>${
            player.tiles.length
          }</span>
        </div>
        <div class="domino-enemy-player__info">
          <h2 class="domino-enemy-player__name">${player.username}</h2>
          <span class="domino-enemy-player__score">${player.score}/50</span>
        </div>
      </div>
      `;

      emenyPlayerNum++;
    }
  });

  // check if user has to take tiles from market
  window.ws.send(
    JSON.stringify({ method: "checkMarket", roomId, tableId, playerMode })
  );
}
