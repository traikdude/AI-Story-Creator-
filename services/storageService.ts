
import { Story } from '../types';

const getStorageKey = (userId: string) => `stories_${userId}`;

export const storageService = {
    saveStory: (userId: string, storyData: Story): Story => {
        try {
            const key = getStorageKey(userId);
            const stories = JSON.parse(localStorage.getItem(key) || '[]') as Story[];
            
            const existingStoryIndex = stories.findIndex(s => s.id === storyData.id);

            if (existingStoryIndex > -1) {
                // Update existing story
                stories[existingStoryIndex] = storyData;
            } else {
                // Add new story to the beginning
                stories.unshift(storyData);
            }
            
            localStorage.setItem(key, JSON.stringify(stories));
            return storyData;
        } catch (e) {
            console.error("Error saving story:", e);
            throw e;
        }
    },
    getStories: (userId: string): Story[] => {
        try {
            const key = getStorageKey(userId);
            const stories = JSON.parse(localStorage.getItem(key) || '[]') as Story[];
            return stories.map(story => ({
                ...story,
                createdAt: story.createdAt, // Dates are already ISO strings
            }));
        } catch (error) {
            console.error("Error loading stories:", error);
            return [];
        }
    }
};
