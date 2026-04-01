import React from 'react';

interface SkeletonLoadingProps {
    count?: number;
    className?: string;
    gridCols?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
}

export const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
    count = 8,
    className = "bg-white h-96 rounded-[3rem] border border-slate-50 animate-pulse shadow-sm",
    gridCols = { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}) => {
    // Build grid classes dynamically
    const gridClasses = `
        grid 
        grid-cols-${gridCols.xs || 1}
        sm:grid-cols-${gridCols.sm || 2}
        md:grid-cols-${gridCols.md || 2}
        lg:grid-cols-${gridCols.lg || 3}
        xl:grid-cols-${gridCols.xl || 4}
        gap-8
    `;

    return (
        <div className={gridClasses}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className={className}>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                            <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="h-8 bg-slate-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoading;