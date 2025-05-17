"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCatResponse = formatCatResponse;
exports.formatBreedResponse = formatBreedResponse;
exports.formatCatResource = formatCatResource;
exports.formatBreedResource = formatBreedResource;
function formatCatResponse(image) {
    return {
        type: "image",
        data: image.url,
        mimeType: "image/jpeg",
        metadata: {
            id: image.id,
            width: image.width,
            height: image.height,
            breeds: image.breeds ? image.breeds.map(b => b.name).join(", ") : undefined,
            alt: image.breeds && image.breeds.length > 0
                ? `A ${image.breeds[0].name} cat`
                : "A cat image",
        }
    };
}
function formatBreedResponse(breed) {
    return {
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
    };
}
function formatCatResource(uri, image) {
    return {
        contents: [
            {
                uri,
                title: `Cat ${image.id}`,
                text: image.breeds && image.breeds.length > 0
                    ? `A ${image.breeds[0].name} cat`
                    : "A beautiful cat",
                image: image.url,
                metadata: {
                    id: image.id,
                    width: image.width,
                    height: image.height,
                    created_at: image.created_at,
                }
            }
        ]
    };
}
function formatBreedResource(uri, breed) {
    return {
        contents: [
            {
                uri,
                title: breed.name,
                text: `
${breed.description || 'No description available'}

**Origin**: ${breed.origin || 'Unknown'}
**Temperament**: ${breed.temperament || 'Not specified'}
**Life Span**: ${breed.life_span || 'Unknown'} years

**Characteristics**:
- Intelligence: ${breed.intelligence || '?'}/5
- Energy Level: ${breed.energy_level || '?'}/5
- Affection Level: ${breed.affection_level || '?'}/5
`.trim(),
                metadata: {
                    id: breed.id,
                    wikipedia_url: breed.wikipedia_url,
                    cfa_url: breed.cfa_url,
                    vetstreet_url: breed.vetstreet_url,
                }
            }
        ]
    };
}
