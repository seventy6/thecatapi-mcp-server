import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import { registerCatTools } from "./tools/index.js";
import { registerCatResources } from "./resources/index.js";
import { CatApiClient } from "./api/catApiClient.js";
import { config, SERVER_INFO } from "./config/index.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";

async function startServer() {
  try {
    // Create Express app
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Initialize TheCatAPI client
    const catApiClient = new CatApiClient(config.CAT_API_KEY);

    // Map to store transports by session ID
    const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

    // Handle POST requests for client-to-server communication
    app.post('/mcp', async (req, res) => {
      // Check for existing session ID
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sessionId) => {
            // Store the transport by session ID
            transports[sessionId] = transport;
          }
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
          }
        };
        
        // Create MCP server
        const server = new McpServer({ 
          name: SERVER_INFO.name, 
          version: SERVER_INFO.version,
        });

        // Register tools and resources
        registerCatTools(server, catApiClient);
        registerCatResources(server, catApiClient);

        // Connect to the MCP server
        await server.connect(transport);
      } else {
        // Invalid request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        return;
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body);
    });

    // Reusable handler for GET and DELETE requests
    const handleSessionRequest = async (req: express.Request, res: express.Response) => {
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
      }

      const transport = transports[sessionId];
      await transport.handleRequest(req, res);
    };

    // Handle GET requests for server-to-client notifications via SSE
    app.get('/mcp', handleSessionRequest);

    // Handle DELETE requests for session termination
    app.delete('/mcp', handleSessionRequest);

    // Health check endpoint
    app.get("/health", (req, res) => {
      res.status(200).json({ 
        status: "ok", 
        timestamp: new Date().toISOString(),
        server: SERVER_INFO,
      });
    });

    // Start server
    app.listen(config.PORT, "0.0.0.0", () => {
      console.log(`TheCatAPI MCP server running on port ${config.PORT}`);
      console.log(`MCP endpoint: http://localhost:${config.PORT}/mcp`);
      console.log(`Health check: http://localhost:${config.PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();