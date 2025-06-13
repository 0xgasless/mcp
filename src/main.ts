import { Agentkit, getAllAgentkitActions } from "@0xgasless/agentkit";
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { version } from './version.js';
import { Writable } from 'stream';

// Load environment variables
dotenv.config();

// Global state for agentkit
let agentkitInstance: Agentkit | null = null;
let agentkitActions: any[] = [];
let toolsInitialized = false;

// Create a null stream to suppress stdout during operations
const nullStream = new Writable({
  write(chunk, encoding, callback) {
    callback();
  }
});

// Function to suppress stdout during execution
function withSuppressedStdout<T>(fn: () => Promise<T>): Promise<T> {
  const originalStdout = process.stdout.write;
  const originalConsoleLog = console.log;
  
  // Redirect stdout and console.log to null during execution
  process.stdout.write = nullStream.write.bind(nullStream);
  console.log = () => {}; // Completely silence console.log
  
  return fn().finally(() => {
    // Restore original stdout and console.log
    process.stdout.write = originalStdout;
    console.log = originalConsoleLog;
  });
}

// Initialize agentkit and get actions
async function initializeAgentkit() {
  if (toolsInitialized && agentkitInstance) {
    return { agentkit: agentkitInstance, actions: agentkitActions };
  }

  try {
    console.error("🚀 Initializing 0xGasless Agentkit...");
    
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    const rpcUrl = process.env.RPC_URL as string;
    const apiKey = process.env.API_KEY as string;
    const chainID = Number(process.env.CHAIN_ID) || 56;

    console.error(`📋 Config: Chain ${chainID}`);

    // Configure agentkit with wallet - suppress any stdout output
    const agentkit = await withSuppressedStdout(async () => {
      return await Agentkit.configureWithWallet({
        privateKey,
        rpcUrl,
        apiKey,
        chainID,
      });
    });

    console.error("✅ Agentkit configured successfully");

    // Get all available actions from the agentkit
    const actions = getAllAgentkitActions();
    console.error(`📦 Found ${actions.length} agentkit actions`);

    agentkitInstance = agentkit;
    agentkitActions = actions;
    toolsInitialized = true;

    return { agentkit, actions };
  } catch (error) {
    console.error("❌ Failed to initialize Agentkit:", error);
    throw error;
  }
}

// Tool name mapping between MCP and AgentKit
const MCP_TO_AGENTKIT_MAPPING: Record<string, string> = {
  'get-address': 'get_address',
  'get-balance': 'get_balance', 
  'transfer-token': 'smart_transfer',
  'swap-tokens': 'smart_swap',
  'bridge-tokens': 'smart_bridge',
  'sxt-query-data': 'execute_sxt_sql'
};

// Convert MCP arguments to AgentKit arguments
function convertMcpArgsToAgentkitArgs(mcpToolName: string, mcpArgs: any): any {
  switch (mcpToolName) {
    case 'get-address':
      return {};

    case 'get-balance':
      if (mcpArgs.address === '0x0000000000000000000000000000000000000000') {
        return {};
      } else if (mcpArgs.address) {
        return {
          tokenAddresses: [mcpArgs.address]
        };
      }
      return {};

    case 'transfer-token':
      return {
        amount: mcpArgs.amount,
        tokenAddress: mcpArgs.address === '0x0000000000000000000000000000000000000000' ? 'eth' : mcpArgs.address,
        destination: mcpArgs.to
      };

    case 'swap-tokens':
      return {
        tokenIn: mcpArgs.fromToken,
        tokenOut: mcpArgs.toToken,
        amount: mcpArgs.amount
      };

    case 'bridge-tokens':
      return {
        fromChainId: mcpArgs.fromChainId,
        toChainId: mcpArgs.toChainId,
        tokenInAddress: mcpArgs.tokenInAddress,
        tokenOutAddress: mcpArgs.tokenOutAddress,
        amount: mcpArgs.amount,
        recipientAddress: mcpArgs.recipientAddress,
        slippage: mcpArgs.slippage,
        approveMax: mcpArgs.approveMax,
        payProtocolFee: mcpArgs.payProtocolFee,
      };

    case 'sxt-query-data':
      return {
        sqlText: mcpArgs.query,
      };

    default:
      return mcpArgs;
  }
}

// Convert agentkit actions to MCP tools format
function convertToMcpTools(): Tool[] {

  // Find the specific agentkit actions dynamically
  const getAddressAction = agentkitActions.find(a => a.name === 'get_address');
  const getBalanceAction = agentkitActions.find(a => a.name === 'get_balance');
  const transferTokenAction = agentkitActions.find(a => a.name === 'smart_transfer');
  const swapTokensAction = agentkitActions.find(a => a.name === 'smart_swap');
  const smartBridgeAction = agentkitActions.find(a => a.name === 'smart_bridge');
  const sxtSqlAction = agentkitActions.find(a => a.name === 'execute_sxt_sql');

  const tools: Tool[] = [];

  if (getAddressAction) {
    tools.push({
      name: 'get-address',
      description: getAddressAction.description,
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      },
    });
  }

  if (getBalanceAction) {
    tools.push({
      name: 'get-balance',
      description: getBalanceAction.description,
      inputSchema: {
        type: 'object',
        properties: {
          address: {
            type: 'string',
            description: 'Token contract address (use "0x0000000000000000000000000000000000000000" for native token)',
          },
        },
        required: [],
      },
    });
  }

  if (transferTokenAction) {
    tools.push({
      name: 'transfer-token',
      description: transferTokenAction.description,
      inputSchema: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'Recipient address',
          },
          address: {
            type: 'string',
            description: 'Token contract address (use "0x0000000000000000000000000000000000000000" for native token)',
          },
          amount: {
            type: 'string',
            description: 'Amount to transfer',
          },
        },
        required: ['to', 'address', 'amount'],
      },
    });
  }

  if (swapTokensAction) {
    tools.push({
      name: 'swap-tokens',
      description: swapTokensAction.description,
      inputSchema: {
        type: 'object',
        properties: {
          fromToken: {
            type: 'string',
            description: 'Source token address',
          },
          toToken: {
            type: 'string',
            description: 'Destination token address',
          },
          amount: {
            type: 'string',
            description: 'Amount to swap',
          },
        },
        required: ['fromToken', 'toToken', 'amount'],
      },
    });
  }

  if (smartBridgeAction) {
    tools.push({
      name: 'bridge-tokens',
      description: smartBridgeAction.description,
      inputSchema: {
        type: 'object',
        properties: {
          fromChainId: {
            type: 'number',
            description: 'The ID of the source chain (e.g., 1 for Ethereum)',
          },
          toChainId: {
            type: 'number',
            description: 'The ID of the destination chain (e.g., 137 for Polygon)',
          },
          tokenInAddress: {
            type: 'string',
            description: 'The address of the input token on the source chain',
          },
          tokenOutAddress: {
            type: 'string',
            description: 'The address of the output token on the destination chain',
          },
          amount: {
            type: 'string',
            description: 'The amount of input token to bridge (human-readable, e.g., \'100\')',
          },
          recipientAddress: {
            type: 'string',
            description: 'Optional: The address to receive tokens on the destination chain. Defaults to your wallet address.',
          },
          slippage: {
            type: 'string',
            description: 'Optional: Slippage tolerance in percentage (e.g., \'0.5\' for 0.5%). Default is \'1\'.',
          },
          approveMax: {
            type: 'boolean',
            description: 'Optional: Whether to approve maximum token allowance for the input token. Default is false.',
          },
          payProtocolFee: {
            type: 'boolean',
            description: 'Optional: Whether to include the deBridge protocol fee. Default is true. Smart account needs NATIVE currency for this.',
          },
        },
        required: ['fromChainId', 'toChainId', 'tokenInAddress', 'tokenOutAddress', 'amount'],
      },
    });
  }

  if (sxtSqlAction) {
    tools.push({
      name: 'sxt-query-data',
      description: sxtSqlAction.description + 
        '\n\nNote: This tool requires the SXT_API_KEY environment variable to be set.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The SQL query to execute.',
          },
        },
        required: ['query'],
      },
    });
  }

  return tools;
}

// Execute agentkit actions directly
async function executeAgentkitAction(toolName: string, args: any): Promise<string> {
  try {
    const { agentkit, actions } = await initializeAgentkit();
    
    // Get the correct action name
    const agentkitActionName = MCP_TO_AGENTKIT_MAPPING[toolName];
    if (!agentkitActionName) {
      throw new Error(`No mapping found for MCP tool: ${toolName}`);
    }

    // Find the action in the available actions
    const action = actions.find((a: any) => a.name === agentkitActionName);
    if (!action) {
      throw new Error(`Action ${agentkitActionName} not found in available actions`);
    }

    // Convert MCP arguments to AgentKit arguments
    const actionArgs = convertMcpArgsToAgentkitArgs(toolName, args);

    // Execute the action with suppressed stdout to prevent JSON parsing errors
    const result = await withSuppressedStdout(async () => {
      return await agentkit.run(action, actionArgs);
    });
    
    return result;

  } catch (error) {
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        return `Error: Insufficient funds for ${toolName}. Please ensure you have enough balance and gas.`;
      }
      if (error.message.includes('invalid address')) {
        return `Error: Invalid address provided for ${toolName}. Please check the address format.`;
      }
      if (error.message.includes('Smart Account is required')) {
        return `Error: Smart account configuration issue. Please check your environment variables.`;
      }
      return `Error executing ${toolName}: ${error.message}`;
    }
    
    return `Error executing ${toolName}: ${String(error)}`;
  }
}

// Validation function
function validateEnvironment(): boolean {
  const required = ['PRIVATE_KEY', 'RPC_URL', 'API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }
  
  // Validate private key format
  const privateKey = process.env.PRIVATE_KEY;
  if (privateKey && !privateKey.startsWith('0x')) {
    console.error('❌ PRIVATE_KEY should start with 0x');
    return false;
  }
  
  console.error('✅ Environment variables validated');
  return true;
}

// Log server info
function logServerInfo() {
  console.error('\n=== 0xGasless MCP SERVER ===');
  console.error(`Chain ID: ${process.env.CHAIN_ID || '56 (default)'}`);
  console.error(`Private Key: ${process.env.PRIVATE_KEY ? '[SET]' : '[NOT SET]'}`);
  console.error(`API Key: ${process.env.API_KEY ? '[SET]' : '[NOT SET]'}`);
  console.error('============================\n');
}

export async function main() {
  // Log server info and validate environment
  logServerInfo();
  
  if (!validateEnvironment()) {
    process.exit(1);
  }

  try {
    // Initialize agentkit early to catch any config issues
    await initializeAgentkit();
    console.error("✅ 0xGasless Agentkit initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Agentkit:", error);
    process.exit(1);
  }

  // Create MCP server
  const server = new Server(
    {
      name: '0xGasless MCP Server',
      version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Handle tools list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const mcpTools = convertToMcpTools();
    return { tools: mcpTools };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      const result = await executeAgentkitAction(name, args || {});
      return {
        content: [{ type: 'text', text: result }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  });

  // Connect to transport
  const transport = new StdioServerTransport();
  console.error('🔌 Starting MCP server...');
  await server.connect(transport);
  console.error('✅ 0xGasless MCP Server running');
}