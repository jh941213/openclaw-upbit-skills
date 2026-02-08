# 🪙 OpenClaw Upbit Trading Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.2.6-blue)](https://github.com/openclaw/openclaw)
[![Upbit API](https://img.shields.io/badge/Upbit-API-green)](https://docs.upbit.com)

> 💬 **Trade cryptocurrency with natural language!**
>
> An OpenClaw skill that enables conversational crypto trading on Upbit through Telegram, Discord, and WhatsApp.

**English** | [한국어](./README.ko.md)

![Demo](./examples/demo.gif)

---

## ✨ Features

- 💰 **Balance Check**: "show my wallet balance" → Real-time balance
- 📊 **Price Quotes**: "Bitcoin price" → Live market data
- 🛒 **Buy Orders**: "buy 50000 KRW worth of Dogecoin" → Instant market buy
- 💸 **Sell Orders**: "sell all Ethereum" → Liquidate holdings
- 🤖 **AI-Powered**: Natural language understanding via Claude/GPT
- 🔐 **Secure**: JWT HS256 authentication with Upbit API

## 🚀 Quick Start

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- [Upbit](https://upbit.com) account with API keys
- Telegram/Discord/WhatsApp connected to OpenClaw

### Installation

**Step 1**: Clone this repository

```bash
cd ~/Desktop
git clone https://github.com/jh941213/openclaw-upbit.git
cd openclaw-upbit
```

**Step 2**: Copy files to OpenClaw

```bash
# Copy source files
cp -r src/* ~/path/to/openclaw/src/
cp -r skills/* ~/path/to/openclaw/skills/
```

**Step 3**: Integrate the tool (add to `openclaw-tools.ts`)

```typescript
// In src/agents/openclaw-tools.ts
import { createUpbitTool } from "./tools/upbit-tool.js";

// Add to tools array
createUpbitTool(),
```

**Step 4**: Set up Upbit API keys

```bash
# Edit LaunchAgent plist
vim ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

Add to `<key>EnvironmentVariables</key>`:

```xml
<key>UPBIT_ACCESS_KEY</key>
<string>your_upbit_access_key_here</string>
<key>UPBIT_SECRET_KEY</key>
<string>your_upbit_secret_key_here</string>
```

**Step 5**: Rebuild OpenClaw

```bash
cd ~/path/to/openclaw
pnpm install
pnpm build
```

**Step 6**: Restart Gateway

```bash
pnpm openclaw gateway restart
```

### Get Upbit API Keys

1. Login to [Upbit](https://upbit.com)
2. Go to **My Page** → **Open API Management**
3. Click **Generate API Key**
4. Enable permissions:
   - ✅ **View Assets** (required)
   - ✅ **Place Orders** (required for trading)
5. Copy **Access Key** and **Secret Key**

## 💬 Usage

### Example Conversations

```
👤 User: "show my balance"
🤖 AI: 💰 Upbit Balance:
       - KRW: ₩1,250,000
       - BTC: 0.00523 (~₩554,000)
       - ETH: 0.15 (~₩474,000)
       Total: ₩2,278,000

👤 User: "what's the Bitcoin price?"
🤖 AI: 📊 KRW-BTC Current Price:
       Price: ₩106,050,000
       🔺 Change: +₩3,450,000 (+3.36%)
       24h Volume: 2,415 BTC

👤 User: "buy 50000 KRW worth of Dogecoin"
🤖 AI: ✅ Buy Order Complete:
       Market: KRW-DOGE
       Amount: ₩50,000
       Volume: ~344.83 DOGE
       Order ID: abc-123-def-456

👤 User: "sell all my Bitcoin"
🤖 AI: ✅ Sell Order Complete:
       Market: KRW-BTC
       Volume: 0.00523 BTC
       Estimated: ~₩554,000
```

### Supported Commands

| Category | Commands |
|----------|----------|
| **Balance** | "show balance", "how much BTC?", "my wallet" |
| **Price** | "Bitcoin price", "BTC quote", "DOGE value" |
| **Buy** | "buy 100000 KRW BTC", "purchase 50000 won DOGE" |
| **Sell** | "sell all BTC", "sell 0.5 ETH", "liquidate DOGE" |

## 🏗️ Architecture

```
┌─────────────────────────┐
│  Telegram/Discord/Whats │
│  "buy 100k KRW Bitcoin" │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  OpenClaw AI Agent      │
│  (Claude/GPT)           │
│  - NLU                  │
│  - Intent detection     │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  upbit_trading Tool     │
│  - upbit-actions.ts     │
│  - upbit-tool.ts        │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Upbit Client           │
│  - JWT HS256 auth       │
│  - REST API calls       │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Upbit API              │
│  api.upbit.com          │
└─────────────────────────┘
```

## 📁 File Structure

```
openclaw-upbit/
├── README.md                    # This file
├── README.ko.md                 # Korean documentation
├── LICENSE                      # MIT License
├── .gitignore
├── src/
│   ├── skills/
│   │   ├── upbit-client.ts      # Upbit API client (JWT auth, REST calls)
│   │   └── upbit-manual-tool.ts # Command parser & router
│   └── agents/tools/
│       ├── upbit-actions.ts     # OpenClaw action handler
│       ├── upbit-tool.ts        # AI agent tool definition
│       └── README.md            # Integration guide
├── skills/
│   └── upbit-manual-trading/
│       ├── SKILL.md             # Skill metadata
│       ├── README.md            # Skill documentation
│       └── test-integration.ts  # Integration test
├── docs/
│   ├── installation.md          # Detailed installation guide
│   └── troubleshooting.md       # Common issues & solutions
└── examples/
    ├── demo.gif                 # Demo video
    └── screenshots/             # Usage screenshots
```

## 🛡️ Security

- ✅ Environment variables for API keys (no hardcoding)
- ✅ JWT HS256 secure authentication
- ✅ LaunchAgent plist permissions (chmod 600)
- ⚠️ **NEVER commit API keys to Git**
- ⚠️ Regenerate keys immediately if exposed

## ⚙️ Configuration

### Trading Limits

- Minimum order: ₩5,000
- Fee: 0.05% (automatic)
- Markets: KRW only (no BTC/USDT pairs)
- Order type: Market orders only

### API Rate Limits

- 10 requests/second
- 100 requests/minute
- Automatically managed by Upbit client

## 🧪 Testing

```bash
cd openclaw-upbit

# Set environment variables
export UPBIT_ACCESS_KEY="your_key"
export UPBIT_SECRET_KEY="your_secret"

# Run integration test
npx tsx skills/upbit-manual-trading/test-integration.ts
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid digest" | Check JWT signing (must be HS256) |
| "API keys not set" | Verify environment variables in plist |
| AI not using tool | Rebuild OpenClaw, restart gateway |
| Buy/sell fails | Check balance, minimum ₩5,000 required |

See [docs/troubleshooting.md](./docs/troubleshooting.md) for more help.

## 📚 Documentation

- [Installation Guide](./docs/installation.md)
- [Korean README](./README.ko.md)
- [Upbit API Docs](https://docs.upbit.com)
- [OpenClaw Docs](https://docs.openclaw.ai)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👨‍💻 Author

**Jaehyun Kim**
- GitHub: [@jh941213](https://github.com/jh941213)
- Company: KTDS
- Email: jh941213@gmail.com

## 🙏 Acknowledgments

- [OpenClaw Team](https://github.com/openclaw/openclaw) - Amazing AI platform
- [Upbit](https://upbit.com) - Cryptocurrency exchange API
- [Anthropic](https://anthropic.com) - Claude AI

## ⭐ Star History

If this project helps you, please give it a star! ⭐

---

**⚠️ Disclaimer**: This tool is for educational and personal use only. Cryptocurrency trading involves substantial risk. Users are solely responsible for any financial losses. Always trade responsibly and never invest more than you can afford to lose.
