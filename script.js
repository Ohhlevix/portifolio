async function loadJSON(path) {
  const response = await fetch(path, { cache: "no-cache" });

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}: ${response.status}`);
  }

  return response.json();
}

async function renderBackground() {
  const layer = document.getElementById("bg-layer");
  const animations = ["drift-a", "drift-b", "drift-c"];

  try {
    const images = await loadJSON("config/backgrounds.json");

    images.forEach((src, index) => {
      const el = document.createElement("div");

      el.className = "bg-image";
      el.style.backgroundImage = `url("${src}")`;
      el.style.opacity = (0.05 + Math.random() * 0.05).toFixed(2);
      el.style.top = `${Math.random() * 60}%`;
      el.style.left = `${Math.random() * 60}%`;
      el.style.animation = `${animations[index % animations.length]} ${28 + index * 6}s ease-in-out infinite`;
      el.style.animationDelay = `${index * -4}s`;

      layer.appendChild(el);
    });

  } catch (error) {
    console.warn(error);
  }
}

async function renderProfile() {
  const container = document.getElementById("profile");

  try {
    const profile = await loadJSON("config/profile.json");

    const avatar = document.createElement("img");
    avatar.className = "profile__avatar";
    avatar.src = profile.avatar;
    avatar.alt = profile.name;
    avatar.width = 84;
    avatar.height = 84;

    const name = document.createElement("h1");
    name.className = "profile__name";
    name.textContent = profile.name;

    const bio = document.createElement("p");
    bio.className = "profile__bio";
    bio.textContent = profile.bio;

    container.append(
      avatar,
      name,
      bio
    );

  } catch (error) {
    console.warn(error);
  }
}

async function renderQuote() {
  try {
    const quotes = await loadJSON("config/quotes.json");

    let index = Math.floor(Math.random() * quotes.length);

    const last = Number(localStorage.getItem("lastQuote"));

    while (quotes.length > 1 && index === last) {
      index = Math.floor(Math.random() * quotes.length);
    }

    localStorage.setItem("lastQuote", index);

    document.getElementById("quote").textContent = quotes[index];

  } catch (error) {
    console.warn(error);
  }
}

function createArrowIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  svg.classList.add("link-item__arrow");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  path.setAttribute("d", "M7 17 17 7M9 7h8v8");

  svg.appendChild(path);

  return svg;
}

async function renderLinks() {
  const container = document.getElementById("links");

  try {
    const links = await loadJSON("config/links.json");

    links.forEach((link) => {
      const anchor = document.createElement("a");

      anchor.className = "link-item";
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";

      const icon = document.createElement("span");
      icon.className = "link-item__icon";
      icon.style.webkitMaskImage = `url("${link.icon}")`;
      icon.style.maskImage = `url("${link.icon}")`;

      const name = document.createElement("span");
      name.className = "link-item__name";
      name.textContent = link.name;

      anchor.append(icon, name, createArrowIcon());

      container.appendChild(anchor);
    });

  } catch (error) {
    console.warn(error);
  }
}

function renderFooterYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderBackground();
  await renderProfile();
  await renderQuote();
  await renderLinks();
  renderFooterYear();
});