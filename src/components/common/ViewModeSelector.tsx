// src/components/common/ViewModeSelector.tsx
import React from 'react';
import { LayoutGrid, Square, List, Table } from 'lucide-react';

export type ViewMode = 'standard' | 'compact' | 'list' | 'table';

interface ViewModeSelectorProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    className?: string;
}

interface ModeOption {
    id: ViewMode;
    label: string;
    icon: React.ElementType;
    description: string;
}

const modes: ModeOption[] = [
    {
        id: 'standard',
        label: 'Standard',
        icon: LayoutGrid,
        description: 'Card view dengan informasi lengkap'
    },
    {
        id: 'compact',
        label: 'Compact',
        icon: Square,
        description: 'Card compact, lebih banyak data per layar'
    },
    {
        id: 'list',
        label: 'List',
        icon: List,
        description: 'List view dengan detail lengkap'
    },
    {
        id: 'table',
        label: 'Table',
        icon: Table,
        description: 'Tabel dengan sorting & filter'
    }
];

export const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
    currentMode,
    onModeChange,
    className = ''
}) => {
    return (
        <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-1 inline-flex ${className}`}>
            {modes.map((mode) => {
                const Icon = mode.icon;
                const isActive = currentMode === mode.id;

                return (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        className={`
                            group relative px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5
                            ${isActive
                                ? 'bg-white text-rose-600 shadow-md'
                                : 'text-white/80 hover:bg-white/20 hover:text-white'
                            }
                        `}
                        title={mode.description}
                    >
                        <Icon size={14} />
                        <span className="text-xs font-medium hidden sm:inline">{mode.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ViewModeSelector;