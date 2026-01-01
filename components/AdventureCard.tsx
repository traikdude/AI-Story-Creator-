
import React from 'react';
import { AdventureTheme } from '../types';
import { ArrowRightIcon } from './icons';

interface AdventureCardProps extends Omit<AdventureTheme, 'id' | 'description'> {
    onClick: () => void;
}

const AdventureCard: React.FC<AdventureCardProps> = React.memo(({ title, keywords, icon, onClick, imageUrl }) => (
    <div onClick={onClick} className="adventure-card relative rounded-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl aspect-w-1 aspect-h-1">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
                <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-md p-2">
                    {icon}
                </div>
                <span className="bg-white/90 text-gray-800 text-xs font-bold px-2 py-1 rounded">
                    Comic Style
                </span>
            </div>
            <div>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className="text-xs text-gray-200 mt-1">{keywords}</p>
            </div>
        </div>
         <div className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
            <ArrowRightIcon />
        </div>
    </div>
));

export default AdventureCard;
