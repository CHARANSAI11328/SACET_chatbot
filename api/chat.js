module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen/qwen-2.5-72b-instruct';

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { message, history = [], systemPrompt, model } = payload;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
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
        'HTTP-Referer': 'https://sacet-college.vercel.app',
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
      return res.status(openrouterResponse.status).json({ error: errText });
    }

    const data = await openrouterResponse.json();
    return res.status(200).json({
      success: true,
      reply: data.choices?.[0]?.message?.content || 'No response generated.',
      model: data.model || QWEN_MODEL
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
