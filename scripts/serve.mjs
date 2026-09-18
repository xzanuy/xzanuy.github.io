import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a number between 1 and 65535.');
}

const server = createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');

  const reply = (status, message) => {
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : message);
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(405, 'Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
  } catch {
    reply(400, 'Bad request');
    return;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (pathname.includes('\\') || pathname.includes('\0') ||
      segments.some(segment => segment.startsWith('.')) ||
      segments[0] === 'scripts' || segments[0] === 'node_modules' ||
      pathname === '/package.json' || pathname === '/package-lock.json') {
    reply(404, 'Not found');
    return;
  }

  if (pathname.endsWith('/')) pathname += 'index.html';
  const type = types[extname(pathname).toLowerCase()];
  if (!type) {
    reply(404, 'Not found');
    return;
  }

  try {
    const file = await realpath(resolve(root, `.${pathname}`));
    if (!file.startsWith(`${root}${sep}`)) {
      reply(404, 'Not found');
      return;
    }

    const info = await stat(file);
    if (!info.isFile()) {
      reply(404, 'Not found');
      return;
    }

    response.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size });
    if (request.method === 'HEAD') response.end();
    else await pipeline(createReadStream(file), response);
  } catch {
    if (!response.headersSent) reply(404, 'Not found');
    else response.destroy();
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Set PORT to choose another port.`
    : error.message);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Portfolio preview: http://${host}:${port}`);
});
