import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { dbTool, dbToolHandler } from "./servers/db-tool.js";
import { webSearchTool, webSearchHandler } from "./servers/web-search-tool.js";
import { llmRouterTool, llmRouterHandler } from "./servers/llm-router.js";
const server = new Server(
  {
    name: "voice-agent-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
// ✅ Register your actual tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [dbTool, webSearchTool, llmRouterTool],
  };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (name === llmRouterTool.name) {
    return await llmRouterHandler(args);
  } else if (name === dbTool.name) {
    return await dbToolHandler(args);
  } else if (name === webSearchTool.name) {
    return await webSearchHandler(args);
  }
  throw new Error(`Unknown tool: ${name}`);
});
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((err) => {
  console.error("❌ MCP Server failed to start:", err);
});
