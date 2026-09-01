const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const BACKEND_PORT = process.env.BACKEND_PORT || 3001;

// /api 反向代理到后端 API 服务
app.use('/api', (req, res) => {
  const proxyReq = http.request(
    {
      hostname: '127.0.0.1',
      port: BACKEND_PORT,
      path: req.originalUrl,
      method: req.method,
      headers: req.headers
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );
  proxyReq.on('error', (err) => {
    res.status(502).json({ error: 'Bad Gateway', detail: err.message });
  });
  req.pipe(proxyReq);
});

// 静态托管前端构建产物
app.use(express.static(FRONTEND_DIR));

const PORT = process.env.FRONTEND_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Frontend + API proxy listening on ${PORT}`);
});