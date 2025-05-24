#!/usr/bin/env node

import { main } from './main.js';
import { version } from './version.js';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
  console.log(version);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
0xGasless MCP Server v${version}

Usage: 0xgasless-mcp [options]

Options:
  -h, --help     Show this help message
  -v, --version  Show version number
  configure      Interactive Claude Desktop configuration

Environment Variables Required:
  PRIVATE_KEY             Your wallet private key (0x...)
  RPC_URL                 RPC endpoint URL
  API_KEY                 0xGasless API key
  CHAIN_ID                Chain ID (56=BSC, 8453=Base, etc.)
  OPENROUTER_API_KEY      OpenRouter API key (optional)

Example:
  PRIVATE_KEY=0x... RPC_URL=https://... API_KEY=... CHAIN_ID=56 0xgasless-mcp

For more information, visit:
  https://github.com/yourusername/0xgasless-mcp-server
`);
  process.exit(0);
}

// Interactive configuration
if (args.includes('configure')) {
  (async () => {
    await configureClaude();
    process.exit(0);
  })();
} else {
  // Start the MCP server
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

async function configureClaude() {
  console.log(`
🔧 0xGasless MCP Server Configuration
====================================

This will help you configure Claude Desktop to use 0xGasless MCP Server.
`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise(resolve => rl.question(prompt, resolve));

  try {
    // Detect Claude Desktop config path
    const homeDir = os.homedir();
    let claudeConfigPath: string;
    
    if (process.platform === 'darwin') {
      claudeConfigPath = path.join(homeDir, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    } else if (process.platform === 'win32') {
      claudeConfigPath = path.join(homeDir, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
    } else {
      claudeConfigPath = path.join(homeDir, '.config', 'Claude', 'claude_desktop_config.json');
    }

    console.log(`📁 Claude config location: ${claudeConfigPath}`);

    // Get configuration values
    console.log(`\n🔑 Please provide your configuration values:`);
    
    const privateKey = await question('Private Key (0x...): ');
    if (!privateKey.startsWith('0x')) {
      console.log('❌ Private key should start with 0x');
      process.exit(1);
    }

    const rpcUrl = await question('RPC URL (https://...): ');
    if (!rpcUrl.startsWith('http')) {
      console.log('❌ RPC URL should start with http:// or https://');
      process.exit(1);
    }

    const apiKey = await question('0xGasless API Key: ');
    if (!apiKey) {
      console.log('❌ API Key is required');
      process.exit(1);
    }

    const chainIdInput = await question('Chain ID (56 for BSC, 8453 for Base, etc.): ');
    const chainId = chainIdInput || '56';

    const openRouterKey = await question('OpenRouter API Key (optional, press Enter to skip): ');

    // Prepare the configuration
    const mcpConfig = {
      command: "npx",
      args: ["0xgasless-mcp"],
      env: {
        PRIVATE_KEY: privateKey,
        RPC_URL: rpcUrl,
        API_KEY: apiKey,
        CHAIN_ID: chainId,
        ...(openRouterKey && { OPENROUTER_API_KEY: openRouterKey })
      }
    };

    // Read existing config or create new one
    let config: any = {};
    
    if (fs.existsSync(claudeConfigPath)) {
      try {
        const existingConfig = fs.readFileSync(claudeConfigPath, 'utf8');
        config = JSON.parse(existingConfig);
        console.log('📖 Found existing Claude config');
      } catch (error) {
        console.log('⚠️  Could not parse existing config, creating new one');
      }
    } else {
      console.log('📝 Creating new Claude config');
      
      // Create directory if it doesn't exist
      const configDir = path.dirname(claudeConfigPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
    }

    // Ensure mcpServers exists
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Check if 0xgasless config already exists
    if (config.mcpServers['0xgasless']) {
      const overwrite = await question('⚠️  0xgasless MCP server is already configured. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Configuration cancelled');
        rl.close();
        return;
      }
    }

    // Add the 0xgasless configuration
    config.mcpServers['0xgasless'] = mcpConfig;

    // Write the configuration
    fs.writeFileSync(claudeConfigPath, JSON.stringify(config, null, 2));

    console.log(`
✅ Configuration saved successfully!

📋 Configuration added to Claude Desktop:
   ${claudeConfigPath}

🔄 Next steps:
   1. Restart Claude Desktop
   2. Start a new conversation
   3. Try: "What's my wallet address?" or "Check my balance"

🌐 Your configuration:
   Chain: ${getChainName(chainId)} (${chainId})
   OpenRouter: ${openRouterKey ? 'Configured' : 'Not configured'}

🎉 You're ready to use 0xGasless with Claude!
`);

  } catch (error) {
    console.error('❌ Configuration failed:', error);
  } finally {
    rl.close();
  }
}

function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    '1': 'Ethereum',
    '56': 'BSC (Binance Smart Chain)',
    '137': 'Polygon',
    '8453': 'Base',
    '43114': 'Avalanche',
    '250': 'Fantom',
    '1284': 'Moonbeam',
    '1088': 'Metis'
  };
  return chains[chainId] || `Chain ${chainId}`;
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