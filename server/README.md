# AI Proxy Example

这是一个最小的 Node.js + Express 中转站示例，用于把前端的聊天请求转发到上游 AI 提供商（OpenAI / Gemini 等）。

快速开始：

1. 进入 `server` 目录。
2. 安装依赖：
   npm install
3. 启动（示例，使用环境变量配置上游接口与密钥）：
   UPSTREAM_URL="https://api.openai.com/v1/whatever" UPSTREAM_KEY="sk-..." npm start

环境变量：
- UPSTREAM_URL: 上游 API 的完整 URL（示例：OpenAI 或 Gemini 的接口）。
- UPSTREAM_KEY: 上游 API Key（不要把它提交到代码仓库）。

接口：
- GET /v1/ping -> 健康检查
- POST /v1/chat -> body: { model, message } 返回: { reply }

说明：
- 上游 API 的请求/响应格式可能不同。请根据你选择的提供商修改 `index.js` 中的请求体与结果解析逻辑。
- 在生产中请对请求进行鉴权和速率限制，避免滥用。
