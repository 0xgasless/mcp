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
    console.error(`📦 Found ${actions.length} agentkit actions:`);
    actions.forEach((action: any) => {
      console.error(`   - ${action.name}: ${action.description.substring(0, 60)}...`);
    });

    agentkitInstance = agentkit;
    agentkitActions = actions;
    toolsInitialized = true;

    return { agentkit, actions };
  } catch (error) {
    console.error("❌ Failed to initialize Agentkit:", error);
    throw error;
  }
}

// Convert action name to MCP tool name (snake_case to kebab-case)
function toMcpToolName(actionName: string): string {
  return actionName.replace(/_/g, '-');
}

// Convert MCP tool name back to action name (kebab-case to snake_case)
function toActionName(mcpToolName: string): string {
  return mcpToolName.replace(/-/g, '_');
}

// Convert Zod schema to JSON Schema for MCP
function zodToJsonSchema(zodSchema: any): any {
  try {
    // Get the shape of the Zod schema if it's an object
    if (zodSchema && zodSchema._def) {
      const def = zodSchema._def;
      
      // Handle ZodObject
      if (def.typeName === 'ZodObject' && def.shape) {
        const properties: Record<string, any> = {};
        const required: string[] = [];
        
        const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
        
        for (const [key, value] of Object.entries(shape)) {
          const fieldDef = (value as any)?._def;
          if (!fieldDef) continue;
          
          // Determine the type
          let type = 'string';
          let description = fieldDef.description || '';
          let isOptional = false;
          
          // Unwrap ZodOptional
          let innerDef = fieldDef;
          if (fieldDef.typeName === 'ZodOptional') {
            isOptional = true;
            innerDef = fieldDef.innerType?._def || fieldDef;
          }
          
          // Determine type from inner definition
          switch (innerDef.typeName) {
            case 'ZodString':
              type = 'string';
              break;
            case 'ZodNumber':
              type = 'number';
              break;
            case 'ZodBoolean':
              type = 'boolean';
              break;
            case 'ZodArray':
              type = 'array';
              break;
            default:
              type = 'string';
          }
          
          properties[key] = { type, description };
          
          if (!isOptional) {
            required.push(key);
          }
        }
        
        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined
        };
      }
    }
    
    // Fallback for unknown schemas
    return { type: 'object', properties: {} };
  } catch (error) {
    console.error("Error converting Zod schema:", error);
    return { type: 'object', properties: {} };
  }
}

// Convert agentkit actions to MCP tools format - DYNAMIC
function convertToMcpTools(): Tool[] {
  const tools: Tool[] = [];

  for (const action of agentkitActions) {
    try {
      const mcpToolName = toMcpToolName(action.name);
      const inputSchema = zodToJsonSchema(action.schema);
      
      tools.push({
        name: mcpToolName,
        description: action.description || `Execute ${action.name} action`,
        inputSchema: inputSchema,
      });
    } catch (error) {
      console.error(`Failed to convert action ${action.name}:`, error);
    }
  }

  console.error(`🔧 Converted ${tools.length} tools for MCP`);
  return tools;
}

// Execute agentkit actions directly - DYNAMIC
async function executeAgentkitAction(mcpToolName: string, args: any): Promise<string> {
  try {
    const { agentkit, actions } = await initializeAgentkit();
    
    // Convert MCP tool name to action name
    const actionName = toActionName(mcpToolName);

    // Find the action in the available actions
    const action = actions.find((a: any) => a.name === actionName);
    if (!action) {
      throw new Error(`Action '${actionName}' not found. Available actions: ${actions.map((a: any) => a.name).join(', ')}`);
    }

    console.error(`🎯 Executing action: ${actionName}`);
    console.error(`📥 Args: ${JSON.stringify(args)}`);

    // Execute the action with suppressed stdout to prevent JSON parsing errors
    const result = await withSuppressedStdout(async () => {
      return await agentkit.run(action, args);
    });
    
    console.error(`✅ Action completed: ${actionName}`);
    return result;

  } catch (error) {
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('insufficient funds')) {
        return `Error: Insufficient funds for ${mcpToolName}. Please ensure you have enough balance and gas.`;
      }
      if (error.message.includes('invalid address')) {
        return `Error: Invalid address provided for ${mcpToolName}. Please check the address format.`;
      }
      if (error.message.includes('Smart Account is required')) {
        return `Error: Smart account configuration issue. Please check your environment variables.`;
      }
      return `Error executing ${mcpToolName}: ${error.message}`;
    }
    
    return `Error executing ${mcpToolName}: ${String(error)}`;
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
  console.error('\n=== 0xGasless MCP SERVER (Local Agentkit) ===');
  console.error(`Version: ${version}`);
  console.error(`Chain ID: ${process.env.CHAIN_ID || '56 (default)'}`);
  console.error(`Private Key: ${process.env.PRIVATE_KEY ? '[SET]' : '[NOT SET]'}`);
  console.error(`API Key: ${process.env.API_KEY ? '[SET]' : '[NOT SET]'}`);
  console.error(`SXT API Key: ${process.env.SXT_API_KEY ? '[SET]' : '[NOT SET]'}`);
  console.error('==============================================\n');
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
    // Ensure Agentkit and actions are initialized before listing tools
    try {
      await initializeAgentkit();
    } catch (e) {
      console.error('❌ initializeAgentkit failed during tools/list:', e);
    }
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