"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function testMcpServer() {
    const serverUrl = "http://localhost:3000/mcp";
    console.log("Testing MCP server at:", serverUrl);
    console.log("----------------------------");
    try {
        // Initialize the server
        console.log("1. Initializing server...");
        const initResponse = await (0, node_fetch_1.default)(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "initialize",
                params: {
                    capabilities: {},
                    clientInfo: {
                        name: "TestClient",
                        version: "1.0.0",
                    },
                },
            }),
        });
        const initResult = await initResponse.json();
        console.log("Server initialized:", JSON.stringify(initResult, null, 2));
        // Get the session ID from the response headers
        const sessionId = initResponse.headers.get('mcp-session-id');
        console.log("Session ID:", sessionId);
        console.log("----------------------------");
        if (!sessionId) {
            throw new Error("No session ID returned from server");
        }
        // List available tools
        console.log("2. Listing available tools...");
        const toolsResponse = await (0, node_fetch_1.default)(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mcp-session-id": sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 2,
                method: "mcp/tool/list",
                params: {},
            }),
        });
        const toolsResult = await toolsResponse.json();
        console.log("Available tools:", JSON.stringify(toolsResult, null, 2));
        console.log("----------------------------");
        // Test getRandomCat tool
        console.log("3. Testing getRandomCat tool...");
        const randomCatResponse = await (0, node_fetch_1.default)(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mcp-session-id": sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 3,
                method: "mcp/tool/invoke",
                params: {
                    tool: "getRandomCat",
                    parameters: {
                        limit: 1,
                    },
                },
            }),
        });
        const randomCatResult = await randomCatResponse.json();
        console.log("Random Cat Result:", JSON.stringify(randomCatResult, null, 2));
        console.log("----------------------------");
        // Test getCatBreeds tool
        console.log("4. Testing getCatBreeds tool...");
        const breedsResponse = await (0, node_fetch_1.default)(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mcp-session-id": sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 4,
                method: "mcp/tool/invoke",
                params: {
                    tool: "getCatBreeds",
                    parameters: {},
                },
            }),
        });
        const breedsResult = await breedsResponse.json();
        console.log("Breeds Result (truncated):", JSON.stringify({
            id: breedsResult.id,
            jsonrpc: breedsResult.jsonrpc,
            result: breedsResult.result ? {
                content: breedsResult.result.content ?
                    breedsResult.result.content.slice(0, 2) : []
            } : {}
        }, null, 2));
        console.log("----------------------------");
        // Test resource access
        console.log("5. Testing resource listing...");
        const resourcesResponse = await (0, node_fetch_1.default)(serverUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mcp-session-id": sessionId
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 5,
                method: "mcp/resource/list",
                params: {},
            }),
        });
        const resourcesResult = await resourcesResponse.json();
        console.log("Available resources:", JSON.stringify(resourcesResult, null, 2));
        console.log("----------------------------");
        console.log("Test completed successfully!");
    }
    catch (error) {
        console.error("Test failed:", error);
    }
}
testMcpServer();
