# 🪙 OpenClaw Upbit Trading Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.2.6-blue)](https://github.com/openclaw/openclaw)
[![Upbit API](https://img.shields.io/badge/Upbit-API-green)](https://docs.upbit.com)

> 💬 **Trade cryptocurrency with natural language!**
> An OpenClaw skill that allows you to trade on Upbit through conversational AI on Telegram, Discord, and WhatsApp.

**English** | [한국어](./README.ko.md)

---

## 🎯 Key Features

- 💰 **Balance Check**: "show my wallet balance" → AI fetches real-time balance
- 📊 **Price Quote**: "what's the Bitcoin price" → Current price, change rate, volume
- 🛒 **Buy**: "buy 50 dollars worth of Dogecoin" → Automatic market buy
- 💸 **Sell**: "sell all Ethereum" → Sell entire holdings

## 🚀 Quick Start

### 1. Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- [Upbit](https://upbit.com) account with API keys
- At least one channel connected (Telegram/Discord/WhatsApp)

### 2. Installation

```bash
cd ~/Desktop
git clone https://github.com/jh941213/openclaw.git
cd openclaw
git checkout feature/upbit-manual-trading
pnpm install
pnpm build
```

### 3. Upbit API Key Setup

1. Login to [Upbit](https://upbit.com)
2. Generate API Key with permissions: View Assets, Place Orders
3. Add to LaunchAgent plist:

```bash
vim ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

Add to `<key>EnvironmentVariables</key>`:

```xml
<key>UPBIT_ACCESS_KEY</key>
<string>your_access_key</string>
<key>UPBIT_SECRET_KEY</key>
<string>your_secret_key</string>
```

### 4. Restart Gateway

```bash
pnpm openclaw gateway restart
```

## 💬 Usage Examples

```
👤 "show my balance"
🤖 💰 Upbit Balance: KRW ₩1,250,000, BTC 0.00523 (~₩554,000)
   Total: ₩2,278,000

👤 "Bitcoin price"
🤖 📊 KRW-BTC: ₩106,050,000 🔺+3.36%

👤 "buy 50000 KRW Dogecoin"
🤖 ✅ Buy order complete: KRW-DOGE, ₩50,000, ~344.83 DOGE
```

## 📚 Documentation

- [Full Documentation](./README.ko.md)
- [Upbit API Docs](https://docs.upbit.com)
- [OpenClaw](https://github.com/openclaw/openclaw)

## 👨‍💻 Author

**Jaehyun Kim** ([@jh941213](https://github.com/jh941213))

## 📄 License

MIT License

---

⭐ Star this project if it helps you!

**⚠️ Disclaimer**: Educational use only. Cryptocurrency trading involves risk.
