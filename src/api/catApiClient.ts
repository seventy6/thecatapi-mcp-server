import { TheCatAPI, Breed } from "@thatapicompany/thecatapi";

// Define types based on the actual API
export interface CatImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
  breeds?: CatBreed[];
  created_at?: string;
}

export interface CatBreed {
  id: string;
  name: string;
  temperament?: string;
  description?: string;
  origin?: string;
  life_span?: string;
  wikipedia_url?: string;
  cfa_url?: string;
  vetstreet_url?: string;
  intelligence?: number;
  energy_level?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  stranger_friendly?: number;
}

export class CatApiClient {
  private client: TheCatAPI;
  
  constructor(apiKey: string) {
    this.client = new TheCatAPI(apiKey);
  }
  
  async searchImages(options: { 
    limit?: number; 
    breed_ids?: string;
    category_ids?: string;
    has_breeds?: boolean;
    order?: "ASC" | "DESC" | "RAND";
    page?: number;
    mime_types?: string;
  }): Promise<CatImage[]> {
    try {
      // Convert our API to match TheCatAPI's expected format
      const apiOptions: any = {
        limit: options.limit,
        page: options.page,
        order: options.order,
        hasBreeds: options.has_breeds,
      };
      
      if (options.breed_ids) {
        // The API expects an array of Breed enums, but we're passing a string
        // This is a simplification for our MCP server
        apiOptions.breeds = [options.breed_ids];
      }
      
      if (options.mime_types) {
        apiOptions.mimeTypes = options.mime_types.split(',');
      }
      
      const images = await this.client.images.searchImages(apiOptions);
      
      // Convert to our simplified format
      return images.map(img => ({
        id: img.id,
        url: img.url,
        width: img.width,
        height: img.height,
        breeds: img.breeds?.map(breed => ({
          id: breed.id,
          name: breed.name,
          temperament: breed.temperament,
          description: breed.description,
          origin: breed.origin,
          life_span: breed.lifeSpan,
          wikipedia_url: breed.wikipediaUrl,
          intelligence: breed.intelligence,
          energy_level: breed.energyLevel,
          affection_level: breed.affectionLevel,
          child_friendly: breed.childFriendly,
          dog_friendly: breed.dogFriendly,
          stranger_friendly: breed.strangerFriendly,
        })),
        created_at: new Date().toISOString(), // Fallback since the API doesn't provide this
      }));
    } catch (error) {
      console.error("Error searching cat images:", error);
      throw error;
    }
  }
  
  async getImage(imageId: string): Promise<CatImage> {
    try {
      const image = await this.client.images.getImage(imageId);
      
      return {
        id: image.id,
        url: image.url,
        width: image.width,
        height: image.height,
        breeds: image.breeds?.map(breed => ({
          id: breed.id,
          name: breed.name,
          temperament: breed.temperament,
          description: breed.description,
          origin: breed.origin,
          life_span: breed.lifeSpan,
          wikipedia_url: breed.wikipediaUrl,
          intelligence: breed.intelligence,
          energy_level: breed.energyLevel,
          affection_level: breed.affectionLevel,
          child_friendly: breed.childFriendly,
          dog_friendly: breed.dogFriendly,
          stranger_friendly: breed.strangerFriendly,
        })),
        created_at: new Date().toISOString(), // Fallback since the API doesn't provide this
      };
    } catch (error) {
      console.error(`Error fetching cat image with id ${imageId}:`, error);
      throw error;
    }
  }
  
  async getBreeds(): Promise<CatBreed[]> {
    try {
      // Since the API doesn't have a direct breeds endpoint in the client,
      // we'll use searchImages with hasBreeds=true and extract unique breeds
      const images = await this.client.images.searchImages({ 
        hasBreeds: true,
        limit: 100 
      });
      
      // Extract unique breeds
      const breedsMap = new Map<string, CatBreed>();
      
      images.forEach(img => {
        img.breeds?.forEach(breed => {
          if (!breedsMap.has(breed.id)) {
            breedsMap.set(breed.id, {
              id: breed.id,
              name: breed.name,
              temperament: breed.temperament,
              description: breed.description,
              origin: breed.origin,
              life_span: breed.lifeSpan,
              wikipedia_url: breed.wikipediaUrl,
              intelligence: breed.intelligence,
              energy_level: breed.energyLevel,
              affection_level: breed.affectionLevel,
              child_friendly: breed.childFriendly,
              dog_friendly: breed.dogFriendly,
              stranger_friendly: breed.strangerFriendly,
            });
          }
        });
      });
      
      return Array.from(breedsMap.values());
    } catch (error) {
      console.error("Error fetching cat breeds:", error);
      throw error;
    }
  }
  
  async getBreed(breedId: string): Promise<CatBreed> {
    try {
      // Since the API doesn't have a direct breed endpoint,
      // we'll search for images with this breed and extract the breed info
      const images = await this.client.images.searchImages({ 
        breeds: [breedId as any],
        limit: 1,
        hasBreeds: true
      });
      
      if (images.length === 0 || !images[0].breeds || images[0].breeds.length === 0) {
        throw new Error(`Breed with ID ${breedId} not found`);
      }
      
      const breed = images[0].breeds[0];
      
      return {
        id: breed.id,
        name: breed.name,
        temperament: breed.temperament,
        description: breed.description,
        origin: breed.origin,
        life_span: breed.lifeSpan,
        wikipedia_url: breed.wikipediaUrl,
        intelligence: breed.intelligence,
        energy_level: breed.energyLevel,
        affection_level: breed.affectionLevel,
        child_friendly: breed.childFriendly,
        dog_friendly: breed.dogFriendly,
        stranger_friendly: breed.strangerFriendly,
      };
    } catch (error) {
      console.error(`Error fetching breed with id ${breedId}:`, error);
      throw error;
    }
  }
  
  async favoriteCatImage(imageId: string, userId?: string): Promise<{ id: number }> {
    try {
      const result = await this.client.favourites.addFavourite(imageId, userId);
      return { id: result.id };
    } catch (error) {
      console.error(`Error favoriting cat image ${imageId}:`, error);
      throw error;
    }
  }

  // This is a scaffold - actual implementation would require handling file uploads
  async uploadImage(file: any, options?: {
    sub_id?: string;
  }): Promise<{ id: string; url: string; }> {
    try {
      // This is just a placeholder - in a real implementation, we would use the SDK
      console.log("Upload image called (not implemented)");
      return {
        id: "not-implemented",
        url: "https://example.com/not-implemented.jpg"
      };
    } catch (error) {
      console.error("Error uploading cat image:", error);
      throw error;
    }
  }
}