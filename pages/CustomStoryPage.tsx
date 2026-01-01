
import React, { useState, useCallback } from 'react';
import { Page, Story } from '../types';
import { storageService } from '../services/storageService';
import { generateStoryScene, generateStoryImage } from '../services/geminiService';
import Loader from '../components/Loader';
import { CreateIcon } from '../components/icons';

interface CustomStoryPageProps {
    setPage: (page: Page) => void;
    userId: string;
}

// Simple sanitization function to prevent basic XSS.
const sanitizeInput = (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

const CustomStoryPage: React.FC<CustomStoryPageProps> = ({ setPage, userId }) => {
    const [storyDetails, setStoryDetails] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateStory = useCallback(async () => {
        setError('');
        if (!storyDetails.title.trim() || !storyDetails.description.trim()) {
            setError('Title and description are required.');
            return;
        }
        
        setIsLoading(true);
        try {
            let newStory: Story = {
                id: `story_${Date.now()}`,
                title: sanitizeInput(storyDetails.title),
                description: sanitizeInput(storyDetails.description),
                createdAt: new Date().toISOString(),
                history: [],
            };
            
            const { scene, choices } = await generateStoryScene(newStory);
            const imageUrl = await generateStoryImage(scene.imagePrompt);

            newStory.history.push({ scene, choices, imageUrl });
            const createdStory = storageService.saveStory(userId, newStory);
            setPage({ name: 'story', data: createdStory });

        } catch (err) {
            console.error("Failed to create custom story", err);
            setError(err instanceof Error ? err.message : 'Failed to create story. Please try again.');
            setIsLoading(false);
        }
    }, [storyDetails, userId, setPage]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStoryDetails(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex justify-center items-start">
            <div className="w-full max-w-md mt-12">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800">Custom Story Details</h1>
                </header>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Story Title
                            </label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={storyDetails.title} 
                                onChange={handleInputChange} 
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                placeholder="e.g., The Last Cyber-Samurai"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Story Description
                            </label>
                            <textarea 
                                name="description" 
                                id="description" 
                                value={storyDetails.description} 
                                onChange={handleInputChange} 
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                rows={5} 
                                placeholder="e.g., A lone warrior in a neon-drenched city fights to reclaim his honor..."
                                disabled={isLoading}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-r-lg">
                            <p className="font-bold">Art Style</p>
                            <p className="text-sm">
                                All stories use western comic book illustration style with bold colors and dynamic poses.
                            </p>
                        </div>
                        <div className="flex justify-end items-center gap-4 pt-4">
                            <button 
                                onClick={() => setPage({name: 'home'})} 
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100 transition" 
                                aria-label="Cancel custom story creation"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateStory}
                                disabled={isLoading || !storyDetails.title || !storyDetails.description} 
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-transform duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-40" 
                                aria-label="Create custom story"
                            >
                                {isLoading ? <Loader small/> : <><CreateIcon /> Create Story</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomStoryPage;
