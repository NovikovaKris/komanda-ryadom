const SPORT_OPTIONS = {
  any: { label: "Любой спорт", groupName: "игра" },
  soccer: { label: "Футбол", groupName: "футбольная игра" },
  basketball: { label: "Баскетбол", groupName: "баскетбольная игра" },
  volleyball: { label: "Волейбол", groupName: "волейбольная игра" },
  tennis: { label: "Теннис", groupName: "теннисная встреча" },
  running: { label: "Бег", groupName: "беговая группа" },
  fitness: { label: "Фитнес", groupName: "фитнес-тренировка" },
  swimming: { label: "Плавание", groupName: "заплыв" },
  badminton: { label: "Бадминтон", groupName: "игра в бадминтон" },
  table_tennis: { label: "Настольный теннис", groupName: "игра в настольный теннис" },
};

const LEVEL_LABELS = {
  any: "любой уровень",
  beginner: "новички",
  middle: "средний уровень",
  advanced: "сильная группа",
};

const SAMPLE_NAMES = [
  "Анна",
  "Илья",
  "Мария",
  "Роман",
  "Дима",
  "Катя",
  "Олег",
  "Саша",
  "Ника",
  "Тимур",
  "Лена",
  "Павел",
  "Артём",
  "Юля",
];

const MOCK_GAMES = [
  {
    id: "volley-park-1900",
    sport: "volleyball",
    title: "Волейбол 6x6, нужен доигровщик",
    format: "6x6 зал",
    dateOffset: 1,
    time: "19:00",
    duration: "90 мин",
    level: "middle",
    target: 12,
    joined: 9,
    price: 450,
    venue: "Спортзал на Крымском Валу",
    district: "Парк Горького",
    address: "Крымский Вал, 9",
    lat: 55.7299,
    lon: 37.6033,
    sponsored: true,
  },
  {
    id: "volley-yard-2030",
    sport: "volleyball",
    title: "Вечерний микс 4x4",
    format: "4x4 улица",
    dateOffset: 1,
    time: "20:30",
    duration: "75 мин",
    level: "beginner",
    target: 8,
    joined: 6,
    price: 0,
    venue: "Площадка Нескучный сад",
    district: "Нескучный сад",
    address: "Ленинский проспект, 30",
    lat: 55.7203,
    lon: 37.5865,
  },
  {
    id: "volley-arena-1830",
    sport: "volleyball",
    title: "Средний плюс, игра до двух партий",
    format: "6x6 зал",
    dateOffset: 2,
    time: "18:30",
    duration: "2 часа",
    level: "advanced",
    target: 12,
    joined: 10,
    price: 650,
    venue: "Арена Якиманка",
    district: "Якиманка",
    address: "ул. Большая Якиманка, 22",
    lat: 55.7377,
    lon: 37.6123,
  },
  {
    id: "basket-park-2000",
    sport: "basketball",
    title: "Баскетбол 5x5, не хватает двоих",
    format: "5x5",
    dateOffset: 1,
    time: "20:00",
    duration: "90 мин",
    level: "middle",
    target: 10,
    joined: 8,
    price: 300,
    venue: "Площадка Музеон",
    district: "Якиманка",
    address: "Крымская набережная",
    lat: 55.7351,
    lon: 37.6052,
  },
  {
    id: "soccer-luzh-2100",
    sport: "soccer",
    title: "Футбол 7x7, сборная команда",
    format: "7x7",
    dateOffset: 1,
    time: "21:00",
    duration: "1 час",
    level: "any",
    target: 14,
    joined: 11,
    price: 550,
    venue: "Манеж Лужники",
    district: "Лужники",
    address: "Лужнецкая наб., 24",
    lat: 55.7158,
    lon: 37.5537,
    sponsored: true,
  },
  {
    id: "tennis-park-1100",
    sport: "tennis",
    title: "Теннис, ищем второго игрока",
    format: "одиночная игра",
    dateOffset: 2,
    time: "11:00",
    duration: "1 час",
    level: "beginner",
    target: 2,
    joined: 1,
    price: 900,
    venue: "Корт у парка",
    district: "Парк Горького",
    address: "Пушкинская набережная",
    lat: 55.7271,
    lon: 37.6002,
  },
  {
    id: "fitness-morning-0800",
    sport: "fitness",
    title: "Функциональная тренировка в мини-группе",
    format: "группа с тренером",
    dateOffset: 1,
    time: "08:00",
    duration: "55 мин",
    level: "any",
    target: 8,
    joined: 5,
    price: 700,
    venue: "Студия движения",
    district: "Октябрьская",
    address: "ул. Житная, 14",
    lat: 55.7315,
    lon: 37.616,
  },
];

const DEFAULT_LOCATION = {
  label: "Москва, Парк Горького",
  lat: 55.7299,
  lon: 37.6033,
};

const STORAGE_KEY = "sport-games-state-v1";

const state = {
  request: null,
  location: DEFAULT_LOCATION,
  games: [],
  selectedGameId: null,
  telegram: "",
  partnerGames: [],
};

const elements = {};

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  setDefaultDate();
  restoreState();
  bindEvents();
  renderInitial();
}

function cacheElements() {
  elements.form = document.querySelector("#searchForm");
  elements.locationInput = document.querySelector("#locationInput");
  elements.geoButton = document.querySelector("#geoButton");
  elements.sportSelect = document.querySelector("#sportSelect");
  elements.dateInput = document.querySelector("#dateInput");
  elements.timeInput = document.querySelector("#timeInput");
  elements.levelSelect = document.querySelector("#levelSelect");
  elements.needTeam = document.querySelector("#needTeam");
  elements.needVenue = document.querySelector("#needVenue");
  elements.needCoach = document.querySelector("#needCoach");
  elements.teamSizeInput = document.querySelector("#teamSizeInput");
  elements.teamSizeOutput = document.querySelector("#teamSizeOutput");
  elements.statusSteps = document.querySelector("#statusSteps");
  elements.participantStatus = document.querySelector("#participantStatus");
  elements.contactPanel = document.querySelector("#contactPanel");
  elements.contactTitle = document.querySelector("#contactTitle");
  elements.contactSummary = document.querySelector("#contactSummary");
  elements.telegramForm = document.querySelector("#telegramForm");
  elements.telegramInput = document.querySelector("#telegramInput");
  elements.contactSaved = document.querySelector("#contactSaved");
  elements.mapTitle = document.querySelector("#mapTitle");
  elements.mapFrame = document.querySelector("#mapFrame");
  elements.openMapLink = document.querySelector("#openMapLink");
  elements.resultsTitle = document.querySelector("#resultsTitle");
  elements.weatherCard = document.querySelector("#weatherCard");
  elements.notice = document.querySelector("#notice");
  elements.resultsList = document.querySelector("#resultsList");
  elements.partnerForm = document.querySelector("#partnerForm");
  elements.partnerName = document.querySelector("#partnerName");
  elements.partnerSlot = document.querySelector("#partnerSlot");
  elements.partnerSport = document.querySelector("#partnerSport");
}

function bindEvents() {
  elements.form.addEventListener("submit", handleSearch);
  elements.geoButton.addEventListener("click", useMockLocation);
  elements.teamSizeInput.addEventListener("input", () => {
    elements.teamSizeOutput.value = formatPeople(Number(elements.teamSizeInput.value));
  });
  elements.resultsList.addEventListener("click", handleResultClick);
  elements.telegramForm.addEventListener("submit", handleTelegramSubmit);
  elements.partnerForm.addEventListener("submit", handlePartnerGame);
}

function setDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const value = toDateInputValue(tomorrow);
  elements.dateInput.value = value;
  elements.dateInput.min = toDateInputValue(new Date());
  elements.sportSelect.value = "volleyball";
  elements.teamSizeInput.value = "12";
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.partnerGames = Array.isArray(saved.partnerGames) ? saved.partnerGames : [];
    state.telegram = saved.telegram || "";
  } catch {
    state.partnerGames = [];
    state.telegram = "";
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      partnerGames: state.partnerGames,
      telegram: state.telegram,
    }),
  );
}

function renderInitial() {
  elements.teamSizeOutput.value = formatPeople(Number(elements.teamSizeInput.value));
  updateMap(DEFAULT_LOCATION);
  state.games = buildMockGames(collectRequest(), DEFAULT_LOCATION).slice(0, 4);
  renderResults();
  renderStatus();
  renderContactPanel();
  setNotice("Выберите игру из моковой ленты или уточните спорт, дату и время.", "");
}

function handleSearch(event) {
  event.preventDefault();
  const request = collectRequest();
  const location = resolveMockLocation(request.location);
  state.request = request;
  state.location = location;
  state.selectedGameId = null;
  state.games = buildMockGames(request, location);

  updateMap(location);
  renderResults();
  renderWeather();
  renderStatus();
  renderContactPanel();

  setNotice(
    `Подобрали ${state.games.length} игр. Это моковые данные: можно проверить сценарий без backend и реальных заявок.`,
    "is-success",
  );
}

function collectRequest() {
  const sport = elements.sportSelect.value;
  return {
    location: elements.locationInput.value.trim() || DEFAULT_LOCATION.label,
    sport,
    sportLabel: SPORT_OPTIONS[sport].label,
    date: elements.dateInput.value,
    time: elements.timeInput.value || "19:00",
    level: elements.levelSelect.value,
    levelLabel: LEVEL_LABELS[elements.levelSelect.value],
    needTeam: elements.needTeam.checked,
    needVenue: elements.needVenue.checked,
    needCoach: elements.needCoach.checked,
    teamSize: Number(elements.teamSizeInput.value),
  };
}

function useMockLocation() {
  elements.locationInput.value = "Москва, рядом со мной";
  state.location = {
    label: "Москва, рядом со мной",
    lat: 55.7299,
    lon: 37.6033,
  };
  updateMap(state.location);
  setNotice("В прототипе GPS имитируется моковой точкой около Парка Горького.", "is-success");
}

function resolveMockLocation(value) {
  const text = value.toLowerCase();
  if (text.includes("луж")) {
    return { label: value, lat: 55.7158, lon: 37.5537 };
  }
  if (text.includes("октя")) {
    return { label: value, lat: 55.7312, lon: 37.6128 };
  }
  return { label: value || DEFAULT_LOCATION.label, lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon };
}

function buildMockGames(request, location) {
  const baseDate = parseDateInput(request.date);
  const games = [...state.partnerGames, ...MOCK_GAMES]
    .filter((game) => request.sport === "any" || game.sport === request.sport)
    .filter((game) => request.level === "any" || game.level === "any" || game.level === request.level)
    .map((game, index) => hydrateGame(game, request, location, baseDate, index))
    .filter((game) => isCloseEnough(game, request))
    .sort((a, b) => {
      if (a.missing !== b.missing) return a.missing - b.missing;
      if (a.sponsored !== b.sponsored) return a.sponsored ? -1 : 1;
      return a.distance - b.distance;
    });

  if (games.length) {
    return games;
  }

  return makeFallbackGames(request, location, baseDate);
}

function hydrateGame(game, request, location, baseDate, index) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + Number(game.dateOffset || 0));
  const target = Math.max(game.target, request.teamSize > 2 ? Math.min(request.teamSize, game.target) : game.target);
  const joined = Math.min(target - 1, game.joined);
  const distance = distanceMeters(location.lat, location.lon, game.lat, game.lon);

  return {
    ...game,
    id: game.id || `partner-${index}`,
    date: toDateInputValue(date),
    dateLabel: formatShortDate(date),
    target,
    joined,
    missing: Math.max(0, target - joined),
    participants: makeParticipants(joined, index),
    distance,
    score: calculateGameScore(game, request, distance),
    source: game.sponsored ? "ad" : "mock",
    coachName: request.needCoach ? ["Алексей К.", "Марина С.", "Елена П."][index % 3] : null,
  };
}

function isCloseEnough(game, request) {
  if (request.time === game.time) {
    return true;
  }
  const requested = toMinutes(request.time);
  const actual = toMinutes(game.time);
  return Math.abs(requested - actual) <= 180;
}

function makeFallbackGames(request, location, baseDate) {
  const sport = request.sport === "any" ? "volleyball" : request.sport;
  return [
    {
      id: "fallback-game-1",
      sport,
      title: `${SPORT_OPTIONS[sport].label}: собираем игру под ваш слот`,
      format: request.sport === "volleyball" ? "6x6 зал" : "игра по заявке",
      dateOffset: 0,
      time: request.time,
      duration: "90 мин",
      level: request.level,
      target: request.teamSize,
      joined: Math.max(1, request.teamSize - 4),
      price: 0,
      venue: "Площадка уточняется",
      district: location.label,
      address: "После набора покажем 2-3 варианта",
      lat: location.lat,
      lon: location.lon,
    },
  ].map((game, index) => hydrateGame(game, request, location, baseDate, index));
}

function calculateGameScore(game, request, distance) {
  let score = 72;
  if (game.sport === request.sport) score += 12;
  if (game.level === request.level || game.level === "any" || request.level === "any") score += 7;
  score += Math.max(0, 10 - Math.round(distance / 650));
  score += Math.max(0, 8 - Math.abs(toMinutes(game.time) - toMinutes(request.time)) / 30);
  if (game.sponsored) score += 3;
  return Math.min(99, Math.round(score));
}

function handleResultClick(event) {
  const button = event.target.closest("[data-join]");
  if (!button) {
    return;
  }

  const game = state.games.find((item) => item.id === button.dataset.join);
  if (!game) {
    return;
  }

  state.selectedGameId = game.id;
  if (!game.hasUser) {
    game.hasUser = true;
    game.joined = Math.min(game.target, game.joined + 1);
    game.missing = Math.max(0, game.target - game.joined);
    game.participants = [{ name: "Вы", initials: "В" }, ...game.participants].slice(0, game.target);
  }

  setNotice(`Заявка на игру оформлена: ${game.title}. Оставьте Telegram, чтобы вас добавили в чат.`, "is-success");
  renderResults();
  renderStatus();
  renderContactPanel();
  elements.contactPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleTelegramSubmit(event) {
  event.preventDefault();
  const value = elements.telegramInput.value.trim();
  if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(value)) {
    elements.contactSaved.textContent = "Введите Telegram username, например @volley_player.";
    elements.contactSaved.className = "form-feedback is-error";
    return;
  }

  state.telegram = value.startsWith("@") ? value : `@${value}`;
  persistState();
  elements.contactSaved.textContent = `Telegram сохранён: ${state.telegram}. В MVP это локальная имитация заявки.`;
  elements.contactSaved.className = "form-feedback is-success";
  renderStatus();
}

function handlePartnerGame(event) {
  event.preventDefault();
  const name = elements.partnerName.value.trim();
  const slot = elements.partnerSlot.value.trim();
  const sport = elements.partnerSport.value === "any" ? "volleyball" : elements.partnerSport.value;

  if (!name || !slot) {
    setNotice("Для рекламной игры нужны название площадки и свободный слот.", "is-error");
    return;
  }

  const request = collectRequest();
  state.partnerGames.unshift({
    id: `ad-game-${Date.now()}`,
    sport,
    title: `${SPORT_OPTIONS[sport].label}: рекламный слот от площадки`,
    format: sport === "volleyball" ? "6x6 зал" : "игра по слоту",
    dateOffset: 0,
    time: parseSlotTime(slot) || request.time,
    duration: "90 мин",
    level: "any",
    target: sport === "volleyball" ? 12 : request.teamSize,
    joined: sport === "volleyball" ? 8 : Math.max(2, request.teamSize - 3),
    price: 500,
    venue: name,
    district: "рядом с пользователем",
    address: slot,
    lat: state.location.lat + 0.003,
    lon: state.location.lon - 0.003,
    sponsored: true,
  });
  state.partnerGames = state.partnerGames.slice(0, 4);
  persistState();
  elements.partnerForm.reset();
  elements.partnerSport.value = "any";
  setNotice("Рекламная игра добавлена в моковую ленту и будет показана в поиске.", "is-success");

  state.request = request;
  state.games = buildMockGames(request, state.location);
  renderResults();
  renderStatus();
}

function renderResults() {
  const count = state.games.length;
  elements.resultsTitle.textContent = count
    ? `${count} игр под ваш запрос`
    : "Пока ждём заявку";

  elements.resultsList.innerHTML = state.games.map(renderGameCard).join("");
}

function renderGameCard(game) {
  const filled = Math.round((game.joined / game.target) * 100);
  const selected = state.selectedGameId === game.id;
  const sourceBadge = game.source === "ad"
    ? '<span class="badge coral">Реклама площадки</span>'
    : '<span class="badge green">Моковая игра</span>';
  const missingText = game.missing === 0
    ? "состав готов"
    : `нужно ещё ${formatPeople(game.missing).toLowerCase()}`;
  const coach = game.coachName
    ? `<span class="badge blue">Тренер: ${escapeHtml(game.coachName)}</span>`
    : "";

  return `
    <article class="game-card ${game.source === "ad" ? "is-sponsored" : ""}">
      <div class="game-top">
        <div>
          <div class="venue-meta">
            <span>${escapeHtml(SPORT_OPTIONS[game.sport].label)}</span>
            <span>${escapeHtml(game.format)}</span>
            <span>${escapeHtml(game.level === "any" ? "любой уровень" : LEVEL_LABELS[game.level])}</span>
          </div>
          <h3>${escapeHtml(game.title)}</h3>
        </div>
        <span class="badge ${game.missing <= 2 ? "green" : "blue"}">${game.score}% матч</span>
      </div>

      <div class="game-facts" aria-label="Параметры игры">
        <div><strong>${escapeHtml(game.dateLabel)}</strong><span>дата</span></div>
        <div><strong>${escapeHtml(game.time)}</strong><span>старт</span></div>
        <div><strong>${game.joined}/${game.target}</strong><span>участники</span></div>
        <div><strong>${game.missing}</strong><span>нужно ещё</span></div>
      </div>

      <div class="team-meter">
        <div class="team-row">
          <strong>${missingText}</strong>
          <span>${escapeHtml(game.duration)} · ${game.price ? `${game.price} ₽` : "бесплатно"}</span>
        </div>
        <div class="meter-track" aria-hidden="true">
          <div class="meter-fill" style="width: ${filled}%"></div>
        </div>
        <div class="team-row">
          <div class="avatar-stack">${game.participants.slice(0, 5).map(renderAvatar).join("")}</div>
          <span>${escapeHtml(game.venue)} · ${formatDistance(game.distance)}</span>
        </div>
      </div>

      <div>
        ${sourceBadge}
        ${coach}
        ${selected ? '<span class="badge green">Ваша заявка</span>' : ""}
      </div>

      <div class="venue-meta">${escapeHtml(game.address)}</div>

      <div class="venue-actions">
        <button class="button button-primary" type="button" data-join="${escapeHtml(game.id)}">
          ${selected ? "Заявка оформлена" : "Хочу в игру"}
        </button>
        <a class="button button-ghost" href="${escapeAttribute(makeMapLink(game))}" target="_blank" rel="noreferrer">Карта</a>
      </div>
    </article>
  `;
}

function renderAvatar(person) {
  return `<span class="avatar" title="${escapeAttribute(person.name)}">${escapeHtml(person.initials)}</span>`;
}

function renderWeather() {
  if (!state.request) {
    elements.weatherCard.textContent = "Подсказка появится после поиска";
    return;
  }
  const best = state.games[0];
  elements.weatherCard.innerHTML = best
    ? `<strong>Лучший слот</strong><br>${escapeHtml(best.dateLabel)}, ${escapeHtml(best.time)} · ${best.joined}/${best.target}, нужно ещё ${best.missing}`
    : "Подходящих игр пока нет";
}

function renderStatus() {
  const request = state.request;
  const selectedGame = state.games.find((item) => item.id === state.selectedGameId);
  const suggestedGame = selectedGame || state.games[0];
  const hasResults = state.games.length > 0;
  const hasSelected = Boolean(selectedGame);

  const steps = [
    {
      title: "Запрос",
      body: request ? `${request.sportLabel}, ${request.date} ${request.time}` : "Выберите спорт, дату и район",
      state: request ? "done" : "active",
    },
    {
      title: "Игры",
      body: hasResults ? `подобрано игр: ${state.games.length}` : "готовим моковую ленту",
      state: hasResults ? "done" : request ? "active" : "",
    },
    {
      title: "Место в составе",
      body: suggestedGame
        ? suggestedGame.missing > 0
          ? `не хватает: ${formatPeople(suggestedGame.missing).toLowerCase()}`
          : "состав готов"
        : "выберите игру",
      state: hasSelected ? "done" : hasResults ? "active" : "",
    },
    {
      title: "Telegram",
      body: state.telegram ? `${state.telegram} сохранён` : hasSelected ? "оставьте контакт для чата" : "появится после заявки",
      state: state.telegram ? "done" : hasSelected ? "active" : "",
    },
    {
      title: "Чат игры",
      body: state.telegram ? "в MVP имитируем добавление в чат" : "ждём Telegram",
      state: state.telegram ? "active" : "",
    },
  ];

  elements.statusSteps.innerHTML = steps.map(renderStatusStep).join("");

  if (!request && !hasResults) {
    elements.participantStatus.innerHTML = "";
    document.querySelector(".status-panel h2").textContent = "Заявка ещё не запущена";
    return;
  }

  document.querySelector(".status-panel h2").textContent = hasSelected
    ? "Заявка на игру"
    : "Игры подобраны";
  elements.participantStatus.innerHTML = renderParticipantRows(suggestedGame, hasSelected);
}

function renderStatusStep(step, index) {
  const className = step.state === "done" ? "is-done" : step.state === "active" ? "is-active" : "";
  return `
    <li class="status-step ${className}">
      <span class="status-dot">${index + 1}</span>
      <span>
        <strong>${escapeHtml(step.title)}</strong>
        <small>${escapeHtml(step.body)}</small>
      </span>
    </li>
  `;
}

function renderParticipantRows(game, hasSelected) {
  if (!game) {
    return "";
  }
  const contactText = state.telegram || "Telegram не указан";
  return `
    <div class="participant-row"><strong>Игра</strong><span>${escapeHtml(game.title)}</span></div>
    <div class="participant-row"><strong>Участники</strong><span>${game.joined}/${game.target}, нужно ещё ${game.missing}</span></div>
    <div class="participant-row"><strong>Площадка</strong><span>${escapeHtml(game.venue)}</span></div>
    <div class="participant-row"><strong>Вы</strong><span>${hasSelected ? escapeHtml(contactText) : "выбираете игру"}</span></div>
  `;
}

function renderContactPanel() {
  const game = state.games.find((item) => item.id === state.selectedGameId);
  elements.contactPanel.hidden = !game;
  if (!game) {
    elements.contactSaved.textContent = "";
    return;
  }
  elements.contactTitle.textContent = "Куда добавить вас в чат игры";
  elements.contactSummary.textContent = `${game.title} · ${game.dateLabel}, ${game.time} · ${game.joined}/${game.target}`;
  elements.telegramInput.value = state.telegram;
  elements.contactSaved.textContent = state.telegram
    ? `Telegram сохранён: ${state.telegram}.`
    : "После отправки команда увидит ваш контакт в моковом статусе.";
  elements.contactSaved.className = state.telegram ? "form-feedback is-success" : "form-feedback";
}

function updateMap(location) {
  const delta = 0.045;
  const bbox = [
    location.lon - delta,
    location.lat - delta,
    location.lon + delta,
    location.lat + delta,
  ].join(",");
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lon}`;
  const openUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}#map=14/${location.lat}/${location.lon}`;
  elements.mapFrame.src = mapUrl;
  elements.openMapLink.href = openUrl;
  elements.mapTitle.textContent = location.label;
}

function makeMapLink(game) {
  return `https://www.openstreetmap.org/?mlat=${game.lat}&mlon=${game.lon}#map=16/${game.lat}/${game.lon}`;
}

function setNotice(text, mode) {
  elements.notice.textContent = text;
  elements.notice.className = `notice ${mode || ""}`.trim();
}

function makeParticipants(count, offset) {
  return Array.from({ length: count }, (_, index) => {
    const name = SAMPLE_NAMES[(index + offset) % SAMPLE_NAMES.length];
    return {
      name,
      initials: name.slice(0, 1).toUpperCase(),
    };
  });
}

function parseSlotTime(slot) {
  const match = slot.match(/([01]?\d|2[0-3]):([0-5]\d)/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

function parseDateInput(value) {
  if (!value) {
    return new Date();
  }
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toMinutes(value) {
  const [hours, minutes] = String(value || "00:00").split(":").map(Number);
  return hours * 60 + minutes;
}

function distanceMeters(lat1, lon1, lat2, lon2) {
  const radius = 6371000;
  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) {
    return "рядом";
  }
  if (meters < 1000) {
    return `${Math.round(meters)} м`;
  }
  return `${(meters / 1000).toFixed(1)} км`;
}

function formatPeople(count) {
  const value = Math.abs(Number(count));
  const last = value % 10;
  const lastTwo = value % 100;
  let word = "человек";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    word = "человека";
  }
  return `${count} ${word}`;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
