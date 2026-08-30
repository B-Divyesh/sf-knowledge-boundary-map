const root = document.documentElement;
const button = document.querySelector('#theme-toggle');
const applyTheme = (theme) => {
  root.dataset.theme = theme;
  button.setAttribute('aria-label', `Use ${theme === 'dark' ? 'light' : 'dark'} theme`);
  button.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
};
applyTheme(localStorage.getItem('kbm:theme') === 'dark' ? 'dark' : 'light');
button.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('kbm:theme', next);
  applyTheme(next);
});
