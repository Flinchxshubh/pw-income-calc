const STORAGE_KEY = 'pw-income-calc-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    return {
      ...defaultState(),
      ...parsed,
      entries,
      settings: { ...defaultState().settings, ...(parsed.settings && typeof parsed.settings === 'object' ? parsed.settings : {}) },
    };
  } catch {
    return defaultState();
  }
}

function defaultState() {
  return {
    entries: [],
    settings: {
      darkMode: false,
      defaultCriteria: 54,
      language: 'en',
    },
  };
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function addEntry(entry) {
  const state = loadState();
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random().toString(16).slice(2);
  state.entries.push({
    id,
    createdAt: new Date().toISOString(),
    date: entry.date,
    hours: entry.hours,
    minutes: entry.minutes,
    calls: entry.calls,
    criteria: entry.criteria,
    tt: entry.tt,
    cc: entry.cc,
    kra: entry.kra,
    group: entry.group,
    pay: entry.pay,
  });
  saveState(state);
  return id;
}

function clearAllEntries() {
  const state = loadState();
  state.entries = [];
  saveState(state);
}

function sumPayForMonth(year, monthIndex0) {
  const state = loadState();
  let total = 0;
  for (const e of state.entries) {
    const d = new Date(e.date + 'T12:00:00');
    if (d.getFullYear() === year && d.getMonth() === monthIndex0) total += Number(e.pay) || 0;
  }
  return total;
}

function entriesForMonth(year, monthIndex0) {
  const state = loadState();
  return state.entries.filter((e) => {
    const d = new Date(e.date + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === monthIndex0;
  });
}

/** YYYY-MM-DD -> total pay that day (for calendar) */
function getPayMapForMonth(year, monthIndex0) {
  const state = loadState();
  const map = {};
  for (const e of state.entries) {
    const d = new Date(e.date + 'T12:00:00');
    if (d.getFullYear() !== year || d.getMonth() !== monthIndex0) continue;
    const key = e.date;
    map[key] = (map[key] || 0) + (Number(e.pay) || 0);
  }
  return map;
}

function getAllEntriesSorted() {
  const state = loadState();
  return [...state.entries].sort((a, b) => {
    const da = a.date + (a.createdAt || '');
    const db = b.date + (b.createdAt || '');
    return db.localeCompare(da);
  });
}

function getSettings() {
  return loadState().settings;
}

function updateSettings(partial) {
  const state = loadState();
  state.settings = { ...state.settings, ...partial };
  saveState(state);
}
