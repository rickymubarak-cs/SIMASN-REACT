import React from 'react';

interface SkeletonLoadingProps {
    count?: number;
    className?: string;
    gridCols?: {
        sm?: number;
        md?: number;
        lg?: number;
    };
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
    count = 8,
    className = "bg-white h-96 rounded-[3rem] border border-slate-50 animate-pulse shadow-sm",
    gridCols = { sm: 1, md: 2, lg: 4 }
}) => {
    const gridClasses = `
        grid 
        grid-cols-${gridCols.sm || 1} 
        sm:grid-cols-${gridCols.md || 2} 
        lg:grid-cols-${gridCols.lg || 4} 
        gap-8
    `;

    return (
        <div className={gridClasses}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className={className} />
            ))}
        </div>
    );
};