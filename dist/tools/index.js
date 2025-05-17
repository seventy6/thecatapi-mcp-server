"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCatTools = registerCatTools;
const zod_1 = require("zod");
function registerCatTools(server, catApiClient) {
    // Get random cat images
    server.tool("getRandomCat", {
        limit: zod_1.z.number().min(1).max(10).optional().default(1),
        breed_id: zod_1.z.string().optional(),
        has_breeds: zod_1.z.boolean().optional(),
    }, async (params) => {
        const options = {
            limit: params.limit,
            order: "RAND"
        };
        if (params.breed_id)
            options.breed_ids = params.breed_id;
        if (params.has_breeds !== undefined)
            options.has_breeds = params.has_breeds;
        const images = await catApiClient.searchImages(options);
        const imageUrls = images.map(img => img.url).join("\n");
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: `Here ${params.limit === 1 ? "is" : "are"} ${params.limit} random cat ${params.limit === 1 ? "image" : "images"}:\n\n${imageUrls}`,
                }
            ],
        };
    });
    // Search for cat images
    server.tool("searchCats", {
        limit: zod_1.z.number().min(1).max(25).optional().default(10),
        breed_id: zod_1.z.string().optional(),
        category_id: zod_1.z.string().optional(),
        has_breeds: zod_1.z.boolean().optional(),
        order: zod_1.z.enum(["ASC", "DESC", "RAND"]).optional().default("RAND"),
        page: zod_1.z.number().min(0).optional().default(0),
        mime_types: zod_1.z.string().optional(),
    }, async (params) => {
        const options = {
            limit: params.limit,
            page: params.page,
            order: params.order,
        };
        if (params.breed_id)
            options.breed_ids = params.breed_id;
        if (params.category_id)
            options.category_ids = params.category_id;
        if (params.has_breeds !== undefined)
            options.has_breeds = params.has_breeds;
        if (params.mime_types)
            options.mime_types = params.mime_types;
        const images = await catApiClient.searchImages(options);
        if (images.length === 0) {
            return {
                structuredContent: {},
                content: [
                    {
                        type: "text",
                        text: "No cat images found matching your criteria.",
                    },
                ],
            };
        }
        const imageUrls = images.map(img => img.url).join("\n");
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: `Found ${images.length} cat ${images.length === 1 ? "image" : "images"}:\n\n${imageUrls}`,
                }
            ],
        };
    });
    // Get list of cat breeds
    server.tool("getCatBreeds", {}, async () => {
        const breeds = await catApiClient.getBreeds();
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: `Found ${breeds.length} cat breeds:\n\n${breeds.map(breed => `- ${breed.name} (${breed.id})`).join("\n")}`,
                }
            ],
        };
    });
    // Get details about a specific breed
    server.tool("getCatBreedDetails", {
        breed_id: zod_1.z.string(),
    }, async (params) => {
        const breed = await catApiClient.getBreed(params.breed_id);
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: `
# ${breed.name}

**Origin**: ${breed.origin || 'Unknown'}
**Temperament**: ${breed.temperament || 'Not specified'}
**Description**: ${breed.description || 'No description available'}

**Characteristics**:
- Intelligence: ${breed.intelligence || '?'}/5
- Energy Level: ${breed.energy_level || '?'}/5
- Affection Level: ${breed.affection_level || '?'}/5
- Child Friendly: ${breed.child_friendly || '?'}/5
- Dog Friendly: ${breed.dog_friendly || '?'}/5
- Stranger Friendly: ${breed.stranger_friendly || '?'}/5

${breed.wikipedia_url ? `[Learn more on Wikipedia](${breed.wikipedia_url})` : ''}
`.trim(),
                }
            ],
        };
    });
    // Favorite a cat image
    server.tool("favoriteCat", {
        image_id: zod_1.z.string(),
        user_id: zod_1.z.string().optional(),
    }, async (params) => {
        const result = await catApiClient.favoriteCatImage(params.image_id, params.user_id);
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: `Successfully favorited cat image with ID: ${params.image_id}. Favorite ID: ${result.id}`,
                },
            ],
        };
    });
    // Upload a cat image (scaffold only)
    server.tool("uploadCat", {
        image_url: zod_1.z.string().url(),
        sub_id: zod_1.z.string().optional(),
        breed_ids: zod_1.z.string().optional(),
    }, async () => {
        // This is just a scaffold - actual implementation would require handling file uploads
        return {
            structuredContent: {},
            content: [
                {
                    type: "text",
                    text: "The uploadCat feature is not implemented in this demo. In a real implementation, this would upload a cat image to TheCatAPI.",
                },
            ],
        };
    });
}
