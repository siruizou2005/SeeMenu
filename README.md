# SeeMenu 智拍菜单

Hackathon · 2026

SeeMenu 是一款面向出境旅行者的 AI 菜单翻译点餐应用。用户拍下异国语言菜单后，系统自动识别菜品、翻译说明、提示过敏原和忌口风险，并支持多人协同点餐，最终生成服务员可直接阅读的当地语言订单。

## 核心场景

1. 旅行者进入餐厅，拍摄纸质菜单。
2. AI（Gemini）识别菜品名称、价格、类别、食材与过敏原，并翻译为中文。
3. 应用生成类似扫码点餐的菜单页，可查看原文热区、中文解释与风险提示。
4. 同行朋友通过房间码加入，各自选菜并填写忌口备注。
5. 系统汇总订单并翻译为餐厅所在地语言，直接出示给服务员。

## 项目结构

```
SeeMenu/
├── backend/          # Node.js + Express 后端
│   ├── server.js
│   └── routes/
│       ├── scan.js   # 菜单拍照 & Gemini 识别
│       ├── menu.js   # 菜单数据查询
│       └── rooms.js  # 多人房间协同
├── frontend/         # React + Vite Web 前端
│   └── src/
│       └── pages/    # 16 个页面（首页、菜单、购物车、房间、订单等）
├── mobile/           # React Native / Expo 移动端
│   └── app/          # Expo Router 路由
│       ├── (tabs)/   # 底部标签（首页、历史、个人）
│       ├── capture.tsx
│       ├── menu/     # 菜单列表 & 菜品详情
│       ├── cart.tsx
│       ├── room.tsx / join-room.tsx / room-qr.tsx
│       ├── order.tsx / order-show.tsx
│       └── ...
├── start.sh          # 一键启动前后端
└── .env.example
```

## 技术栈

| 层 | 技术 |
|---|---|
| 移动端 | React Native / Expo（iOS & Android） |
| Web 前端 | React + Vite |
| 后端 | Node.js + Express |
| AI 识别 | Google Gemini API（图片理解 + 结构化输出） |
| 多人协同 | 房间码 + 轮询 |

## 本地运行

### 环境准备

```bash
cp .env.example .env
# 填入你的 GEMINI_API_KEY
```

### 启动 Web 版（前端 + 后端）

```bash
bash start.sh
```

- 前端：http://localhost:5173
- 后端：http://localhost:3001

### 启动移动端

```bash
cd mobile
npm install
npx expo start
```

真机调试时将 `.env` 中的 `EXPO_PUBLIC_API_URL` 改为电脑局域网 IP，例如 `http://192.168.x.x:3001`。

## 环境变量

| 变量 | 说明 |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API 密钥 |
| `GEMINI_MODEL` | 使用的模型，默认 `gemini-2.5-flash` |
| `PORT` | 后端端口，默认 `3001` |
| `PUBLIC_BASE_URL` | 后端对外地址（用于生成图片 URL） |
| `EXPO_PUBLIC_API_URL` | 移动端访问后端的地址 |

## 注意事项

- 过敏原和忌口信息仅作风险提示，须保留用户与服务员的二次确认。
- 未配置 `GEMINI_API_KEY` 时，后端返回本地样例数据，可用于 UI 调试。
