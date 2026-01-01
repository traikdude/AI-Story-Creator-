
import React from 'react';
import { Story } from '../types';

interface ContinueAdventureCardProps extends Story {
    onClick: () => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
};

const ContinueAdventureCard: React.FC<ContinueAdventureCardProps> = React.memo(({ title, description, createdAt, history, onClick }) => {
    const imageUrl = history[history.length - 1]?.imageUrl || 'https://picsum.photos/seed/continue/400/200';

    return (
        <div className="continue-card bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border">
            <div className="w-full h-40 bg-gray-200">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start">
                     <h4 className="font-bold text-gray-800 text-base mb-2 flex-1 pr-2 line-clamp-1">{title}</h4>
                     <span className="flex-shrink-0 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">Comic Book</span>
                </div>
                <p className="text-sm text-gray-600 my-4 h-10 line-clamp-2">
                    {description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Scene {history.length || 1}</span>
                    <span>{formatDate(createdAt)}</span>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
                <button
                    onClick={onClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                >
                    Continue Story
                </button>
            </div>
        </div>
    );
});

export default ContinueAdventureCard;
