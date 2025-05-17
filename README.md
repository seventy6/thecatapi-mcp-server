# TheCatAPI MCP Server

A Model Context Protocol (MCP) server implementation for TheCatAPI, allowing AI assistants to interact with cat images, breeds, and related data through the standardized MCP interface.

## Features

- 🐱 Search for cat images with various filters
- 🧬 Browse cat breeds and their characteristics
- 📷 Get random cat images
- ⭐ Favorite cat images
- 🔄 Fully typed responses
- 🔒 API key management

## Prerequisites

- Node.js 18+
- TheCatAPI key (sign up at [thecatapi.com](https://thecatapi.com))

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your TheCatAPI key:
   ```
   CAT_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Build the project: `npm run build`
5. Start the server: `npm start`

## Development

Run the development server:

```
npm run dev
```

## Usage

The MCP server exposes the following endpoints:

- `/mcp` - The main MCP endpoint (using Streamable HTTP transport)
- `/health` - Health check endpoint

### Available Tools

- `getRandomCat` - Get random cat images with optional filtering
- `searchCats` - Search for cat images with various filtering options
- `getCatBreeds` - List all available cat breeds
- `getCatBreedDetails` - Get detailed information about a specific breed
- `favoriteCat` - Mark a cat image as favorite

### Available Resources

- `cat://{id}` - Get details about a specific cat by ID
- `breed://{id}` - Get details about a specific breed by ID
- `cats://search` - Search for cat images with filtering options

## Testing

To test the MCP server, run:

```
npx ts-node src/test/testClient.ts
```

## Example API Interactions

### 1. Initializing a Session

```json
// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "capabilities": {},
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "capabilities": {
      "tools": true,
      "resources": true
    },
    "serverInfo": {
      "name": "TheCatAPI-MCP-Server",
      "version": "1.0.0"
    }
  }
}
```

### 2. Getting Random Cat Images

```json
// Request
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "mcp/tool/invoke",
  "params": {
    "tool": "getRandomCat",
    "parameters": {
      "limit": 2,
      "has_breeds": true
    }
  }
}
```

## License

MIT