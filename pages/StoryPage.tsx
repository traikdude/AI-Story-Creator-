
import React, { useState, useCallback, useEffect } from 'react';
import { Page, Story, StoryPart } from '../types';
import { generateStoryScene, generateStoryImage } from '../services/geminiService';
import { storageService } from '../services/storageService';
import Loader from '../components/Loader';
import StoryScript from '../components/StoryScript';
import StoryChoices from '../components/StoryChoices';

interface StoryPageProps {
    setPage: (page: Page) => void;
    storyData: Story;
    userId: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ setPage, storyData, userId }) => {
    const [story, setStory] = useState<Story>(storyData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const currentStoryPart: StoryPart | undefined = story.history[story.history.length - 1];

    useEffect(() => {
        // This ensures if we navigate back and forth, the state is fresh
        setStory(storyData);
    }, [storyData]);

    const handleChoose = useCallback(async (choiceIndex: number) => {
        if (!currentStoryPart) return;
        
        setIsLoading(true);
        setError('');
        
        // Optimistically update the user's choice
        const updatedHistory = [...story.history];
        updatedHistory[updatedHistory.length - 1].userChoice = choiceIndex;

        const choiceText = currentStoryPart.choices[choiceIndex].text;

        try {
            const tempStoryState: Story = { ...story, history: updatedHistory };
            setStory(tempStoryState);
            
            // Generate next scene
            const { scene, choices } = await generateStoryScene(tempStoryState, choiceText);
            
            // Generate image for the new scene
            const imageUrl = await generateStoryImage(scene.imagePrompt);

            // Create the new story part
            const newStoryPart: StoryPart = { scene, choices, imageUrl };
            const finalStoryState: Story = { ...story, history: [...updatedHistory, newStoryPart] };

            setStory(finalStoryState);
            storageService.saveStory(userId, finalStoryState);

        } catch (err) {
            console.error("Failed to advance story:", err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
            // Revert optimistic update on failure
            setStory(storyData);
        } finally {
            setIsLoading(false);
        }
    }, [currentStoryPart, story, userId, storyData, setPage]);

    if (!currentStoryPart) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
                <p className="text-red-500">Error: Story content is missing.</p>
                <button 
                    onClick={() => setPage({name: 'home'})} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Back to Home
                </button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <header className="flex justify-between items-center mb-4 max-w-5xl mx-auto">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{story.title}</h1>
                    <span className="text-gray-600 bg-gray-200 px-2 py-1 rounded text-xs font-medium">Scene {story.history.length}</span>
                </div>
                <button 
                    onClick={() => setPage({name: 'home'})} 
                    className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
                >
                    <span className="mr-1 text-lg">⌂</span> Back to Home
                </button>
            </header>
            <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
                <div className="relative">
                    <div 
                        className="w-full aspect-video bg-gray-800 flex items-center justify-center transition-all duration-500"
                    >
                        {isLoading ? (
                           <div className="text-center text-white">
                                <Loader />
                                <p className="mt-2 font-semibold">Generating next scene...</p>
                           </div>
                        ) : (
                           <img src={currentStoryPart.imageUrl} alt={currentStoryPart.scene.description} className="w-full h-full object-cover"/>
                        )}
                    </div>
                    {!isLoading && <span className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Establishing Shot
                    </span>}
                </div>
                <StoryScript script={currentStoryPart.scene} />
                {error && <p className="text-red-500 text-center pb-4">{error}</p>}
                <StoryChoices 
                    choices={currentStoryPart.choices} 
                    onChoose={handleChoose}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default StoryPage;
