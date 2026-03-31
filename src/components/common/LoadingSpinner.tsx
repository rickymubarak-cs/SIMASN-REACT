import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'Memuat data...',
    fullScreen = false
}) => {
    const content = (
        <div className="flex flex-col items-center justify-center">
            <RefreshCcw size={32} className={`animate-spin text-indigo-500 ${sizeClasses[size]}`} />
            <p className="text-slate-500 mt-3">{text}</p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return <div className="text-center py-12">{content}</div>;
};

export default LoadingSpinner;