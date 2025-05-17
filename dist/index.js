"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const index_js_1 = require("./tools/index.js");
const index_js_2 = require("./resources/index.js");
const catApiClient_js_1 = require("./api/catApiClient.js");
const index_js_3 = require("./config/index.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
async function startServer() {
    try {
        // Create Express app
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Initialize TheCatAPI client
        const catApiClient = new catApiClient_js_1.CatApiClient(index_js_3.config.CAT_API_KEY);
        // Map to store transports by session ID
        const transports = {};
        // Handle POST requests for client-to-server communication
        app.post('/mcp', async (req, res) => {
            // Check for existing session ID
            const sessionId = req.headers['mcp-session-id'];
            let transport;
            if (sessionId && transports[sessionId]) {
                // Reuse existing transport
                transport = transports[sessionId];
            }
            else if (!sessionId && (0, types_js_1.isInitializeRequest)(req.body)) {
                // New initialization request
                transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
                    sessionIdGenerator: () => (0, crypto_1.randomUUID)(),
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
                const server = new mcp_js_1.McpServer({
                    name: index_js_3.SERVER_INFO.name,
                    version: index_js_3.SERVER_INFO.version,
                });
                // Register tools and resources
                (0, index_js_1.registerCatTools)(server, catApiClient);
                (0, index_js_2.registerCatResources)(server, catApiClient);
                // Connect to the MCP server
                await server.connect(transport);
            }
            else {
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
        const handleSessionRequest = async (req, res) => {
            const sessionId = req.headers['mcp-session-id'];
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
                server: index_js_3.SERVER_INFO,
            });
        });
        // Start server
        app.listen(index_js_3.config.PORT, "0.0.0.0", () => {
            console.log(`TheCatAPI MCP server running on port ${index_js_3.config.PORT}`);
            console.log(`MCP endpoint: http://localhost:${index_js_3.config.PORT}/mcp`);
            console.log(`Health check: http://localhost:${index_js_3.config.PORT}/health`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
