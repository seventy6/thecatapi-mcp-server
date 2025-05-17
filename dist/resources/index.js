"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCatResources = registerCatResources;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const formatters_js_1 = require("../utils/formatters.js");
function registerCatResources(server, catApiClient) {
    // Register cat resource by ID
    server.resource("cat", new mcp_js_1.ResourceTemplate("cat://{id}", { list: undefined }), async (uri, { id }) => {
        const image = await catApiClient.getImage(id);
        return (0, formatters_js_1.formatCatResource)(uri.href, image);
    });
    // Register breed resource by ID
    server.resource("breed", new mcp_js_1.ResourceTemplate("breed://{id}", { list: undefined }), async (uri, { id }) => {
        const breed = await catApiClient.getBreed(id);
        return (0, formatters_js_1.formatBreedResource)(uri.href, breed);
    });
    // Register search resource
    server.resource("cats-search", new mcp_js_1.ResourceTemplate("cats://search?limit={limit}&breed_id={breed_id}&has_breeds={has_breeds}", {
        list: undefined
    }), async (uri, { limit, breed_id, has_breeds }) => {
        const options = {
            limit: parseInt(limit || "10"),
        };
        if (breed_id)
            options.breed_ids = breed_id;
        if (has_breeds !== undefined) {
            options.has_breeds = has_breeds === "true";
        }
        const images = await catApiClient.searchImages(options);
        return {
            contents: images.map(image => ({
                uri: `cat://${image.id}`,
                title: `Cat ${image.id}`,
                text: image.breeds && image.breeds.length > 0
                    ? `A ${image.breeds[0].name} cat`
                    : "A beautiful cat",
                image: image.url,
            })),
        };
    });
}
