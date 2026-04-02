import React from 'react';
import { LayoutGrid, Grid3X3, LayoutList, Table, Eye } from 'lucide-react';

type ViewMode = 'standard' | 'compact' | 'detailed' | 'table';

interface ViewModeSelectorProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    itemCount?: number;
}

const viewModes = [
    { id: 'standard' as const, label: 'Standard', icon: LayoutGrid, description: 'Modern Card View' },
    { id: 'compact' as const, label: 'Compact', icon: Grid3X3, description: 'High Density' },
    { id: 'detailed' as const, label: 'Detailed', icon: LayoutList, description: 'Informative List' },
    { id: 'table' as const, label: 'Table', icon: Table, description: 'Administrative' }
];

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
    currentMode,
    onModeChange,
    itemCount
}) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Eye size={18} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Tampilan Data
                    </span>
                    {itemCount !== undefined && (
                        <span className="text-xs text-slate-500 ml-2">
                            {itemCount} item
                        </span>
                    )}
                </div>

                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                    {viewModes.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = currentMode === mode.id;

                        return (
                            <button
                                key={mode.id}
                                onClick={() => onModeChange(mode.id)}
                                className={`
                                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                    ${isActive
                                        ? 'bg-white text-amber-600 shadow-sm ring-1 ring-amber-200'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                    }
                                `}
                                title={mode.description}
                            >
                                <Icon size={16} />
                                <span className="hidden sm:inline">{mode.label}</span>

                                {/* Tooltip untuk mobile */}
                                <span className="sm:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {mode.description}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Keyboard shortcut hint */}
                <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">Ctrl</span>
                    <span>+</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded">1-4</span>
                    <span>ganti tampilan</span>
                </div>
            </div>

            {/* Active mode description */}
            <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                    {viewModes.find(m => m.id === currentMode)?.description}
                </p>
            </div>
        </div>
    );
};