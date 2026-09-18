import { readFile, writeFile } from 'node:fs/promises';
import { renderArchive, renderProjects, renderServices, renderStrengths } from '../views.js';
const path = new URL('../index.html', import.meta.url);
let html = await readFile(path, 'utf8');
for (const [key, content] of Object.entries({ projects: renderProjects(), archive: renderArchive(), strengths: renderStrengths(), services: renderServices() })) {
  html = html.replace(new RegExp(`<!-- ${key}:start -->[\\s\\S]*?<!-- ${key}:end -->`), `<!-- ${key}:start -->${content}<!-- ${key}:end -->`);
}
await writeFile(path, html);
console.log('Pre-rendered project cases, strengths and services into index.html.');
