module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'active',
    secure: true,
    provider: 'OpenRouter (Vercel Serverless Function)',
    model: process.env.QWEN_MODEL || 'qwen/qwen-2.5-72b-instruct',
    serverTime: new Date().toISOString()
  });
};
