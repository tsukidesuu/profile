const albumCover = "assets/cosmic-princess-kaguya.png";

const playlist = [
  ["Remember", "yuigot, Yachiyo Runami(cv.Saori Hayami)"],
  ["Starry Sea", "Aqu3ra, Yachiyo Runami(cv.Saori Hayami)"],
  ["Watashiwa Watashino Kotoga Suki", "HoneyWorks, Kaguya(cv.Yuko Natsuyoshi)"],
  ["World is Mine - Kaguya&Yachiyo Runami ver. - CPK! Remix", "ryo (supercell), Kaguya(cv.Yuko Natsuyoshi), Yachiyo Runami(cv.Saori Hayami)"],
  ["Ex-Otogibanashi", "ryo (supercell), Kaguya(cv.Yuko Natsuyoshi), Yachiyo Runami(cv.Saori Hayami)"],
  ["Happy Synthesizer - Cover", "Kaguya(cv.Yuko Natsuyoshi), yuigot"],
  ["A Symphony of Moments", "40mP, Kaguya(cv.Yuko Natsuyoshi)"],
  ["Reply", "kz, Kaguya(cv.Yuko Natsuyoshi)"],
  ["ray - Cosmic Princess Kaguya! Version", "Kaguya(cv.Yuko Natsuyoshi), Yachiyo Runami(cv.Saori Hayami), TAKU INOUE"],
  ["Melt - Kaguya ver. - CPK! Remix", "ryo (supercell), Kaguya(cv.Yuko Natsuyoshi)"]
];

let index = 0;
let isPlaying = false;
let loopMode = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const artist = document.getElementById("song-artist");
const cover = document.getElementById("cover");
const list = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const seek = document.getElementById("seek");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const loopBtn = document.getElementById("loop");
const intro = document.getElementById("intro");
const bgVideo = document.getElementById("bg-video");

function formatTime(time) {
  if (isNaN(time)) return "00:00";

  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function loadSong(i) {
  index = i;

  title.textContent = playlist[i][0];
  artist.textContent = playlist[i][1];

  audio.src = `music/${i + 1}.mp3`;
  cover.src = albumCover;

  document.querySelectorAll(".playlist li").forEach((li, idx) => {
    li.classList.toggle("active", idx === i);
  });
}

function playSong() {
  return audio.play().then(() => {
    isPlaying = true;
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

playlist.forEach((song, i) => {
  const li = document.createElement("li");
  li.innerHTML = `${i + 1}. ${song[0]} <span>${song[1]}</span>`;

  li.onclick = () => {
    loadSong(i);
    playSong();
  };

  list.appendChild(li);
});

playBtn.onclick = () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
};

document.getElementById("next").onclick = () => {
  loadSong((index + 1) % playlist.length);
  playSong();
};

document.getElementById("prev").onclick = () => {
  loadSong((index - 1 + playlist.length) % playlist.length);
  playSong();
};

document.getElementById("shuffle").onclick = () => {
  const randomIndex = Math.floor(Math.random() * playlist.length);
  loadSong(randomIndex);
  playSong();
};

loopBtn.onclick = () => {
  loopMode = (loopMode + 1) % 3;

  if (loopMode === 0) {
    audio.loop = false;
    loopBtn.classList.remove("active-loop");
    loopBtn.innerHTML = `<i class="fa-solid fa-repeat"></i>`;
  }

  if (loopMode === 1) {
    audio.loop = false;
    loopBtn.classList.add("active-loop");
    loopBtn.innerHTML = `<i class="fa-solid fa-repeat"></i>`;
  }

  if (loopMode === 2) {
    audio.loop = true;
    loopBtn.classList.add("active-loop");
    loopBtn.innerHTML = `
      <span class="loop-one-icon">
        <i class="fa-solid fa-repeat"></i>
        <small>1</small>
      </span>
    `;
  }
};

document.getElementById("toggle-list").onclick = () => {
  list.classList.toggle("show");
};

audio.ontimeupdate = () => {
  seek.max = audio.duration || 0;
  seek.value = audio.currentTime || 0;

  current.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);
};

seek.oninput = () => {
  audio.currentTime = seek.value;
};

audio.onended = () => {
  if (loopMode === 2) return;

  if (index < playlist.length - 1) {
    loadSong(index + 1);
    playSong();
  } else if (loopMode === 1) {
    loadSong(0);
    playSong();
  } else {
    pauseSong();
  }
};

volume.oninput = () => {
  audio.volume = volume.value;
};

loadSong(index);

audio.volume = 0.3;
volume.value = 0.3;

if (bgVideo) {
  bgVideo.volume = 0;
  bgVideo.muted = true;
  bgVideo.pause();
  bgVideo.currentTime = 0;

  bgVideo.addEventListener("ended", () => {
    bgVideo.style.opacity = "0";
    document.body.classList.add("wallpaper-ended");
  });
}

intro.addEventListener("click", async () => {
  intro.classList.add("hide");

  document.body.classList.add("loaded");

  if (bgVideo) {
    bgVideo.currentTime = 0;
    bgVideo.style.opacity = "1";

    try {
      await bgVideo.play();
    } catch (err) {
      console.log("Video lỗi:", err);
    }
  }

  try {
    await playSong();
  } catch (err) {
    console.log("Audio lỗi:", err);
  }

  setTimeout(() => {
    intro.remove();
  }, 800);
});

bgVideo.style.opacity = "1";

let videoStartTime = null;

intro.addEventListener("click", async () => {
  videoStartTime = Date.now();

  intro.classList.add("hide");
  document.body.classList.add("loaded");

  if (bgVideo) {
    bgVideo.currentTime = 0;
    bgVideo.style.opacity = "1";
    await bgVideo.play();
  }

  await playSong();

  setTimeout(() => {
    intro.remove();
  }, 800);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden && bgVideo && videoStartTime && !bgVideo.ended) {
    const elapsed = (Date.now() - videoStartTime) / 1000;

    if (elapsed < bgVideo.duration) {
      bgVideo.currentTime = elapsed;
      bgVideo.play().catch(() => {});
    } else {
      bgVideo.style.opacity = "0";
      document.body.classList.add("wallpaper-ended");
    }
  }
});

const DISCORD_ID = "919574876644343888";

const statusText = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline"
};

const activityTypeText = {
  0: "Playing",
  1: "Streaming",
  2: "Listening to",
  3: "Watching",
  4: "Custom Status",
  5: "Competing"
};

function getDiscordAsset(activity, image) {
  if (!image) return null;

  if (image.startsWith("https://")) return image;

  if (image.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${image.replace("spotify:", "")}`;
  }

  if (image.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${image.replace("mp:external/", "")}`;
  }

  if (activity.application_id) {
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
  }

  return null;
}

const manualActivityIcons = {
  roblox: "assets/roblox.png",
  valorant: "assets/valorant.png"
};

let currentGameKey = null;
let currentGameStartedAt = null;
let currentGameBaseDetail = null;
let gameTimerInterval = null;

function getGameKey(name = "") {
  const key = name.toLowerCase();

  if (key.includes("roblox")) return "roblox";
  if (key.includes("valorant")) return "valorant";

  return null;
}

function getManualActivityIcon(name = "") {
  const gameKey = getGameKey(name);

  if (gameKey && manualActivityIcons[gameKey]) {
    return manualActivityIcons[gameKey];
  }

  return null;
}

function getGameBaseDetail(name = "") {
  const gameKey = getGameKey(name);

  if (gameKey === "roblox") return "In game";
  if (gameKey === "valorant") return "In match";

  return "Active now";
}

function formatRunningTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

function startGameTimer(gameKey, startedAt, baseDetail) {
  currentGameKey = gameKey;
  currentGameStartedAt = startedAt || Date.now();
  currentGameBaseDetail = baseDetail;

  if (gameTimerInterval) {
    clearInterval(gameTimerInterval);
  }

  function updateTimerText() {
    const activityDetail = document.getElementById("activityDetail");
    if (!activityDetail || !currentGameStartedAt) return;

    const elapsed = formatRunningTime(Date.now() - currentGameStartedAt);
    activityDetail.textContent = `${currentGameBaseDetail} • ${elapsed}`;
  }

  updateTimerText();

  gameTimerInterval = setInterval(updateTimerText, 1000);
}

function stopGameTimer() {
  currentGameKey = null;
  currentGameStartedAt = null;
  currentGameBaseDetail = null;

  if (gameTimerInterval) {
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
  }
}

function pickActivity(data) {
  if (data.spotify) {
    stopGameTimer();

    return {
      type: "Listening to",
      name: data.spotify.song,
      detail: data.spotify.artist,
      image: data.spotify.album_art_url,
      gameKey: null,
      startedAt: null
    };
  }

  const activity =
    data.activities?.find(a => getGameKey(a.name)) ||
    data.activities?.find(a => a.type === 0) ||
    data.activities?.find(a => a.type !== 4) ||
    data.activities?.find(a => a.type === 4);

  if (!activity) {
    stopGameTimer();

    return {
      type: statusText[data.discord_status] || "Offline",
      name: "Discord",
      detail: "No activity",
      image: null,
      gameKey: null,
      startedAt: null
    };
  }

  const discordImage =
    getDiscordAsset(activity, activity.assets?.large_image) ||
    getDiscordAsset(activity, activity.assets?.small_image);

  const manualImage = getManualActivityIcon(activity.name);
  const gameKey = getGameKey(activity.name);

  let detail = activity.details || activity.state;

  if (!detail || detail === "No details") {
    detail = getGameBaseDetail(activity.name);
  }

  let startedAt = null;

  if (activity.timestamps?.start) {
    startedAt = new Date(activity.timestamps.start).getTime();
  }

  if (gameKey && !startedAt) {
    startedAt = Date.now();
  }

  return {
    type: activityTypeText[activity.type] || "Playing",
    name: activity.name || "Discord",
    detail,
    image: discordImage || manualImage,
    gameKey,
    startedAt
  };
}

function renderLanyard(data) {
  console.log("LANYARD STATUS:", data.discord_status, data);
  const user = data.discord_user;
  const status = data.discord_status || "offline";
  const activity = pickActivity(data);

  document.getElementById("lanyardName").textContent =
      "_tsukidesuu";

  const dot = document.getElementById("lanyardDot");
  dot.className = `presence ${status}`;

  document.getElementById("activityType").textContent = activity.type;
  document.getElementById("activityName").textContent = activity.name;
  if (activity.gameKey) {
    const isSameGame =
      currentGameKey === activity.gameKey &&
      currentGameStartedAt;

    if (!isSameGame) {
      startGameTimer(activity.gameKey, activity.startedAt, activity.detail);
    }
  } else {
    stopGameTimer();
    document.getElementById("activityDetail").textContent = activity.detail;
  }

  const iconBox = document.getElementById("activityIcon");

  if (activity.image) {
    iconBox.innerHTML = `<img src="${activity.image}" alt="activity icon">`;
  } else {
    iconBox.innerHTML = `<i class="fa-brands fa-discord"></i>`;
  }
}

async function loadLanyardOnce() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
    const json = await res.json();

    if (json.success) {
      renderLanyard(json.data);
    }
  } catch (err) {
    console.log("Lanyard REST lỗi:", err);
  }
}

function connectLanyardSocket() {
  const socket = new WebSocket("wss://api.lanyard.rest/socket");

  let heartbeat = null;

  socket.addEventListener("message", event => {
    const packet = JSON.parse(event.data);

    if (packet.op === 1) {
      socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: DISCORD_ID
        }
      }));

      heartbeat = setInterval(() => {
        socket.send(JSON.stringify({ op: 3 }));
      }, packet.d.heartbeat_interval);
    }

    if (packet.t === "INIT_STATE") {
      renderLanyard(packet.d);
    }

    if (packet.t === "PRESENCE_UPDATE") {
      renderLanyard(packet.d);
    }
  });

  socket.addEventListener("close", () => {
    if (heartbeat) clearInterval(heartbeat);

    setTimeout(() => {
      connectLanyardSocket();
    }, 3000);
  });

  socket.addEventListener("error", err => {
    console.log("Lanyard WebSocket lỗi:", err);
    socket.close();
  });
}

loadLanyardOnce();
connectLanyardSocket();

const BIRTH_DATE = new Date(2010, 1, 22);

function calculateAge(birthDate) {
  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return `${years}`;
}

function updateAge() {
  const ageText = document.getElementById("ageText");
  if (!ageText) return;

  ageText.textContent = calculateAge(BIRTH_DATE);
}

updateAge();
setInterval(updateAge, 1000 * 60 * 60);

const avatarWrap = document.getElementById("avatarWrap");

if (avatarWrap) {
  const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  if (isTouchDevice) {
    avatarWrap.addEventListener("click", event => {
      event.stopPropagation();
      avatarWrap.classList.toggle("is-open");
    });

    document.addEventListener("click", () => {
      avatarWrap.classList.remove("is-open");
    });

    document.addEventListener("touchstart", event => {
      if (!avatarWrap.contains(event.target)) {
        avatarWrap.classList.remove("is-open");
      }
    }, { passive: true });
  }
}