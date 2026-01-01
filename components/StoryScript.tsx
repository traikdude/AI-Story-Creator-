
import React from 'react';
import { Scene } from '../types';

interface StoryScriptProps {
    script: Scene;
}

const StoryScript: React.FC<StoryScriptProps> = ({ script }) => (
    <div className="p-6 space-y-4 text-gray-700">
        <h2 className="text-blue-600 font-bold uppercase tracking-wider text-sm">{script.scene}</h2>
        <p>{script.description}</p>
        <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">{script.character}</button>
            <p className="text-gray-500 italic">({script.mutter})</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">{script.dialogue}</div>
        <p className="text-blue-500 font-mono text-sm">[ {script.action} ]</p>
    </div>
);

export default StoryScript;
