const http = require('http');
const fs = require('fs');
const path = require('path');

try {
  if (process.loadEnvFile) process.loadEnvFile();
} catch (e) {}

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen/qwen-2.5-72b-instruct';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // Status endpoint
  if (req.method === 'GET' && urlPath === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'active',
      secure: true,
      provider: 'OpenRouter (Backend Protected)',
      model: QWEN_MODEL
    }));
    return;
  }

  // Secure Chat Endpoint
  if (req.method === 'POST' && urlPath === '/api/chat') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { message, history = [], systemPrompt } = payload;

        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        if (Array.isArray(history)) {
          history.slice(-8).forEach(h => {
            if (h.role && h.content) messages.push({ role: h.role, content: h.content });
          });
        }
        messages.push({ role: 'user', content: message });

        const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': `http://localhost:${PORT}`,
            'X-Title': 'St. Ann\'s College AI Helpdesk'
          },
          body: JSON.stringify({
            model: payload.model || QWEN_MODEL,
            messages: messages,
            temperature: 0.3,
            max_tokens: 1200
          })
        });

        if (!openrouterResponse.ok) {
          const errText = await openrouterResponse.text();
          res.writeHead(openrouterResponse.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: errText }));
          return;
        }

        const data = await openrouterResponse.json();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          reply: data.choices?.[0]?.message?.content || 'No response.',
          model: data.model || QWEN_MODEL
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static files
  let reqPath = decodeURI(urlPath);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(BASE_DIR, reqPath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🏛️ SACET Portal Server running at http://localhost:${PORT}`);
});
