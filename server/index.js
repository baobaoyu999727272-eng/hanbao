const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const UPSTREAM_URL = process.env.UPSTREAM_URL || ''; // e.g. OpenAI or Gemini endpoint
const UPSTREAM_KEY = process.env.UPSTREAM_KEY || ''; // keep secret in env

app.get('/v1/ping', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

app.post('/v1/chat', async (req, res) => {
  /* Expected body: { model, message }
     This proxy forwards to an upstream provider. Customize as needed.
  */
  try {
    const { model, message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'missing message' });

    if (!UPSTREAM_URL || !UPSTREAM_KEY) {
      // fallback: return a simple echo / simulated reply
      return res.json({ reply: `代理未配置（本地模拟）：${message.split('').reverse().join('')}` });
    }

    // Example: forward as a simple POST with JSON. Adjust to upstream API shape.
    const upstreamRes = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${UPSTREAM_KEY}`,
      },
      body: JSON.stringify({ model, input: message }),
    });

    const data = await upstreamRes.json();

    // Try to extract text reply in a few common shapes
    const reply =
      data.reply ||
      data.result ||
      (data.choices &&
        data.choices[0] &&
        (data.choices[0].text || (data.choices[0].message && data.choices[0].message.content))) ||
      JSON.stringify(data);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy server listening on http://localhost:${port}`));
