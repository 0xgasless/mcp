# 🚀 0xGasless MCP Server


**🔗 Seamless Blockchain Integration for Claude AI**

*Execute gasless transactions, swaps, and transfers directly from your Claude conversations*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🛠️ Development](#️-development) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is 0xGasless MCP Server?

The **0xGasless MCP Server** is a powerful [Model Context Protocol](https://modelcontextprotocol.io) server that bridges Claude AI with blockchain networks. Built on **ERC-4337 Account Abstraction**, it enables gasless blockchain operations through natural language conversations.

### ✨ Key Highlights

- 🆓 **Zero Gas Fees** - Execute transactions without holding native tokens
- 🌐 **Multi-Chain Support** - 8+ blockchain networks supported
- 🤖 **AI-Native** - Natural language blockchain interactions
- 🔒 **Secure** - Smart account abstraction with enhanced security
- ⚡ **Instant Setup** - One-command Claude integration

---

## 🛠️ Available Tools

| Tool | Description | Example Usage |
|------|-------------|---------------|
| 🏠 `get-address` | Retrieve your smart account address | *"What's my wallet address?"* |
| 💰 `get-balance` | Check token balances (ERC20 support) | *"Show my USDC balance"* |
| 📤 `transfer-token` | Send tokens gaslessly | *"Send 10 USDT to alice.eth"* |
| 🔄 `swap-tokens` | Exchange tokens without gas | *"Swap 100 USDT for USDC"* |
| 🎯 `buy-openrouter-credits` | Purchase AI credits with USDC | *"Buy $25 OpenRouter credits"* |
| 🌉 `bridge-tokens` | Bridge tokens across chains using deBridge | *"Bridge 100 USDC from Avalanche to Ethereum"* |
| 📊 `sxt-query-data` | Query blockchain data using Space and Time | *"Show my transaction history"* |

---

## 🚀 Quick Start

### 📦 Installation

Preferred installation method:

```bash
# Global installation (recommended)
npm install -g 0xgasless/mcp
```

### ⚙️ Configuration

#### 1️⃣ Automatic Setup (Easiest)

```bash
0xgasless-mcp configure
```

This interactive command will:
- ✅ Collect your API keys and configuration
- ✅ Detect your operating system
- ✅ Configure Claude Desktop automatically
- ✅ Validate all inputs

#### 2️⃣ Manual Environment Setup

Create a `.env` file with your configuration:

```bash
# 🔑 Required Configuration
PRIVATE_KEY=0x...                   # Your wallet private key
RPC_URL=https://...                 # Blockchain RPC endpoint
API_KEY=your_0xgasless_api_key      # From dashboard.0xgasless.com
CHAIN_ID=43114                      # Target blockchain (see table below)
SXT_API_KEY=                        # Space & Time Api Key

# 🎯 Optional Configuration  
OPENROUTER_API_KEY=your_key         # For AI credit purchases
```
---

## 🌐 Supported Networks

| 🌍 Network | 🆔 Chain ID | 💎 Native Token | 🔗 RPC Endpoint |
|------------|-------------|-----------------|------------------|
| 🔴 **Avalanche** | `43114` | AVAX | `https://api.avax.network/ext/bc/C/rpc` |
| 🟡 **BSC** | `56` | BNB | `https://bsc-dataseed.binance.org/` |
| 🔵 **Base** | `8453` | ETH | `https://mainnet.base.org` |
| ⚫ **Ethereum** | `1` | ETH | `https://eth.llamarpc.com` |
| 🟣 **Polygon** | `137` | MATIC | `https://polygon-rpc.com` |
| 🔵 **Sonic** | `156` | S | `https://sonic.drpc.org` |
| 🌙 **Moonbeam** | `1284` | GLMR | `https://rpc.api.moonbeam.network` |

---

## 🔗 Claude Desktop Integration

### 🎯 Automatic Configuration

The easiest way to integrate with Claude Desktop:

```bash
0xgasless-mcp configure
```

### 📝 Manual Configuration

Add to your Claude Desktop configuration file:

**📍 Configuration Locations:**
- 🍎 **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- 🪟 **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- 🐧 **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "0xgasless": {
      "command": "npx",
      "args": ["0xgasless-mcp-server"],
      "env": {
        "PRIVATE_KEY": "0x...",
        "RPC_URL": "https://...",
        "API_KEY": "your_0xgasless_api_key",
        "CHAIN_ID": "43114",
        "SXT_API_KEY": "your_space_&_time_api_key",
        "OPENROUTER_API_KEY": "your_openrouter_key"
      }
    }
  }
}
```

---

## 💬 Usage Examples

Once configured, interact with blockchain using natural language:

### 💰 Balance Inquiries
```
💬 "What's my wallet balance?"
💬 "Check my USDC balance on BSC"
💬 "Show all my token balances"
```

### 📤 Token Transfers
```
💬 "Send 10 USDT to 0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
💬 "Transfer 0.1 BNB to alice.eth"
💬 "Send 50 USDC to my friend's wallet"
```

### 🔄 Token Swaps
```
💬 "Swap 100 USDT for USDC"
💬 "Exchange 0.5 BNB to WETH"
💬 "Convert 1000 BUSD to BNB"
```

### 📝 Space & Time info
```
💬 "Find top 10 whale wallets who is doing millions of transactions yearly on Avalanche"
```

### 🎯 AI Credit Purchases
```
💬 "Buy $10 worth of OpenRouter credits"
💬 "Purchase $25 OpenRouter credits with USDC"
```

---

## 🔑 API Keys Setup

### 🎯 0xGasless API Key
1. 🌐 Visit [0xGasless Dashboard](https://dashboard.0xgasless.com)
2. 📝 Create an account and new project
3. 🔑 Copy your API key
4. 💳 Add credits to your account

### 🤖 OpenRouter API Key (Optional)
1. 🌐 Visit [OpenRouter.ai](https://openrouter.ai)
2. 📝 Sign up and navigate to API Keys
3. 🔑 Generate a new API key
4. 💰 Add credits for AI model access

---

## 🛠️ Development

### 🏗️ Local Development Setup

```bash
# Clone the repository
git clone https://github.com/0xgasless/mcp
cd mcp

# Install dependencies
npm install

# Build the project
npm run build

# Development mode with hot reload
npm run dev

# Start the server
npm start
```

### 📁 Project Structure

```
src/
├── 🎯 main.ts          # Core MCP server implementation
├── 🚀 index.ts         # CLI entry point & configuration
├── 📋 version.ts       # Version management
└── 📝 types/           # TypeScript definitions
```

---

## 🔐 Security & Best Practices

### 🛡️ Security Guidelines

- 🔒 **Private Keys**: Store securely in environment variables, never in code
- 🔑 **API Keys**: Keep 0xGasless and OpenRouter keys confidential
- 🏦 **Smart Accounts**: Enhanced security through account abstraction
- ⛽ **Gasless Operations**: No native tokens required for transactions

### ⚠️ Important Notes

- 🚫 Never share your private key with anyone
- 💾 Use environment variables for sensitive data
- 🔄 Regularly rotate your API keys
- 📊 Monitor your account usage and credits

---

## 🆘 Troubleshooting

### 🐛 Common Issues & Solutions

<details>
<summary>🔴 "Chain ID not supported"</summary>

**Solution:**
- ✅ Verify you're using a supported chain ID from the table above
- ✅ Check the [supported networks](#-supported-networks) section
</details>

<details>
<summary>🔴 "API Key invalid"</summary>

**Solution:**
- ✅ Verify your 0xGasless API key is correct
- ✅ Ensure sufficient credits in your 0xGasless account
- ✅ Check API key permissions and expiration
</details>

<details>
<summary>🔴 "Insufficient balance"</summary>

**Solution:**
- ✅ Check token balance before operations
- ✅ Ensure you have enough tokens for the transaction
- ✅ Verify token contract address is correct
</details>

<details>
<summary>🔴 "Private key format error"</summary>

**Solution:**
- ✅ Ensure private key starts with "0x"
- ✅ Verify it's exactly 66 characters (64 + "0x")
- ✅ Check for any extra spaces or characters
</details>

### 🔍 Debug Mode

Enable detailed logging for troubleshooting:

```bash
DEBUG=1 mcp
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🚀 Quick Contribution Guide

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. 💾 **Commit** your changes: `git commit -m 'Add amazing feature'`
4. 📤 **Push** to branch: `git push origin feature/amazing-feature`
5. 🔄 **Open** a Pull Request

### 📋 Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Add tests for new features
- ✅ Update documentation as needed
- ✅ Ensure all tests pass before submitting

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to the amazing teams and projects that make this possible:

- 🎯 **[0xGasless](https://0xgasless.com)** - Smart account infrastructure
- 🤖 **[Model Context Protocol](https://modelcontextprotocol.io)** - MCP specification
- 🧠 **[Claude](https://claude.ai)** - AI integration capabilities  
- 🌐 **[OpenRouter](https://openrouter.ai)** - AI API access platform

---

## 📚 Resources & Links

### 📖 Documentation
- 📘 [0xGasless Documentation](https://docs.0xgasless.com)
- 📗 [MCP Documentation](https://modelcontextprotocol.io/docs)
- 📙 [Claude MCP Guide](https://docs.anthropic.com/claude/docs/mcp)

### 🔗 Project Links
- 🏠 [GitHub Repository](https://github.com/0xgasless/mcp)
- 📦 [npm Package](https://www.npmjs.com/package/0xgasless-mcp)
- 🐛 [Report Issues](https://github.com/0xgasless/mcp/issues)
- 💬 [Discussions](https://github.com/0xgasless/mcp/discussions)

---

<div align="center">

**🚀 Made with ❤️ for the blockchain community**

*Empowering AI-driven blockchain interactions*

[![Follow on GitHub]](https://github.com/0xgasless)
[![Star this repo]](https://github.com/0xgasless/mcp)

</div>
