
<div align="center">

# 🌟 SHANU-MD 🌟

### *A Powerful WhatsApp Multi-Device Bot* 🤖

<img src="https://i.postimg.cc/8CqG2Bm2/FB-IMG-1760348539551.jpg" alt="SHANU-MD Logo" width="300" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">

<p align="center">
  <em>Built with ❤️ using Baileys Multi-Device</em>
</p>

---

<a href="https://readme-typing-svg.herokuapp.com">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&random=false&width=600&lines=Fast+%E2%9A%A1+Secure+%F0%9F%94%92+Multi-Device+%F0%9F%93%B1;Open+Source+%E2%9C%A8+Powerful+%F0%9F%92%AA;Easy+to+Deploy+%F0%9F%9A%80+Feature-Rich+%F0%9F%8E%AF" alt="Typing SVG" />
</a>

---

### 📊 **Project Status**

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x+-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![WhatsApp Bot](https://img.shields.io/badge/WhatsApp-Multi--Device-25D366?style=for-the-badge&logo=whatsapp)](https://github.com)
[![Baileys](https://img.shields.io/badge/Baileys-Latest-blue?style=for-the-badge)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)](https://github.com)
[![Platform](https://img.shields.io/badge/Platform-Termux%20%7C%20Linux%20%7C%20VPS-orange?style=for-the-badge)](https://github.com)

</div>

---

## 🎯 **About SHANU-MD**

<div align="center">

**SHANU-MD** is a cutting-edge WhatsApp Multi-Device bot powered by **Baileys** and built with **Node.js**. Designed for speed, security, and simplicity, it brings automation and fun to your WhatsApp groups and chats!

Whether you're managing groups, downloading media, or just having fun with commands — **SHANU-MD** has got you covered! 🚀

</div>

---

## ✨ **Features**

<div align="center">

<table>
  <tr>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/menu.png" width="60"><br>
      <b>🎛️ Auto Menu System</b><br>
      <sub>Dynamic & Interactive</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/chatbot.png" width="60"><br>
      <b>🤖 AI Chat Features</b><br>
      <sub>Smart Conversations</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/group.png" width="60"><br>
      <b>👥 Group Management</b><br>
      <sub>Admin & Moderation</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/downloading-updates.png" width="60"><br>
      <b>📥 Media Downloader</b><br>
      <sub>YouTube, Instagram, TikTok</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/smiley.png" width="60"><br>
      <b>🎮 Fun Commands</b><br>
      <sub>Games & Entertainment</sub>
    </td>
    <td align="center" width="33%">
      <img src="https://img.icons8.com/fluency/96/lightning-bolt.png" width="60"><br>
      <b>⚡ Lightweight & Fast</b><br>
      <sub>Optimized Performance</sub>
    </td>
  </tr>
</table>

</div>

---

## 📋 **Requirements**

Before you begin, ensure you have the following installed:

| Requirement | Version | Description |
|------------|---------|-------------|
| **Node.js** | `18.x+` | JavaScript runtime |
| **Git** | Latest | Version control |
| **FFmpeg** | Latest | Media processing |
| **Internet** | Stable | Connection required |

---

## 🚀 **Installation**

<details>
<summary><b>📱 Termux (Android)</b></summary>

```bash
# Update & upgrade packages
pkg update && pkg upgrade -y

# Install required packages
pkg install git nodejs ffmpeg -y

# Clone the repository
git clone https://github.com/ShanudhaTirosh/SHANU-MD.git

# Navigate to directory
cd SHANU-MD

# Install dependencies
npm install

# Start the bot
npm start
```

</details>

<details>
<summary><b>🖥️ Linux / VPS</b></summary>

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js, Git, FFmpeg
sudo apt install git nodejs npm ffmpeg -y

# Clone the repository
git clone https://github.com/ShanudhaTirosh/SHANU-MD.git

# Navigate to directory
cd SHANU-MD

# Install dependencies
npm install

# Start the bot
npm start
```

</details>

<details>
<summary><b>🐳 Docker</b></summary>

```bash
# Clone the repository
git clone https://github.com/ShanudhaTirosh/SHANU-MD.git
cd SHANU-MD

# Build Docker image
docker build -t shanu-md .

# Run container
docker run -d --name shanu-md-bot shanu-md

# View logs
docker logs -f shanu-md-bot
```

**Example Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]
```

</details>

---

## ⚙️ **Configuration**

Edit `config.js` or `.env` file with your details:

```javascript
module.exports = {
  OWNER_NUMBER: "94xxxxxxxxx", // Your WhatsApp number
  BOT_NAME: "SHANU-MD",
  PREFIX: ".",
  MODE: "public", // or "private"
  AUTO_READ: true,
  AUTO_STATUS_READ: false,
  PRESENCE: "available" // online, typing, recording
};
```

---

## 📲 **WhatsApp Login**

<div align="center">

### **Method 1: QR Code**
1. Run `npm start`
2. Scan the QR code with WhatsApp
3. Bot will connect automatically

### **Method 2: Pairing Code**
1. Run `npm start`
2. Enter your phone number
3. Enter the 8-digit code in WhatsApp

> ⚠️ **Important:** Never share your session credentials with anyone!

</div>

---

## 🎮 **Commands Preview**

<div align="center">

| Category | Command | Description |
|----------|---------|-------------|
| 🎛️ **General** | `.menu` | Display all commands |
| 🤖 **AI** | `.ai [question]` | Ask AI anything |
| 📥 **Downloader** | `.ytdl [url]` | Download YouTube videos |
| 🎮 **Fun** | `.meme` | Random meme generator |
| 👥 **Group** | `.kick @user` | Remove member (admin) |
| 🔒 **Owner** | `.ban @user` | Ban user globally |

> *Type `.menu` in chat to see all available commands!*

</div>

---

## 📁 **Project Structure**

```
SHANU-MD/
│
├── commands/      # Bot commands
├── data/  #store the data
├── lib/           # Helper functions
├── main.js          # command Configuration file
├── config.js          # Configuration file
├── index.js           # Main entry point
├── package.json       # Dependencies
└── README.md          # Documentation
```

---

## 🌐 **Deployment**

<div align="center">

### **Deploy on VPS**
Use any VPS provider (DigitalOcean, AWS, Azure) and follow Linux installation steps.

### **Deploy with Docker**
Use the Docker commands mentioned above for containerized deployment.

### **Deploy on Cloud Platforms**
- **Railway:** Connect GitHub repo and deploy
- **Render:** Free tier available for Node.js apps
- **Heroku:** Use buildpacks for WhatsApp bots

</div>

---

## 📸 **Screenshots & Preview**

<div align="center">

<img src="https://via.placeholder.com/800x400/00D9FF/FFFFFF?text=Bot+Menu+Screenshot" alt="Menu Preview" width="45%" style="border-radius: 10px; margin: 10px;">
<img src="https://via.placeholder.com/800x400/25D366/FFFFFF?text=Group+Management" alt="Group Preview" width="45%" style="border-radius: 10px; margin: 10px;">

<img src="https://via.placeholder.com/1200x400/FF6B6B/FFFFFF?text=Animated+Bot+Preview+GIF" alt="Animated Preview" width="80%" style="border-radius: 10px; margin: 20px;">

</div>

---

## ⚠️ **Disclaimer & Safety**

<div align="center">

> **IMPORTANT:** This bot is for educational purposes only. Using WhatsApp bots may violate WhatsApp's Terms of Service. Use at your own risk.

- ❌ Do not spam messages
- ❌ Do not use for illegal activities
- ✅ Respect privacy and user consent
- ✅ Use responsibly and ethically

**The creator is not responsible for misuse of this bot.**

</div>

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

1. **Fork** this repository
2. **Create** a new branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 💝 **Credits & Thanks**

<div align="center">

Special thanks to:

- **[@WhiskeySockets/Baileys](https://github.com/WhiskeySockets/Baileys)** - The best WhatsApp library
- **Open Source Community** - For amazing contributions
- **All Contributors** - Who made this project better

</div>

---

## 📜 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Shanudha Tirosh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

### 🌟 **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=ShanudhaTirosh/SHANU-MD&type=Date)](https://star-history.com/hanudhaTirosh/SHANU-MD&Date)

---

### 💬 **Support & Community**

[![WhatsApp Group](https://img.shields.io/badge/WhatsApp-Group-25D366?style=for-the-badge&logo=whatsapp)](https://chat.whatsapp.com/your-group-link)
[![Telegram](https://img.shields.io/badge/Telegram-Channel-2CA5E0?style=for-the-badge&logo=telegram)](https://t.me/your-channel)
[![Discord](https://img.shields.io/badge/Discord-Server-5865F2?style=for-the-badge&logo=discord)](https://discord.gg/your-server)

---

<img src="https://raw.githubusercontent.com/Platane/snk/output/github-contribution-grid-snake-dark.svg" alt="Snake animation" />

---

### ⭐ **If you like this project, give it a star!**

<a href="https://github.com/ShanudhaTirosh/SHANU-MD/stargazers">
  <img src="https://img.shields.io/github/stars/ShanudhaTirosh/SHANU-MD?style=social" alt="GitHub stars">
</a>
<a href="https://github.com/ShanudhaTirosh/SHANU-MD/network/members">
  <img src="https://img.shields.io/github/forks/ShanudhaTirosh/SHANU-MD?style=social" alt="GitHub forks">
</a>

---

<p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>
</p>

**Made with ❤️ by [Shanudha Tirosh](https://github.com/ShanudhaTirosh)**

*© 2025 SHANU-MD. All Rights Reserved.*

</div>
