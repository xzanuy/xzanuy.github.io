import { copy } from './copy.js';
import { visibleProjects as projects } from './projects.js';
import { heading, renderArchive, renderCase, renderProjects, renderServices, renderStrengths } from './views.js';

const dialog = document.querySelector('#case-dialog');
const caseContent = document.querySelector('#case-content');
const closeButton = document.querySelector('.close-case');
let language = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'es';
let currentProject;
let returnFocus;
let previousHash = '';
let copyTimeout;
let closingWithHistory = false;

function enhanceCaseTriggers() {
  if (typeof dialog.showModal !== 'function') return;
  document.querySelectorAll('#project-list details.case-inline, #archive-list details.case-inline').forEach((details) => {
    const summary = details.querySelector('summary');
    const container = document.createElement('div');
    container.className = details.className;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-trigger';
    button.dataset.project = summary.dataset.project;
    button.setAttribute('aria-label', summary.getAttribute('aria-label'));
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.innerHTML = summary.innerHTML;
    container.append(button);
    details.replaceWith(container);
  });
  document.querySelectorAll('[data-project]').forEach((trigger) => { trigger.setAttribute('aria-haspopup', 'dialog'); });
}

function setLanguage(next, updateURL = true) {
  language = next;
  const strings = copy[language];
  document.documentElement.lang = language;
  document.querySelectorAll('[data-copy]').forEach((node) => { node.textContent = strings[node.dataset.copy]; });
  document.querySelectorAll('[data-heading]').forEach((node) => { node.innerHTML = heading(strings[node.dataset.heading]); });
  document.querySelectorAll('[data-language]').forEach((node) => {
    if (node.dataset.language === language) node.setAttribute('aria-current', 'true');
    else node.removeAttribute('aria-current');
  });
  document.querySelector('#project-list').innerHTML = renderProjects(language);
  document.querySelector('#archive-list').innerHTML = renderArchive(language);
  enhanceCaseTriggers();
  document.querySelector('#strength-list').innerHTML = renderStrengths(language);
  document.querySelector('#services').innerHTML = renderServices(language);
  document.querySelector('#email-link').href = `mailto:xzanuy@gmail.com?subject=${encodeURIComponent(strings.contactSubject)}`;
  document.querySelector('nav').setAttribute('aria-label', language === 'es' ? 'Principal' : 'Main navigation');
  document.querySelector('.header .wordmark').setAttribute('aria-label', language === 'es' ? 'Xavier Zanuy, inicio' : 'Xavier Zanuy, home');
  closeButton.setAttribute('aria-label', strings.closeCase);
  document.title = language === 'es' ? 'Xavier Zanuy — Producto, IA & apps propias' : 'Xavier Zanuy — Product, AI & independent apps';
  document.querySelector('meta[name="description"]').content = language === 'es'
    ? 'Xavier Zanuy. Producto, negocio e IA. Apps propias, más de diez años entre clientes y equipos técnicos, y colaboración freelance para convertir ideas en productos reales.'
    : 'Xavier Zanuy. Product, business and AI. Independent apps, over ten years connecting clients and technical teams, and freelance collaboration to turn ideas into real products.';
  document.querySelector('meta[property="og:title"]').content = `Xavier Zanuy — ${strings.heroFirst} ${strings.heroSecond}`;
  document.querySelector('meta[property="og:description"]').content = strings.heroIntro;
  document.querySelector('meta[property="og:locale"]').content = language === 'es' ? 'es_ES' : 'en_GB';
  if (currentProject) caseContent.innerHTML = renderCase(currentProject, language);
  if (updateURL) {
    const url = new URL(location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(history.state, '', url);
  }
}

function openProject(id, trigger, updateURL = true) {
  const project = projects.find((item) => item.id === id);
  if (!project || typeof dialog.showModal !== 'function') return;
  currentProject = project;
  returnFocus = trigger || document.querySelector(`[data-project="${id}"]`);
  previousHash = location.hash.startsWith('#case-')
    ? history.state?.portfolioCase?.previousHash ?? '#proyectos'
    : location.hash;
  caseContent.innerHTML = renderCase(project, language);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
  if (updateURL) {
    const state = { ...history.state, portfolioCase: { id, previousHash } };
    const url = `${location.pathname}${location.search}#case-${id}`;
    if (location.hash.startsWith('#case-')) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  }
}

function closeProject() {
  if (!dialog.open || closingWithHistory) return;
  if (history.state?.portfolioCase?.id === currentProject?.id && location.hash.startsWith('#case-')) {
    closingWithHistory = true;
    history.back();
    return;
  }
  if (location.hash.startsWith('#case-')) {
    const state = { ...history.state };
    delete state.portfolioCase;
    history.replaceState(state, '', `${location.pathname}${location.search}${previousHash}`);
  }
  dialog.close();
}

document.addEventListener('click', (event) => {
  const languageLink = event.target.closest('[data-language]');
  if (languageLink) {
    event.preventDefault();
    setLanguage(languageLink.dataset.language);
    return;
  }
  const projectLink = event.target.closest('[data-project]');
  if (projectLink && typeof dialog.showModal === 'function' && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    openProject(projectLink.dataset.project, projectLink);
  }
});
closeButton.addEventListener('click', closeProject);
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeProject();
});
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeProject();
});
dialog.addEventListener('close', () => {
  if (dialog.open) return;
  const focusTarget = returnFocus?.isConnected ? returnFocus : document.querySelector(`[data-project="${currentProject?.id}"]`);
  currentProject = null;
  closingWithHistory = false;
  if (focusTarget) focusTarget.focus({ preventScroll: true });
});

document.querySelector('#copy-email').addEventListener('click', async (event) => {
  const button = event.currentTarget;
  clearTimeout(copyTimeout);
  try {
    await navigator.clipboard.writeText('xzanuy@gmail.com');
    button.textContent = copy[language].copiedEmail;
    document.querySelector('#copy-status').textContent = copy[language].copiedEmail;
  } catch {
    button.textContent = copy[language].copyFailed;
    document.querySelector('#copy-status').textContent = copy[language].copyFailed;
  }
  copyTimeout = setTimeout(() => { button.textContent = copy[language].copyEmail; document.querySelector('#copy-status').textContent = ''; }, 3500);
});

function syncURL() {
  closingWithHistory = false;
  const requestedLanguage = new URL(location.href).searchParams.get('lang') === 'en' ? 'en' : 'es';
  if (requestedLanguage !== language) setLanguage(requestedLanguage, false);
  const id = location.hash.startsWith('#case-') ? location.hash.slice(6) : null;
  if (projects.some((project) => project.id === id)) {
    if (!dialog.open || currentProject?.id !== id) openProject(id, null, false);
  }
  else if (dialog.open) dialog.close();
}
window.addEventListener('popstate', syncURL);
window.addEventListener('hashchange', syncURL);
setLanguage(language, false);
syncURL();
