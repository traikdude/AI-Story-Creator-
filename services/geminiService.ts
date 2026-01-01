
import { GoogleGenAI, Type } from "@google/genai";
import { Story, Scene, Choice, StoryPart } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        scene: {
            type: Type.OBJECT,
            description: "The details of the current scene, written in a screenplay format.",
            properties: {
                scene: { type: Type.STRING, description: "Scene heading (e.g., INT. CASTLE - DAY)." },
                description: { type: Type.STRING, description: "A one-paragraph, vivid description of the setting and mood." },
                character: { type: Type.STRING, description: "The primary character in the scene." },
                mutter: { type: Type.STRING, description: "Parenthetical action or internal thought for the character (e.g., muttering to themself)." },
                dialogue: { type: Type.STRING, description: "A single line of dialogue for the character." },
                action: { type: Type.STRING, description: "A sentence describing a key action or event that occurs at the end of the scene." },
                imagePrompt: { type: Type.STRING, description: "A detailed, dynamic prompt for an image generation model to create a 'western comic book style' illustration for this scene. Focus on character action, emotion, and setting. E.g., 'A grizzled detective in a trench coat, grim determination on his face, stands in a rain-soaked alleyway, looking at a mysterious symbol glowing on the wall, comic book art, bold lines, dramatic shadows.'" }
            },
        },
        choices: {
            type: Type.ARRAY,
            description: "Three distinct choices for the user to decide what happens next.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The text for the choice." }
                }
            }
        }
    }
};

const generatePrompt = (story: Story, choiceText?: string): string => {
    let prompt = `You are an expert storyteller creating an interactive comic book adventure.
The story is titled "${story.title}".
The overall theme is: "${story.description}".
The art style is a western comic book style with bold colors and dynamic poses.

`;

    if (story.history.length === 0) {
        prompt += "Generate the very first scene of the story based on the title and theme.";
    } else {
        const lastPart = story.history[story.history.length - 1];
        prompt += `Here is the story so far:\n`;
        story.history.forEach((part, index) => {
            prompt += `Scene ${index + 1}: ${part.scene.description} ${part.scene.action}\n`;
        });
        prompt += `\nThe user just chose: "${choiceText || 'Start the story'}".\n\nNow, generate the next scene that logically follows this choice. Make it compelling and advance the plot.`;
    }
    
    prompt += "\n\nProvide your response in the required JSON format.";

    return prompt;
};

export const generateStoryScene = async (story: Story, choiceText?: string): Promise<{ scene: Scene, choices: Choice[] }> => {
    try {
        const prompt = generatePrompt(story, choiceText);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: storyGenerationSchema,
            }
        });

        const jsonStr = response.text.trim();
        // The Gemini API can sometimes wrap the JSON in ```json ... ```, so we strip that.
        const cleanedJson = jsonStr.replace(/^```json\s*|```\s*$/g, '');
        const result = JSON.parse(cleanedJson);
        
        if (!result.scene || !result.choices) {
            throw new Error("Invalid JSON structure from API");
        }

        return result;

    } catch (error) {
        console.error("Error generating story scene:", error);
        throw new Error("Failed to generate the next part of the story. Please try again.");
    }
};

export const generateStoryImage = async (imagePrompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API did not return any images.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating story image:", error);
        // Return a placeholder on failure to not break the UI
        return 'https://picsum.photos/seed/error/1280/720';
    }
};
