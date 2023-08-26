export const API_URL = "https://loto-server-new.onrender.com/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
    }
    throw error;
  }
);

export async function registration(registrationData) {
  try {
    let response = await $api.post("/registration", registrationData);
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
    }
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function login(loginData) {
  try {
    let response = await $api.post("/login", loginData);
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
    }
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return await error.response;
  }
}

export async function updateAuth() {
  try {
    const response = await axios.get(`${API_URL}/refresh`, {
      withCredentials: true,
    });

    localStorage.setItem("token", response.data.accessToken);
    return await response;
  } catch (error) {
    console.log(e.response?.data?.message);
    return await error.response;
  } finally {
  }
}

export async function checkAuth() {
  try {
    let response = await $api.get("/checkAuth");
    return await response;
  } catch (error) {
    return await error.response;
  }
}

export async function logout() {
  try {
    const response = await $api.post("/logout");
    localStorage.removeItem("token");
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return error.response;
  }
}

export async function changePassword(data) {
  try {
    const response = await $api.put("/change-password", data);
    return await response;
  } catch (error) {
    console.log(error.response?.data?.message);
    return error.response;
  }
}

export async function getUser() {
  try {
    const response = await $api.get(`/get-user`);
    return await response;
  } catch (error) {
    console.log(e.response);
    return await error.response;
  }
}

export async function disconnectRoom(roomId) {
  try {
    const response = await $api.delete(`/game/disconnect-loto-room/${roomId}`);
    return await response;
  } catch (error) {
    console.log(e.response);
    return await error.response;
  }
}

export async function finishWaiting(roomId) {
  try {
    const response = await $api.put(`/game/finish-loto-waiting/${roomId}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function connectRoom(roomId) {
  try {
    const response = await $api.post(`/game/connect-loto-room/${roomId}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getTicket() {
  try {
    const response = await $api.post(`/game/create-card`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function deleteTicket(cardId) {
  try {
    const response = await $api.delete(`/game/delete-card/${cardId}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function buyTickets(cards) {
  try {
    const response = await $api.post(`/game/create-card`, {
      cards,
    });
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getTickets() {
  try {
    const response = await $api.get(`/game/get-card`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function isGameStarted(roomId) {
  try {
    const response = await $api.get(`/game/is-game-started/${roomId}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function isPlayerInRoom(roomId) {
  try {
    const response = await $api.get(`/game/is-user-in-game/${roomId}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function clearAllConnectons() {
  try {
    const response = await $api.delete(`/game/clear-all`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

//admin

export async function getLotoSettings() {
  try {
    const response = await $api.get(`/loto-settings`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getBotWins() {
  try {
    const response = await $api.get(`/bot-wins`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getUserGames() {
  try {
    const response = await $api.get(`/get-games`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function setLotoSettings(roomId, body) {
  try {
    const response = await $api.put(`/loto-settings/${roomId}`, body);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

// leaders page

export async function getGameLeaders(gameType) {
  try {
    const response = await $api.get(`/leaders/${gameType}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getBotStats(gameType) {
  try {
    const response = await $api.get(`/botsStat/${gameType}`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getAllUsersAdminStats() {
  try {
    const response = await $api.get(`/allUsersStats`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}

export async function getAdminBotWins() {
  // можна передавать игру чтоб получать игру для статистики
  try {
    const response = await $api.get(`/bot-wins`);
    return await response;
  } catch (e) {
    console.log(e.response);
    return await e.response;
  }
}
