// components/common/SearchBar.tsx
import React from 'react';
import { Search, MapPin, RefreshCcw, ChevronRight, X, LayoutGrid, Grid3X3, LayoutList, Table } from 'lucide-react';
import { SearchResult } from '../../types';

type ViewMode = 'standard' | 'compact' | 'detailed' | 'table';

interface SearchBarProps {
    // Props untuk pencarian
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    loading: boolean;

    // Props untuk filter unit (opsional)
    perangkatDaerah?: string;
    onPerangkatDaerahChange?: (value: string) => void;
    showUnitFilter?: boolean;
    onFilter?: () => void;

    // Props untuk hasil pencarian (dropdown)
    results?: SearchResult[];
    showResults?: boolean;
    totalResults?: number;
    onSelectResult?: (nip: string) => void;
    onClearResults?: () => void;

    // Props untuk view mode
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    itemCount?: number;

    // Props untuk styling
    placeholder?: string;
    buttonText?: string;
    variant?: 'default' | 'integration';
}

const viewModes = [
    { id: 'standard' as const, label: 'Standard', icon: LayoutGrid, title: 'Modern Card View' },
    { id: 'compact' as const, label: 'Compact', icon: Grid3X3, title: 'High Density View' },
    { id: 'detailed' as const, label: 'Detailed', icon: LayoutList, title: 'Informative List View' },
    { id: 'table' as const, label: 'Table', icon: Table, title: 'Administrative Table View' }
];

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    onSearch,
    loading,
    perangkatDaerah = '',
    onPerangkatDaerahChange,
    showUnitFilter = false,
    onFilter,
    results = [],
    showResults = false,
    totalResults = 0,
    onSelectResult,
    onClearResults,
    viewMode = 'standard',
    onViewModeChange,
    itemCount = 0,
    placeholder = "Cari berdasarkan NIP atau Nama Pegawai...",
    buttonText = "Cari",
    variant = 'default'
}) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const handleClear = () => {
        onSearchChange('');
        if (onClearResults) {
            onClearResults();
        }
    };

    // Variant styling
    const variantClasses = {
        default: {
            button: 'bg-slate-900 hover:bg-blue-600',
            inputBorder: 'focus:ring-blue-500/5',
            resultHover: 'hover:bg-slate-50',
            viewModeActive: 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-200',
            viewModeInactive: 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
        },
        integration: {
            button: 'bg-indigo-600 hover:bg-indigo-700',
            inputBorder: 'focus:ring-indigo-500/5',
            resultHover: 'hover:bg-indigo-50',
            viewModeActive: 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200',
            viewModeInactive: 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
        }
    };

    const currentVariant = variantClasses[variant];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
            {/* Search and Filter Row */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={placeholder}
                        className={`w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:bg-white transition-all ${currentVariant.inputBorder}`}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Unit Filter (Opsional) */}
                {showUnitFilter && onPerangkatDaerahChange && (
                    <div className="relative md:w-36">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="ID Unit"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            value={perangkatDaerah}
                            onChange={(e) => onPerangkatDaerahChange(e.target.value)}
                        />
                    </div>
                )}

                {/* Search Button */}
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className={`px-6 py-3 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${currentVariant.button}`}
                >
                    {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Search size={18} />}
                    {buttonText}
                </button>

                {/* Filter Button (Optional) */}
                {onFilter && (
                    <button
                        onClick={onFilter}
                        disabled={loading}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium transition-all hover:bg-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                        Filter
                    </button>
                )}
            </div>

            {/* View Mode & Info Row */}
            {onViewModeChange && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* View Mode Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">
                            Tampilan:
                        </span>
                        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl">
                            {viewModes.map((mode) => {
                                const Icon = mode.icon;
                                const isActive = viewMode === mode.id;

                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => onViewModeChange(mode.id)}
                                        className={`
                                            relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                                            ${isActive
                                                ? currentVariant.viewModeActive
                                                : currentVariant.viewModeInactive
                                            }
                                        `}
                                        title={mode.title}
                                    >
                                        <Icon size={14} />
                                        <span className="hidden md:inline">{mode.label}</span>

                                        {/* Tooltip untuk mobile */}
                                        <span className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            {mode.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info & Keyboard Shortcut */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
                        {itemCount > 0 && (
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                <span className="font-bold text-slate-600">{itemCount}</span>
                                <span>Usulan Pelayanan</span>
                            </div>
                        )}

                        <div className="hidden lg:flex items-center gap-1 text-[10px]">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono">Ctrl</span>
                            <span>+</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono">1-4</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Results Dropdown */}
            {showResults && (
                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden animate-fadeIn">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                        <p className="text-sm text-slate-600">
                            Ditemukan {totalResults} pegawai
                        </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {results.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">
                                {loading ? 'Mencari...' : 'Tidak ada data ditemukan'}
                            </div>
                        ) : (
                            results.map((pegawai, idx) => {
                                const isValidNip = /^\d{18}$/.test(pegawai.nip);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => isValidNip && onSelectResult?.(pegawai.nip)}
                                        disabled={!isValidNip}
                                        className={`w-full flex items-center justify-between px-4 py-3 transition-colors border-b border-slate-100 last:border-0 text-left ${isValidNip
                                            ? `cursor-pointer ${currentVariant.resultHover}`
                                            : 'opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div>
                                            <p className="font-medium text-slate-800">{pegawai.nama}</p>
                                            <p className="text-xs text-slate-400 font-mono">
                                                {pegawai.nip}
                                                {!isValidNip && <span className="ml-2 text-red-500">(NIP tidak valid)</span>}
                                            </p>
                                        </div>
                                        {isValidNip && <ChevronRight size={16} className="text-slate-400" />}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease forwards;
                }
            `}</style>
        </div>
    );
};

export default SearchBar;