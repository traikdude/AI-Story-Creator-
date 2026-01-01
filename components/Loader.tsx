
import React from 'react';

interface LoaderProps {
    small?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ small = false }) => (
    <div className={`animate-spin rounded-full border-b-2 ${small ? 'h-5 w-5 border-blue-500' : 'h-8 w-8 border-white'}`}></div>
);

export default Loader;
