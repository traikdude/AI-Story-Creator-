
import React, { useState, useEffect, useCallback } from 'react';
import { AdventureTheme, Page, Story } from '../types';
import { initialAdventures } from '../constants';
import { storageService } from '../services/storageService';
import { generateStoryScene, generateStoryImage } from '../services/geminiService';
import AdventureCard from '../components/AdventureCard';
import ContinueAdventureCard from '../components/ContinueAdventureCard';
import { StarIcon } from '../components/icons';
import Loader from '../components/Loader';

interface HomePageProps {
    setPage: (page: Page) => void;
    userId: string;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, userId }) => {
    const [adventures] = useState<AdventureTheme[]>(initialAdventures);
    const [userAdventures, setUserAdventures] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const stories = storageService.getStories(userId);
        setUserAdventures(stories);
    }, [userId]);

    const handleStartAdventure = useCallback(async (adventure: AdventureTheme) => {
        setIsLoading(true);
        setError('');
        try {
            let newStory: Story = {
                id: `story_${Date.now()}`,
                title: adventure.title,
                description: adventure.description,
                createdAt: new Date().toISOString(),
                history: [],
            };

            const { scene, choices } = await generateStoryScene(newStory);
            const imageUrl = await generateStoryImage(scene.imagePrompt);

            newStory.history.push({ scene, choices, imageUrl });
            const savedStory = storageService.saveStory(userId, newStory);
            setPage({ name: 'story', data: savedStory });

        } catch (err) {
            console.error('Failed to start adventure:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [userId, setPage]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)] bg-white">
                <Loader />
                <p className="mt-4 text-gray-600 font-semibold">Creating your new adventure...</p>
                <p className="mt-2 text-sm text-gray-500">This may take a moment.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Create Your Interactive Story
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                        Choose from curated story categories or create your own unique adventure. Each story features AI-generated scenes, choices, and stunning comic book artwork.
                    </p>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </header>

                <main>
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Choose Your Adventure</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {adventures.map(adv => (
                                <AdventureCard 
                                    key={adv.id} 
                                    {...adv} 
                                    onClick={() => handleStartAdventure(adv)} 
                                />
                            ))}
                        </div>
                    </section>
                    
                    <section className="mb-16">
                        <div className="text-center border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-blue-400 transition-colors duration-300 bg-white">
                            <StarIcon />
                            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
                                Create a Custom Story
                            </h2>
                            <p className="text-gray-600 max-w-xl mx-auto mb-6">
                                Have a unique idea? Create your own story with custom themes and characters.
                            </p>
                            <button 
                                onClick={() => setPage({name: 'custom'})} 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105"
                            >
                                Start Custom Story
                            </button>
                        </div>
                    </section>

                    {userAdventures.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Continue Your Adventures
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {userAdventures.map(adv => (
                                    <ContinueAdventureCard 
                                        key={adv.id} 
                                        {...adv} 
                                        onClick={() => setPage({ name: 'story', data: adv })} 
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default HomePage;
