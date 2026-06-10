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