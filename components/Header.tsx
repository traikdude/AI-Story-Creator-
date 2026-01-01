
import React from 'react';
import { SparkleIcon } from './icons';

const Header = () => (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <span className="text-xl font-semibold text-gray-900">AI Story Creator</span>
                </div>
                <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <SparkleIcon />
                    <span>AI Powered</span>
                </div>
            </div>
        </div>
    </header>
);

export default Header;
