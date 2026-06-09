const SPORT_OPTIONS = {
  any: {
    label: "Любой спорт",
    osm: [],
    groupName: "смешанная тренировка",
  },
  soccer: {
    label: "Футбол",
    osm: ["soccer", "football", "futsal"],
    groupName: "футбольная команда",
  },
  basketball: {
    label: "Баскетбол",
    osm: ["basketball"],
    groupName: "баскетбольная пятёрка",
  },
  volleyball: {
    label: "Волейбол",
    osm: ["volleyball", "beachvolleyball"],
    groupName: "волейбольная команда",
  },
  tennis: {
    label: "Теннис",
    osm: ["tennis"],
    groupName: "пара на корт",
  },
  running: {
    label: "Бег",
    osm: ["running", "athletics"],
    groupName: "беговая группа",
  },
  fitness: {
    label: "Фитнес",
    osm: ["fitness", "gymnastics", "exercise"],
    groupName: "группа фитнеса",
  },
  swimming: {
    label: "Плавание",
    osm: ["swimming"],
    groupName: "дорожка в бассейне",
  },
  badminton: {
    label: "Бадминтон",
    osm: ["badminton"],
    groupName: "игровая пара",
  },
  table_tennis: {
    label: "Настольный теннис",
    osm: ["table_tennis"],
    groupName: "пара у стола",
  },
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

const COACHES = [
  "Алексей К.",
  "Марина С.",
  "Игорь В.",
  "Елена П.",
  "Никита Р.",
];

const DEFAULT_LOCATION = {
  label: "Москва, Парк Горького",
  lat: 55.7299,
  lon: 37.6033,
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";
const STORAGE_KEY = "sport-nearby-state-v1";

const state = {
  request: null,
  location: null,
  manualCoords: null,
  venues: [],
  selectedVenueId: null,
  weather: null,
  noticeMode: "",
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
  elements.apiLine = document.querySelector("#apiLine");
  elements.statusSteps = document.querySelector("#statusSteps");
  elements.participantStatus = document.querySelector("#participantStatus");
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
  elements.geoButton.addEventListener("click", useBrowserLocation);
  elements.locationInput.addEventListener("input", () => {
    state.manualCoords = null;
  });
  elements.teamSizeInput.addEventListener("input", () => {
    elements.teamSizeOutput.value = formatPeople(Number(elements.teamSizeInput.value));
  });
  elements.resultsList.addEventListener("click", handleResultClick);
  elements.partnerForm.addEventListener("submit", handlePartnerSlot);
}

function setDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const value = toDateInputValue(tomorrow);
  elements.dateInput.value = value;
  elements.dateInput.min = toDateInputValue(new Date());
}

function restoreState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved.partnerSlots) {
      state.partnerSlots = saved.partnerSlots;
    }
  } catch {
    state.partnerSlots = [];
  }
  if (!Array.isArray(state.partnerSlots)) {
    state.partnerSlots = [];
  }
}

function persistState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      partnerSlots: state.partnerSlots,
      selectedVenueId: state.selectedVenueId,
    }),
  );
}

function renderInitial() {
  elements.teamSizeOutput.value = formatPeople(Number(elements.teamSizeInput.value));
  updateMap(DEFAULT_LOCATION);
  renderStatus();
  renderPartnerSlotsOnly();
}

async function handleSearch(event) {
  event.preventDefault();
  const request = collectRequest();
  state.request = request;
  state.selectedVenueId = null;
  setLoading(true);
  setNotice("Ищем координаты, площадки и погодные условия...", "");
  renderStatus();

  try {
    const location = state.manualCoords || (await geocodeLocation(request.location));
    state.location = location;
    updateMap(location);

    const [venueResult, weather] = await Promise.all([
      fetchSportsVenues(location, request),
      fetchWeather(location, request),
    ]);

    state.weather = weather;
    state.venues = enrichVenues(venueResult.venues, request, location, venueResult.source);
    state.venues = mergePartnerSlots(state.venues, request, location);

    if (!state.venues.length) {
      state.venues = enrichVenues(makeFallbackVenues(location), request, location, "demo");
      setNotice(
        "В OpenStreetMap рядом не нашлось подходящих объектов. Показаны демо-варианты около выбранной точки, чтобы можно было оценить сценарий.",
        "is-error",
      );
    } else if (venueResult.source === "api") {
      setNotice(
        `Найдено ${state.venues.length} вариантов рядом. Органические площадки пришли из OpenStreetMap через Overpass API.`,
        "is-success",
      );
    } else {
      setNotice(
        "Публичный API сейчас не ответил. Показаны демо-варианты около выбранной точки, рекламные слоты остались локальными.",
        "is-error",
      );
    }

    renderResults();
    renderWeather();
    renderStatus();
  } catch (error) {
    state.venues = enrichVenues(makeFallbackVenues(DEFAULT_LOCATION), request, DEFAULT_LOCATION, "demo");
    state.weather = null;
    updateMap(DEFAULT_LOCATION);
    setNotice(
      `Не удалось получить данные API: ${error.message}. Показан демо-сценарий, чтобы интерфейс оставался рабочим.`,
      "is-error",
    );
    renderResults();
    renderWeather();
    renderStatus();
  } finally {
    setLoading(false);
  }
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

async function useBrowserLocation() {
  if (!navigator.geolocation) {
    setNotice("Браузер не поддерживает геолокацию. Введите адрес или район вручную.", "is-error");
    return;
  }

  elements.geoButton.disabled = true;
  elements.geoButton.textContent = "Ждём";
  setNotice("Запрашиваем разрешение на геолокацию...", "");

  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 120000,
      });
    });
    state.manualCoords = {
      label: "Моё местоположение",
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    elements.locationInput.value = "Моё местоположение";
    updateMap(state.manualCoords);
    setNotice("Геолокация получена. Теперь нажмите «Найти варианты».", "is-success");
  } catch {
    setNotice("Не удалось получить геолокацию. Введите город, район или адрес вручную.", "is-error");
  } finally {
    elements.geoButton.disabled = false;
    elements.geoButton.textContent = "GPS";
  }
}

async function geocodeLocation(query) {
  if (query.toLowerCase() === "моё местоположение" && state.manualCoords) {
    return state.manualCoords;
  }

  const url = new URL(NOMINATIM_URL);
  url.search = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    addressdetails: "1",
    "accept-language": "ru",
  }).toString();

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim вернул ${response.status}`);
  }

  const data = await response.json();
  if (!data.length) {
    throw new Error("адрес не найден");
  }

  return {
    label: data[0].display_name || query,
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
  };
}

async function fetchSportsVenues(location, request) {
  const query = buildOverpassQuery(location, 5200);
  const body = new URLSearchParams({ data: query });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 24000);

  try {
    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      body,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(`Overpass вернул ${response.status}`);
    }

    const data = await response.json();
    const venues = normalizeOverpassElements(data.elements || [], location, request);
    return { source: "api", venues };
  } catch (error) {
    console.warn("Overpass failed", error);
    return { source: "demo", venues: makeFallbackVenues(location) };
  } finally {
    window.clearTimeout(timeout);
  }
}

function buildOverpassQuery(location, radius) {
  return `
    [out:json][timeout:25];
    (
      node(around:${radius},${location.lat},${location.lon})["leisure"~"^(pitch|sports_centre|fitness_centre|stadium|track)$"];
      way(around:${radius},${location.lat},${location.lon})["leisure"~"^(pitch|sports_centre|fitness_centre|stadium|track)$"];
      relation(around:${radius},${location.lat},${location.lon})["leisure"~"^(pitch|sports_centre|fitness_centre|stadium|track)$"];
      node(around:${radius},${location.lat},${location.lon})["sport"];
      way(around:${radius},${location.lat},${location.lon})["sport"];
      relation(around:${radius},${location.lat},${location.lon})["sport"];
    );
    out center tags 80;
  `;
}

function normalizeOverpassElements(elementsList, location, request) {
  const unique = new Map();
  for (const item of elementsList) {
    const tags = item.tags || {};
    const lat = Number(item.lat || item.center?.lat);
    const lon = Number(item.lon || item.center?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      continue;
    }

    const key = `${item.type}-${item.id}`;
    if (unique.has(key)) {
      continue;
    }

    const venue = {
      id: key,
      osmType: item.type,
      osmId: item.id,
      source: "api",
      name: tags.name || fallbackVenueName(tags, request),
      address: formatAddress(tags),
      lat,
      lon,
      tags,
      distance: distanceMeters(location.lat, location.lon, lat, lon),
      sportText: readableSport(tags, request),
      facilityType: readableFacility(tags),
      osmUrl: `https://www.openstreetmap.org/${item.type}/${item.id}`,
    };

    if (matchesSport(venue, request.sport)) {
      unique.set(key, venue);
    }
  }

  return Array.from(unique.values())
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12);
}

function matchesSport(venue, sportKey) {
  if (sportKey === "any") {
    return true;
  }
  const tags = venue.tags || {};
  const sports = String(tags.sport || "")
    .toLowerCase()
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const expected = SPORT_OPTIONS[sportKey].osm;
  if (sports.some((item) => expected.includes(item))) {
    return true;
  }
  if (sportKey === "fitness" && tags.leisure === "fitness_centre") {
    return true;
  }
  if (sportKey === "running" && tags.leisure === "track") {
    return true;
  }
  return tags.leisure === "sports_centre" && sports.length === 0;
}

async function fetchWeather(location, request) {
  const url = new URL(OPEN_METEO_URL);
  url.search = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lon),
    hourly: "temperature_2m,precipitation_probability,wind_speed_10m",
    timezone: "auto",
    forecast_days: "7",
  }).toString();

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Open-Meteo вернул ${response.status}`);
    }
    const data = await response.json();
    return pickWeatherHour(data.hourly, request);
  } catch (error) {
    console.warn("Open-Meteo failed", error);
    return null;
  }
}

function pickWeatherHour(hourly, request) {
  if (!hourly?.time?.length) {
    return null;
  }
  const target = new Date(`${request.date}T${request.time || "19:00"}`);
  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  hourly.time.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - target.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return {
    time: hourly.time[bestIndex],
    temperature: hourly.temperature_2m?.[bestIndex],
    precipitation: hourly.precipitation_probability?.[bestIndex],
    wind: hourly.wind_speed_10m?.[bestIndex],
  };
}

function enrichVenues(venues, request, location, source) {
  return venues
    .map((venue, index) => {
      const target = request.needTeam ? request.teamSize : Math.max(2, Math.min(request.teamSize, 4));
      const joined = Math.min(target - 1, 2 + ((index * 3 + request.teamSize) % Math.max(2, target - 1)));
      const coachName = request.needCoach ? COACHES[index % COACHES.length] : null;
      const score = Math.max(62, Math.round(96 - venue.distance / 190 + (venue.source === "ad" ? 8 : 0)));
      return {
        ...venue,
        source: venue.source || source,
        target,
        joined,
        missing: Math.max(0, target - joined),
        score: Math.min(99, score),
        coachName,
        participants: makeParticipants(joined, index),
        startsAt: `${request.date} ${request.time}`,
        groupName: SPORT_OPTIONS[request.sport].groupName,
      };
    })
    .sort((a, b) => b.score - a.score || a.distance - b.distance);
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

function mergePartnerSlots(venues, request, location) {
  const matchingSlots = state.partnerSlots
    .filter((slot) => slot.sport === "any" || request.sport === "any" || slot.sport === request.sport)
    .map((slot, index) => ({
      id: slot.id,
      source: "ad",
      name: slot.name,
      address: slot.slot,
      lat: slot.lat || location.lat + 0.004 + index * 0.001,
      lon: slot.lon || location.lon + 0.004 - index * 0.001,
      distance: distanceMeters(location.lat, location.lon, slot.lat || location.lat, slot.lon || location.lon),
      sportText: SPORT_OPTIONS[slot.sport]?.label || "Любой спорт",
      facilityType: "Рекламный слот площадки",
      osmUrl: "https://www.openstreetmap.org",
      tags: {},
    }));

  return [...matchingSlots, ...venues].slice(0, 14);
}

function makeFallbackVenues(location) {
  const base = [
    ["Городская спортивная площадка", "открытая площадка"],
    ["Фитнес-зал у парка", "зал рядом"],
    ["Мультиспорт-арена", "площадка для командных игр"],
    ["Школьный стадион", "поле и дорожки"],
    ["Клуб игровых видов спорта", "зал с тренером"],
    ["Дворовая площадка", "быстрый сбор команды"],
  ];

  return base.map(([name, type], index) => {
    const lat = location.lat + (index - 2) * 0.006;
    const lon = location.lon + (index % 3 - 1) * 0.008;
    return {
      id: `demo-${index}`,
      source: "demo",
      name,
      address: "Демо-вариант около выбранной точки",
      lat,
      lon,
      tags: {},
      distance: distanceMeters(location.lat, location.lon, lat, lon),
      sportText: "Спорт по заявке",
      facilityType: type,
      osmUrl: "https://www.openstreetmap.org",
    };
  });
}

function handleResultClick(event) {
  const button = event.target.closest("[data-join]");
  if (!button) {
    return;
  }

  const venue = state.venues.find((item) => item.id === button.dataset.join);
  if (!venue) {
    return;
  }

  state.selectedVenueId = venue.id;
  if (!venue.hasUser) {
    venue.hasUser = true;
    venue.joined = Math.min(venue.target, venue.joined + 1);
    venue.missing = Math.max(0, venue.target - venue.joined);
    venue.participants = [{ name: "Вы", initials: "В" }, ...venue.participants].slice(0, venue.target);
  }
  persistState();
  setNotice(`Заявка оформлена: ${venue.name}. Статус участников обновлён.`, "is-success");
  renderResults();
  renderStatus();
}

function handlePartnerSlot(event) {
  event.preventDefault();
  const name = elements.partnerName.value.trim();
  const slot = elements.partnerSlot.value.trim();
  const sport = elements.partnerSport.value;

  if (!name || !slot) {
    setNotice("Для рекламного слота нужны название площадки и свободное время.", "is-error");
    return;
  }

  const location = state.location || DEFAULT_LOCATION;
  state.partnerSlots.unshift({
    id: `ad-${Date.now()}`,
    name,
    slot,
    sport,
    lat: location.lat + 0.003,
    lon: location.lon - 0.003,
  });
  state.partnerSlots = state.partnerSlots.slice(0, 4);
  persistState();
  elements.partnerForm.reset();
  elements.partnerSport.value = "any";
  setNotice("Рекламный слот добавлен локально и будет показан в следующих результатах.", "is-success");

  if (state.request && state.location) {
    state.venues = mergePartnerSlots(
      state.venues.filter((item) => item.source !== "ad"),
      state.request,
      state.location,
    );
    renderResults();
    renderStatus();
  }
}

function renderPartnerSlotsOnly() {
  if (state.partnerSlots.length && !state.venues.length) {
    setNotice("Уже есть локальные рекламные слоты. Запустите поиск, чтобы увидеть их среди вариантов.", "");
  }
}

function renderResults() {
  const count = state.venues.length;
  elements.resultsTitle.textContent = count
    ? `${count} вариантов для заявки`
    : "Пока ждём заявку";

  elements.resultsList.innerHTML = state.venues.map(renderVenueCard).join("");
}

function renderVenueCard(venue) {
  const filled = Math.round((venue.joined / venue.target) * 100);
  const selected = state.selectedVenueId === venue.id;
  const sourceBadge = venue.source === "ad"
    ? '<span class="badge coral">Реклама площадки</span>'
    : venue.source === "api"
      ? '<span class="badge green">OpenStreetMap</span>'
      : '<span class="badge">Демо</span>';
  const coach = state.request?.needCoach
    ? `<span class="badge blue">Тренер: ${escapeHtml(venue.coachName || "ищем")}</span>`
    : "";
  const missingText = venue.missing === 0
    ? "группа готова"
    : `нужно ещё ${formatPeople(venue.missing).toLowerCase()}`;

  return `
    <article class="venue-card ${venue.source === "ad" ? "is-sponsored" : ""}">
      <div class="venue-top">
        <div>
          <h3>${escapeHtml(venue.name)}</h3>
          <div class="venue-meta">
            <span>${escapeHtml(venue.facilityType)}</span>
            <span>${formatDistance(venue.distance)}</span>
            <span>${escapeHtml(venue.sportText)}</span>
          </div>
        </div>
        <span class="badge ${venue.score > 85 ? "green" : "blue"}">${venue.score}% матч</span>
      </div>
      <div class="venue-meta">${escapeHtml(venue.address)}</div>
      <div>
        ${sourceBadge}
        ${coach}
        ${selected ? '<span class="badge green">Ваша заявка</span>' : ""}
      </div>
      <div class="team-meter">
        <div class="team-row">
          <strong>${escapeHtml(venue.groupName)}</strong>
          <span>${venue.joined}/${venue.target}: ${missingText}</span>
        </div>
        <div class="meter-track" aria-hidden="true">
          <div class="meter-fill" style="width: ${filled}%"></div>
        </div>
        <div class="team-row">
          <div class="avatar-stack">${venue.participants.slice(0, 5).map(renderAvatar).join("")}</div>
          <span>${escapeHtml(state.request?.startsAt || venue.startsAt)}</span>
        </div>
      </div>
      <div class="venue-actions">
        <button class="button button-primary" type="button" data-join="${escapeHtml(venue.id)}">
          ${selected ? "Обновить заявку" : "Оформить заявку"}
        </button>
        <a class="button button-ghost" href="${escapeAttribute(venue.osmUrl)}" target="_blank" rel="noreferrer">OSM</a>
      </div>
    </article>
  `;
}

function renderAvatar(person) {
  return `<span class="avatar" title="${escapeAttribute(person.name)}">${escapeHtml(person.initials)}</span>`;
}

function renderWeather() {
  if (!state.weather) {
    elements.weatherCard.textContent = "Погода недоступна";
    return;
  }
  const date = new Date(state.weather.time);
  elements.weatherCard.innerHTML = `
    <strong>${formatDateTime(date)}</strong><br>
    ${Math.round(state.weather.temperature)} °C,
    осадки ${Math.round(state.weather.precipitation ?? 0)}%,
    ветер ${Math.round(state.weather.wind ?? 0)} км/ч
  `;
}

function renderStatus() {
  const request = state.request;
  const selectedVenue = state.venues.find((item) => item.id === state.selectedVenueId) || state.venues[0];
  const hasResults = state.venues.length > 0;
  const hasSelected = Boolean(state.selectedVenueId);
  const teamMissing = selectedVenue?.missing ?? request?.teamSize ?? 0;

  const steps = [
    {
      title: "Заявка",
      body: request ? `${request.sportLabel}, ${request.date} ${request.time}` : "Выберите спорт, дату и район",
      state: request ? "done" : "active",
    },
    {
      title: "Площадка",
      body: hasResults ? `найдено вариантов: ${state.venues.length}` : "ищем объекты рядом",
      state: hasResults ? "done" : request ? "active" : "",
    },
    {
      title: "Команда",
      body: request?.needTeam
        ? teamMissing > 0
          ? `осталось собрать: ${formatPeople(teamMissing).toLowerCase()}`
          : "состав готов"
        : "не требуется",
      state: request?.needTeam ? (teamMissing > 0 ? "active" : "done") : "done",
    },
    {
      title: "Тренер",
      body: request?.needCoach
        ? selectedVenue?.coachName
          ? `кандидат: ${selectedVenue.coachName}`
          : "подбираем тренера"
        : "не требуется",
      state: request?.needCoach ? (selectedVenue?.coachName ? "done" : "active") : "done",
    },
    {
      title: "Подтверждение",
      body: hasSelected ? "заявка оформлена, ждём подтверждение площадки" : "выберите вариант",
      state: hasSelected ? "active" : "",
    },
  ];

  elements.statusSteps.innerHTML = steps.map(renderStatusStep).join("");

  if (!request) {
    elements.participantStatus.innerHTML = "";
    document.querySelector(".status-panel h2").textContent = "Заявка ещё не запущена";
    return;
  }

  document.querySelector(".status-panel h2").textContent = hasSelected
    ? "Поиск запущен"
    : "Варианты подготовлены";
  elements.participantStatus.innerHTML = renderParticipantRows(selectedVenue, request, hasSelected);
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

function renderParticipantRows(venue, request, hasSelected) {
  const venueName = venue?.name || "площадка ещё не выбрана";
  const teamText = venue
    ? venue.missing > 0
      ? `не хватает ${formatPeople(venue.missing).toLowerCase()}`
      : "состав готов"
    : "ожидаем результаты";
  const coachText = request.needCoach
    ? venue?.coachName
      ? `${venue.coachName} на подтверждении`
      : "ищем тренера"
    : "не нужен";

  return `
    <div class="participant-row"><strong>Вы</strong><span>${hasSelected ? "заявка оформлена" : "выбираете вариант"}</span></div>
    <div class="participant-row"><strong>Команда</strong><span>${escapeHtml(teamText)}</span></div>
    <div class="participant-row"><strong>Площадка</strong><span>${escapeHtml(venueName)}</span></div>
    <div class="participant-row"><strong>Тренер</strong><span>${escapeHtml(coachText)}</span></div>
  `;
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

function setLoading(isLoading) {
  const submit = elements.form.querySelector("[type='submit']");
  submit.disabled = isLoading;
  submit.textContent = isLoading ? "Ищем..." : "Найти варианты";
}

function setNotice(text, mode) {
  elements.notice.textContent = text;
  elements.notice.className = `notice ${mode || ""}`.trim();
}

function fallbackVenueName(tags, request) {
  if (tags.leisure === "fitness_centre") {
    return "Фитнес-зал";
  }
  if (tags.leisure === "sports_centre") {
    return "Спортивный центр";
  }
  if (tags.leisure === "track") {
    return "Беговая дорожка";
  }
  return `${SPORT_OPTIONS[request.sport].label} рядом`;
}

function readableFacility(tags) {
  const leisure = tags.leisure;
  if (leisure === "fitness_centre") {
    return "Фитнес-центр";
  }
  if (leisure === "sports_centre") {
    return "Спортивный центр";
  }
  if (leisure === "pitch") {
    return "Спортивная площадка";
  }
  if (leisure === "stadium") {
    return "Стадион";
  }
  if (leisure === "track") {
    return "Беговая зона";
  }
  return "Спортивный объект";
}

function readableSport(tags, request) {
  const sport = String(tags.sport || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
  return sport || request.sportLabel || "Спорт";
}

function formatAddress(tags) {
  const parts = [
    tags["addr:street"],
    tags["addr:housenumber"],
    tags["addr:city"],
  ].filter(Boolean);
  return parts.join(", ") || tags.operator || tags.description || "Адрес уточняется по карте";
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
  if (last === 1 && lastTwo !== 11) {
    word = "человек";
  } else if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
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

function formatDateTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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
