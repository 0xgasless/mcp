# 0xGasless MCP Server

A Model Context Protocol (MCP) server that enables Claude to interact with blockchain networks using 0xGasless smart accounts. Perform gasless transactions, swaps, transfers, and buy OpenRouter credits directly from Claude conversations.

## 🌟 Features

- **Gasless Transactions**: Execute blockchain operations without holding native tokens for gas
- **Multi-Chain Support**: Works on BSC, Base, Ethereum, Polygon, Avalanche, Fantom, Moonbeam, and Metis
- **Smart Account Integration**: Built on ERC-4337 account abstraction standard
- **OpenRouter Integration**: Buy AI credits directly with USDC
- **Claude Integration**: Seamless conversation-based blockchain interactions

## 🔧 Available Tools

1. **get-address**: Get your smart account wallet address
2. **get-balance**: Check token balances (supports all ERC20 tokens)
3. **transfer-token**: Send tokens gaslessly to any address
4. **swap-tokens**: Swap tokens without gas fees
5. **buy-openrouter-credits**: Purchase OpenRouter AI credits with USDC

## 🚀 Installation

### Global Installation (Recommended)

```bash
npm install -g 0xgasless-mcp-server
```

### Local Installation

```bash
npx 0xgasless-mcp-server
```

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file with the following variables:

```bash
# Required
PRIVATE_KEY=0x...                    # Your wallet private key
RPC_URL=https://...                  # RPC endpoint for your chain
API_KEY=your_0xgasless_api_key      # Get from https://dashboard.0xgasless.com
CHAIN_ID=56                         # Chain ID (56=BSC, 8453=Base, 1=Ethereum, etc.)

# Optional
OPENROUTER_API_KEY=your_openrouter_key  # For buying OpenRouter credits
```

### 2. Get Your API Keys

#### 0xGasless API Key
1. Visit [0xGasless Dashboard](https://dashboard.0xgasless.com)
2. Sign up and create a new project
3. Copy your API key

#### OpenRouter API Key (Optional)
1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up and go to API Keys
3. Create a new API key

### 3. Supported Networks

| Network | Chain ID | Native Token |
|---------|----------|--------------|
| BSC | 56 | BNB |
| Base | 8453 | ETH |
| Ethereum | 1 | ETH |
| Polygon | 137 | MATIC |
| Avalanche | 43114 | AVAX |
| Fantom | 250 | FTM |
| Moonbeam | 1284 | GLMR |
| Metis | 1088 | METIS |

## 🔗 Claude Desktop Integration

### Automatic Configuration

Run the configuration helper:

```bash
0xgasless-mcp configure
```

### Manual Configuration

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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
        "CHAIN_ID": "56",
        "OPENROUTER_API_KEY": "your_openrouter_key"
      }
    }
  }
}
```

## 💬 Usage Examples

Once configured, you can use natural language with Claude:

### Check Balances
- "What's my wallet balance?"
- "Check my USDC balance"
- "Show all my token balances"

### Transfer Tokens
- "Send 10 USDT to 0x..."
- "Transfer 0.1 BNB to alice.eth"

### Swap Tokens
- "Swap 100 USDT for USDC"
- "Exchange 0.5 BNB to WETH"

### Buy OpenRouter Credits
- "Buy $10 worth of OpenRouter credits"
- "Purchase $25 OpenRouter credits with USDC"

### Get Wallet Address
- "What's my wallet address?"
- "Show my smart account address"

## 🛠️ Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/0xgasless-mcp-server.git
cd 0xgasless-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Start the server
npm start
```

### Project Structure

```
src/
├── main.ts          # Main MCP server implementation
├── index.ts         # Entry point
├── version.ts       # Version information
└── types/           # TypeScript type definitions
```

## 🔐 Security Notes

- **Private Keys**: Never share your private key. Store it securely in environment variables.
- **API Keys**: Keep your 0xGasless and OpenRouter API keys private.
- **Smart Accounts**: Your smart account is derived from your private key but has enhanced security features.
- **Gasless Operations**: All transactions are sponsored, so you don't need native tokens for gas.

## 🆘 Troubleshooting

### Common Issues

1. **"Chain ID not supported"**
   - Ensure you're using a supported chain ID
   - Check the supported networks table above

2. **"API Key invalid"**
   - Verify your 0xGasless API key is correct
   - Ensure you have sufficient credits in your 0xGasless account

3. **"Insufficient balance"**
   - Check your token balance before transfers/swaps
   - Ensure you have enough tokens for the operation

4. **"Private key format error"**
   - Ensure your private key starts with "0x"
   - Verify the private key is 64 characters (plus "0x" prefix)

### Enable Debug Logging

Set environment variable for detailed logs:

```bash
DEBUG=1 0xgasless-mcp-server
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [0xGasless](https://0xgasless.com) for the smart account infrastructure
- [Model Context Protocol](https://modelcontextprotocol.io) for the MCP specification
- [Claude](https://claude.ai) for AI integration capabilities
- [OpenRouter](https://openrouter.ai) for AI API access

## 📚 Additional Resources

- [0xGasless Documentation](https://docs.0xgasless.com)
- [MCP Documentation](https://modelcontextprotocol.io/docs)
- [Claude MCP Guide](https://docs.anthropic.com/claude/docs/mcp)

## 🔗 Links

- [GitHub Repository](https://github.com/yourusername/0xgasless-mcp-server)
- [npm Package](https://www.npmjs.com/package/0xgasless-mcp-server)
- [Issues](https://github.com/yourusername/0xgasless-mcp-server/issues)
- [Discussions](https://github.com/yourusername/0xgasless-mcp-server/discussions)

---

**Made with ❤️ for the blockchain community**