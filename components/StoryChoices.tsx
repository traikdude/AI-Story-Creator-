
import React from 'react';
import { Choice } from '../types';
import Loader from './Loader';

interface StoryChoicesProps {
    choices: Choice[];
    onChoose: (choiceIndex: number) => void;
    isLoading: boolean;
}

const StoryChoices: React.FC<StoryChoicesProps> = ({ choices, onChoose, isLoading }) => (
    <div className="mt-8 p-6 bg-gray-50 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader small />
            </div>
        ) : (
            <div className="space-y-3">
                {choices.map((choice, i) => (
                    <button
                        key={i}
                        onClick={() => onChoose(i)}
                        className="w-full bg-white border border-gray-200 p-4 rounded-lg text-left hover:bg-gray-100 hover:border-blue-400 transition-all duration-200 flex justify-between items-center group"
                    >
                        <span className="text-gray-700">{choice.text}</span>
                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors duration-200 transform group-hover:translate-x-1">→</span>
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default StoryChoices;
