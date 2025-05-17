import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CatApiClient } from "../api/catApiClient.js";
import { formatCatResource, formatBreedResource } from "../utils/formatters.js";

export function registerCatResources(server: McpServer, catApiClient: CatApiClient) {
  // Register cat resource by ID
  server.resource(
    "cat",
    new ResourceTemplate("cat://{id}", { list: undefined }),
    async (uri, { id }) => {
      const image = await catApiClient.getImage(id as string);
      return formatCatResource(uri.href, image);
    }
  );
  
  // Register breed resource by ID
  server.resource(
    "breed",
    new ResourceTemplate("breed://{id}", { list: undefined }),
    async (uri, { id }) => {
      const breed = await catApiClient.getBreed(id as string);
      return formatBreedResource(uri.href, breed);
    }
  );
  
  // Register search resource
  server.resource(
    "cats-search",
    new ResourceTemplate("cats://search?limit={limit}&breed_id={breed_id}&has_breeds={has_breeds}", { 
      list: undefined 
    }),
    async (uri, { limit, breed_id, has_breeds }) => {
      const options: any = { 
        limit: parseInt(limit as string || "10"),
      };
      
      if (breed_id) options.breed_ids = breed_id;
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
    }
  );
}