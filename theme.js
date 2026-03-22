function applyThemeFromStorage() {
  const s = getSettings();
  const dark = s.darkMode;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#0f172a' : '#2563eb');
}

function toggleDarkMode() {
  const s = getSettings();
  updateSettings({ darkMode: !s.darkMode });
  applyThemeFromStorage();
}
