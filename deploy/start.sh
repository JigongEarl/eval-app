#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "==> [1/3] 安装后端依赖"
cd backend
npm install --production --no-audit --no-fund
cd ..

echo "==> [2/3] 启动后端 API 服务 (端口 3001)"
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端就绪
sleep 2

echo "==> [3/3] 托管前端并反向代理 /api (端口 8080)"
cd backend
node serve.js &
SERVE_PID=$!
cd ..

echo ""
echo "后端 API:    http://localhost:3001/api/health"
echo "前端页面:    http://localhost:8080"
echo "完整链路:    http://localhost:8080/api/todos  ->  127.0.0.1:3001/api/todos"
echo ""
echo "按 Ctrl+C 停止所有服务"

trap "kill $BACKEND_PID $SERVE_PID 2>/dev/null" EXIT INT TERM
wait