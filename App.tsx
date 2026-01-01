
import React, { useState, useMemo, useEffect } from 'react';
import { Page, Story } from './types';
import Header from './components/Header';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import CustomStoryPage from './pages/CustomStoryPage';
import StoryPage from './pages/StoryPage';

export default function App() {
    const [page, setPage] = useState<Page>({ name: 'home' });
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would come from an authentication service.
        // For now, we generate a simple unique ID and store it.
        let localUserId = localStorage.getItem('ai_story_creator_userId');
        if (!localUserId) {
            localUserId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ai_story_creator_userId', localUserId);
        }
        setUserId(localUserId);
        setIsLoading(false);
    }, []);

    const renderPage = useMemo(() => {
        if (isLoading || !userId) {
            return (
                <div className="flex justify-center items-center h-screen bg-white">
                    <div className="text-center">
                        <Loader />
                        <p className="mt-4 text-gray-600">Initializing...</p>
                    </div>
                </div>
            );
        }

        switch (page.name) {
            case 'custom':
                return <CustomStoryPage setPage={setPage} userId={userId} />;
            case 'story':
                return <StoryPage setPage={setPage} storyData={page.data as Story} userId={userId}/>;
            case 'home':
            default:
                return <HomePage setPage={setPage} userId={userId} />;
        }
    }, [isLoading, page, userId]);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <main>
                {renderPage}
            </main>
        </div>
    );
}
