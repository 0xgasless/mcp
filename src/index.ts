#!/usr/bin/env node

import { main } from './main.js';
import { version } from './version.js';

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  console.log(version);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
0xGasless MCP Server v${version}

Usage: 0xgasless-mcp-server [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version number
  configure      Configure Claude Desktop integration

Environment Variables Required:
  PRIVATE_KEY             Your wallet private key (0x...)
  RPC_URL                 RPC endpoint URL
  API_KEY                 0xGasless API key
  CHAIN_ID                Chain ID (56=BSC, 8453=Base, etc.)
  OPENROUTER_API_KEY      OpenRouter API key (optional)

Example:
  PRIVATE_KEY=0x... RPC_URL=https://... API_KEY=... CHAIN_ID=56 0xgasless-mcp-server

For more information, visit:
  https://github.com/yourusername/0xgasless-mcp-server
`);
  process.exit(0);
}

if (args.includes('configure')) {
  console.log(`
📋 Claude Desktop Configuration

Add this to your Claude Desktop config file:

macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\\Claude\\claude_desktop_config.json

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

🔑 Get your API keys:
- 0xGasless: https://dashboard.0xgasless.com
- OpenRouter: https://openrouter.ai (optional)

🌐 Supported networks:
- BSC (56), Base (8453), Ethereum (1), Polygon (137)
- Avalanche (43114), Fantom (250), Moonbeam (1284), Metis (1088)
`);
  process.exit(0);
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Start the MCP server
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});