let menuSoundsAllowed = localStorage.getItem("sounds-menu");
let gameSoundsAllowed = localStorage.getItem("sounds-game");

let menuVolume = 0.5;
let gameVolume = 0.5;
if (menuSoundsAllowed == "false") {
  menuVolume = 0;
}
if (gameSoundsAllowed == "false") {
  gameVolume = 0;
}

export const setGameSoundsAllowed = (allowed) => {
  gameSoundsAllowed = `${allowed}`;
  gameVolume = allowed ? 0.5 : 0;
};

export const setMenuSoundsAllowed = (allowed) => {
  menuSoundsAllowed = `${allowed}`;
  menuVolume = allowed ? 0.5 : 0;
};

// casks
const casksSounds = [];
for (let i = 1; i <= 10; i++) {
  let audio = new Audio(`./js/modules/sounds/ru/${i}.mp3`);
  casksSounds.push(audio);
}

export const playNumber = (number) => {
  casksSounds[number - 1].volume = gameVolume;
  casksSounds[number - 1].play();
};

// general
const generalSounds = {};

const loading = new Audio("./js/modules/sounds/loading.mp3");
generalSounds.loading = loading;

export const playLoading = () => {
  generalSounds.loading.volume = menuVolume;
  generalSounds.loading.play();
};

export const playTicket = () => {
  // чтоб можно было нажимать на кнопку несколько раз
  const ticket = new Audio("./js/modules/sounds/ticket.mp3");
  ticket.volume = menuVolume;
  ticket.play();
};

export const playSuccess = () => {
  const success = new Audio("./js/modules/sounds/success.mp3");
  success.volume = menuVolume;
  success.play();
};
