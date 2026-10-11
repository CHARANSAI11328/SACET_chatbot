const http = require('http');
const fs = require('fs');
const path = require('path');

try {
  if (process.loadEnvFile) process.loadEnvFile();
} catch (e) {}

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen/qwen-2.5-72b-instruct';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // 1. API Status Endpoint
  if (req.method === 'GET' && (urlPath === '/api/status' || urlPath === '/status')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'active',
      secure: true,
      provider: 'OpenRouter (Vercel Server Entrypoint)',
      model: QWEN_MODEL,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. API Chat Endpoint
  if (req.method === 'POST' && (urlPath === '/api/chat' || urlPath === '/chat')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { message, history = [], systemPrompt, model } = payload;

        if (!message) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Message is required' }));
          return;
        }

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
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://sacet-chatbot.vercel.app',
            'X-Title': 'St. Ann\'s College AI Helpdesk'
          },
          body: JSON.stringify({
            model: model || QWEN_MODEL,
            messages: messages,
            temperature: 0.3,
            max_tokens: 1200
          })
        });

        if (!openrouterResponse.ok) {
          const errText = await openrouterResponse.text();
          res.writeHead(openrouterResponse.status, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: errText }));
          return;
        }

        const data = await openrouterResponse.json();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          reply: data.choices?.[0]?.message?.content || 'No response generated.',
          model: data.model || QWEN_MODEL
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 3. Static File Serving (Resolves from root, dist, and process.cwd())
  let reqPath = decodeURI(urlPath);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const candidateDirs = [
    path.join(__dirname, 'dist'),
    __dirname,
    path.join(process.cwd(), 'dist'),
    process.cwd()
  ];

  let foundFile = null;
  for (const dir of candidateDirs) {
    const candidate = path.join(dir, reqPath);
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        foundFile = candidate;
        break;
      }
    } catch (_) {}
  }

  if (foundFile) {
    const ext = path.extname(foundFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600'
    });
    fs.createReadStream(foundFile).pipe(res);
    return;
  }

  // 404 fallback
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

const server = http.createServer(handler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🏛️ SACET Portal Server running at http://localhost:${PORT}`);
  });
}

// Support both standard Vercel request handler and Node http.Server
module.exports = handler;
module.exports.server = server;
