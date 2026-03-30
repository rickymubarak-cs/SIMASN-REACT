import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white h-96 rounded-[3rem] border border-slate-50 animate-pulse shadow-sm" />
            ))}
        </div>
    );
};