import { copy } from './copy.js';
import { projects } from './projects.js';

export const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export const arrow = (direction = 'right') => `<svg class="icon" aria-hidden="true"><use href="#arrow-${direction}"/></svg>`;
export const heading = (text) => escapeHTML(text).replace(/\.$/, '<span class="accent">.</span>');

function caseSections(project, language) {
  return project.sections[language].map(({ heading: title, body }) => `<section><h3>${escapeHTML(title)}</h3><p>${escapeHTML(body)}</p></section>`).join('');
}

function projectLinks(project, language) {
  return project.links.map(({ label, url }) => `<a class="text-link" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label[language])}${arrow('diagonal')}</a>`).join('');
}

function caseDetails(project, language) {
  return `<details class="case-inline"><summary data-project="${project.id}" aria-label="${escapeHTML(copy[language].caseLink)}: ${escapeHTML(project.name)}"><span>${copy[language].caseLink}</span>${arrow()}</summary><div class="inline-body">${caseSections(project, language)}${projectLinks(project, language)}</div></details>`;
}

export function renderProjects(language = 'es') {
  const featured = projects.slice(0, 2).map((project, index) => {
    const art = index === 0
      ? `<img src="assets/typeglow-cover.jpg" alt="${language === 'es' ? 'Visualización de TypeGlow: un móvil muestra el cartel luminoso LÍA y un avión' : 'TypeGlow product visual: a phone displaying a luminous LÍA sign and a plane'}" width="1536" height="1024" loading="lazy">`
      : `<div class="phone"><img src="assets/solo-screen.png" alt="${language === 'es' ? 'Captura real de Solo Training: reto diario, repeticiones y progreso' : 'Real Solo Training screenshot: daily challenge, repetitions and progress'}" width="390" height="844" loading="lazy"></div>`;
    return `<article class="project" id="${project.id}"><a class="project-art ${index === 1 ? 'solo-art' : ''}" href="#${project.id}" data-project="${project.id}" aria-label="${escapeHTML(copy[language].caseLink)}: ${escapeHTML(project.name)}">${art}</a><div class="project-caption"><p class="project-category">${project.number} / ${escapeHTML(project.category[language])}</p><h3>${escapeHTML(project.name)}</h3><p class="project-tagline">${escapeHTML(project.tagline[language])}</p><p class="project-status">${escapeHTML(project.status[language])}</p>${caseDetails(project, language)}</div></article>`;
  }).join('');
  const rows = projects.slice(2, 4).map((project) => `<article class="project project-row" id="${project.id}"><span class="row-number" aria-hidden="true">${project.number}</span><div><p class="project-category">${escapeHTML(project.category[language])}</p><h3>${escapeHTML(project.name)}</h3><p class="project-status">${escapeHTML(project.status[language])}</p></div><p class="project-tagline">${escapeHTML(project.tagline[language])}</p>${caseDetails(project, language)}</article>`).join('');
  return `<div class="featured-grid">${featured}</div><div class="project-rows">${rows}</div>`;
}

export function renderArchive(language = 'es') {
  return projects.slice(4).map((project) => `<article class="project archive-row" id="${project.id}"><span class="row-number" aria-hidden="true">${project.number}</span><div><h3>${escapeHTML(project.name)}</h3><p class="project-status">${escapeHTML(project.status[language])}</p></div><p class="archive-info">${escapeHTML(project.tagline[language])}</p>${caseDetails(project, language)}</article>`).join('');
}

export function renderStrengths(language = 'es') {
  return copy[language].strengths.map((strength, index) => `<div class="strength"><span class="strength-number" aria-hidden="true">0${index + 1}</span><div><h3>${escapeHTML(strength.title)}</h3><p>${escapeHTML(strength.body)}</p></div></div>`).join('');
}

export function renderServices(language = 'es') {
  return copy[language].services.map((service) => `<li>${escapeHTML(service)}</li>`).join('');
}

export function renderCase(project, language) {
  const images = {
    typeglow: { src: 'typeglow-screen.jpg', es: 'Captura del editor real de TypeGlow', en: 'Screenshot of the real TypeGlow editor' },
    'solo-training': { src: 'solo-screen.png', es: 'Captura de la web pública de Solo Training', en: 'Screenshot of the public Solo Training web app' },
    'ai-walking-tour': { src: 'walking-screen.jpg', es: 'Pantalla de bienvenida de AI Walking Tour', en: 'AI Walking Tour welcome screen' },
  };
  const image = images[project.id];
  return `<div class="case-header"><p class="section-label">${project.number} / ${escapeHTML(project.category[language])}</p><h2 id="case-title">${escapeHTML(project.name)}</h2><p class="case-status">${escapeHTML(project.status[language])}</p><p class="case-summary">${escapeHTML(project.summary[language])}</p></div><div class="case-body"><div class="case-prose">${caseSections(project, language)}</div><aside class="case-aside"><h3>${copy[language].caseStack}</h3><ul class="case-stack">${project.stack.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>${project.links.length ? `<h3>${copy[language].caseLinks}</h3>${projectLinks(project, language)}` : ''}</aside></div>${image ? `<figure class="case-image"><img src="assets/${image.src}" alt="${image[language]}" loading="lazy"><figcaption>${image[language]}</figcaption></figure>` : ''}`;
}
