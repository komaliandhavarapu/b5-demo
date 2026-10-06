// URL Search Parameters
const params = new URLSearchParams(location.search);
const name = params.get("name") || "Aanya";
const date = params.get("date") || "28 September";
const from = params.get("from") || "Someone Special";

// Populate dynamic text
document.querySelectorAll("[data-name]").forEach(el => el.textContent = name);
document.querySelectorAll("[data-date]").forEach(el => el.textContent = date);
document.querySelectorAll("[data-from]").forEach(el => el.textContent = "— with love, " + from);

// Music Controller
const music = document.querySelector("#music");
const musicBtn = document.querySelector("#musicBtn");
if (musicBtn && music && window !== window.top) {
  music.pause();
  music.removeAttribute("src");
  music.load();
  musicBtn.style.display = "none";
} else if (musicBtn && music) {
  const musicPositionKey = "musicPosition";
  const isPlaying = sessionStorage.getItem("musicPlaying") === "true";
  let musicPositionRestored = false;
  let musicReady;

  if (music.readyState >= 1) {
    musicReady = Promise.resolve();
  } else {
    musicReady = new Promise(resolve => {
      music.addEventListener("loadedmetadata", resolve, { once: true });
    });
  }

  const saveMusicPosition = () => {
    sessionStorage.setItem(musicPositionKey, String(music.currentTime));
  };

  const restoreMusicPosition = async () => {
    if (musicPositionRestored) return;
    await musicReady;
    const position = Number(sessionStorage.getItem(musicPositionKey));
    if (Number.isFinite(position) && position > 0 && position < music.duration) {
      music.currentTime = position;
    }
    musicPositionRestored = true;
  };

  music.addEventListener("timeupdate", saveMusicPosition);
  window.addEventListener("pagehide", saveMusicPosition);

  if (isPlaying) {
    restoreMusicPosition().then(() => music.play()).then(() => {
      musicBtn.textContent = "🔊";
    }).catch(() => {});
  }

  musicBtn.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await restoreMusicPosition();
        await music.play();
        musicBtn.textContent = "🔊";
        sessionStorage.setItem("musicPlaying", "true");
      } catch (e) {}
    } else {
      music.pause();
      saveMusicPosition();
      musicBtn.textContent = "🎵";
      sessionStorage.setItem("musicPlaying", "false");
    }
  });
}

// Navigation helper preserving query parameters
function next(page) {
  if (window !== window.top) {
    window.parent.postMessage({ type: "birthday-navigation", page }, "*");
    return;
  }

  const q = location.search || "";
  const frame = document.querySelector("#birthdayPage");
  if (frame) {
    const target = new URL(page + q, location.href);
    const route = target.pathname + target.search;
    history.pushState({ birthdayPage: route }, "", route);
    frame.src = route;
    return;
  }

  location.href = page + q;
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => next(btn.dataset.next));
});

// Sparkles generator
const sparkleContainer = document.querySelector("#sparkleContainer");
if (sparkleContainer) {
  const sparkles = ["✦", "✧", "✨", "🌸", "♡"];
  for (let i = 0; i < 24; i++) {
    const span = document.createElement("span");
    span.className = "sparkle-dot";
    span.textContent = sparkles[i % sparkles.length];
    span.style.left = (Math.random() * 95) + "%";
    span.style.animationDelay = (Math.random() * 8) + "s";
    span.style.animationDuration = (6 + Math.random() * 5) + "s";
    span.style.fontSize = (11 + Math.random() * 12) + "px";
    if (span.textContent === "✨" || span.textContent === "✦") {
      span.style.color = i % 2 === 0 ? "#f7a048" : "#ff7b9f";
    }
    sparkleContainer.appendChild(span);
  }
}

// Night sky stars generator for Slide 3 & 4 (Room)
const roomStars = document.querySelector("#roomStars");
if (roomStars) {
  const starSymbols = ["✦", "★", "·", "✧", "•"];
  for (let i = 0; i < 40; i++) {
    const star = document.createElement("span");
    star.className = "star-twinkle";
    star.textContent = starSymbols[i % starSymbols.length];
    star.style.left = (Math.random() * 96) + "%";
    star.style.top = (Math.random() * 85) + "%";
    star.style.animationDelay = (Math.random() * 3) + "s";
    star.style.fontSize = (8 + Math.random() * 12) + "px";
    roomStars.appendChild(star);
  }
}

// Confetti generator
function triggerConfetti() {
  const colors = ["#ff708f", "#ffd15c", "#7ce4c9", "#b99bf8", "#ff9ab5", "#ffbe76"];
  for (let i = 0; i < 45; i++) {
    const conf = document.createElement("div");
    conf.style.position = "fixed";
    conf.style.left = (35 + Math.random() * 30) + "%";
    conf.style.top = (40 + Math.random() * 20) + "%";
    conf.style.width = (6 + Math.random() * 8) + "px";
    conf.style.height = (8 + Math.random() * 10) + "px";
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.borderRadius = i % 3 === 0 ? "50%" : "2px";
    conf.style.zIndex = "99";
    conf.style.pointerEvents = "none";
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2s ease";
    document.body.appendChild(conf);

    setTimeout(() => {
      const destX = (Math.random() - 0.5) * 400;
      const destY = -120 - Math.random() * 250;
      conf.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 720}deg) scale(${0.5 + Math.random() * 0.8})`;
      conf.style.opacity = "0";
    }, 20);

    setTimeout(() => conf.remove(), 2500);
  }
}

// Slide 1 & 2: Envelope Open Controller
const openEnv = document.querySelector("#openEnvelope");
const env = document.querySelector("#envelope");
const envCard = document.querySelector("#envelopeCard");

if (openEnv && env) {
  let isOpened = false;

  const handleOpen = () => {
    if (isOpened) {
      next("room.html");
      return;
    }
    isOpened = true;
    env.classList.add("is-open");
    openEnv.style.pointerEvents = "none";
    openEnv.style.opacity = "0.9";
    const textSpan = openEnv.querySelector(".btn-surprise-text");
    if (textSpan) textSpan.textContent = "Entering the room... ✨";

    triggerConfetti();

    setTimeout(() => {
      next("room.html");
    }, 2800);
  };

  openEnv.addEventListener("click", handleOpen);
  env.addEventListener("click", handleOpen);
  if (envCard) envCard.addEventListener("click", () => next("room.html"));

  if (params.get("open") === "1") {
    env.classList.add("is-open");
  }
}

// Slide 3 & 4: Room Lights Controller
const roomBtn = document.querySelector("#lightButton");
if (roomBtn) {
  roomBtn.addEventListener("click", () => {
    document.body.classList.add("lit");
    roomBtn.textContent = "The room is glowing ✨";
    roomBtn.style.pointerEvents = "none";
    
    setTimeout(() => {
      next("reveal.html");
    }, 3000);
  });

  if (params.get("lit") === "1") {
    document.body.classList.add("lit");
  }
}

// Slide 6 & 7: Cake Cutting Controller
const cakeStage = document.querySelector("#cakeStage");
const cutLine = document.querySelector("#cutLine");
const cakePage = document.querySelector("#cakePage");

if (cakeStage && cutLine) {
  let isCut = false;
  let startY = null;

  const executeCut = () => {
    if (isCut) return;
    isCut = true;
    cakeStage.classList.add("is-cut");
    if (cakePage) cakePage.classList.add("cut-done");
    triggerConfetti();
  };

  // Support click to cut
  cutLine.addEventListener("click", executeCut);
  cakeStage.addEventListener("click", executeCut);

  // Support pointer / touch swipe down
  cutLine.addEventListener("pointerdown", e => {
    startY = e.clientY;
    cutLine.setPointerCapture?.(e.pointerId);
  });

  cutLine.addEventListener("pointerup", e => {
    if (startY !== null && (e.clientY - startY > 40 || Math.abs(e.clientY - startY) < 10)) {
      executeCut();
    }
    startY = null;
  });

  if (params.get("cut") === "1") {
    executeCut();
  }
}

// Floating hearts for Slides with .float
document.querySelectorAll(".float").forEach((el, i) => {
  el.style.left = (5 + (i * 13) % 90) + "%";
  el.style.animationDelay = (i * 0.7) + "s";
  el.style.fontSize = (14 + (i % 4) * 5) + "px";
});

if (window === window.top) {
  const pageFrame = document.createElement("iframe");
  pageFrame.id = "birthdayPage";
  pageFrame.title = "Birthday surprise";
  pageFrame.allow = "autoplay";
  pageFrame.style.cssText = "position:fixed;inset:0;width:100%;height:100%;border:0;z-index:1;background:transparent";
  const initialRoute = location.pathname + location.search;
  history.replaceState({ birthdayPage: initialRoute }, "", location.href);
  pageFrame.src = initialRoute;
  document.body.appendChild(pageFrame);
  document.body.style.overflow = "hidden";
  for (const element of document.body.children) {
    if (element !== music && element !== musicBtn && element !== pageFrame && element.tagName !== "SCRIPT") {
      element.style.display = "none";
    }
  }

  const pages = new Set([
    "index.html", "room.html", "reveal.html", "cake.html",
    "wish.html", "memories.html", "letter.html", "final.html"
  ]);

  window.addEventListener("message", event => {
    if (event.source !== pageFrame.contentWindow) return;
    if (!event.data || event.data.type !== "birthday-navigation") return;
    if (typeof event.data.page !== "string" || !pages.has(event.data.page)) return;
    next(event.data.page);
  });

  window.addEventListener("popstate", event => {
    const route = event.state && event.state.birthdayPage;
    pageFrame.src = typeof route === "string" ? route : location.pathname + location.search;
  });
}
