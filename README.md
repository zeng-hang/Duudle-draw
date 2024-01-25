# Duudle-draw （你画我猜）

## 项目简介

这是一个你画我猜游戏项目，后端基于`node`，前端基于`vue`，画板基于`fabric.js`，通讯基于`socket.io`，数据存储基于`localforage`。

数据基本上都是存储在本地，只有用户信息和房间信息存储在服务器，服务器基本上只是一个转发的作用。

## 目录结构

```bash
├── README.md
├── server               # 服务端代码
├── client               # 客户端代码（是一个标准的 Vue 项目结构）
│   └── public
│   ├── src
│   ├──
```

## 项目运行

### 服务端

```bash
cd server
npm install
npm run dev
```

### 客户端

```bash
cd client
npm install
npm run dev
```