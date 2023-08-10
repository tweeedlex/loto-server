import * as impNav from "./navigation.js";
// 100 предупреждения
// 200 выиграш
// 300 проиграш
// 400 ошибка в игре
// 500 анонс

export const open = (text, status, showButton = false, ws = null) => {
  const body = document.querySelector("body");
  body.innerHTML += `
    <div class="popup">
      <div class="popup__body">
        <div class="popup__content ${
          status === 200 ? "popup__content_won" : ""
        } ${status === 300 ? "popup__content_lost" : ""}">
          <button class="popup__close"></button>
          <div class="popup__text">
            ${text}
          </div>
          ${
            showButton
              ? `<button class="popup__button">Продолжить</button>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
  if (showButton) {
    const button = body.querySelector(".popup__button");
    button.addEventListener("click", () => {
      close();
      ws.close();
    });
  }
  const closeButton = document.querySelector(".popup__close");
  closeButton.addEventListener("click", close);
};

export const close = () => {
  const popup = document.querySelector(".popup");
  const closeButton = document.querySelector(".popup__close");
  closeButton.removeEventListener("click", close);
  popup.remove();
};
