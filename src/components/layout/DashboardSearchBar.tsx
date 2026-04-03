import React from 'react';
import {
    Database, MapPin, RefreshCcw, Clock, FileText, Users,
    CheckCircle, AlertCircle, Search, X, LayoutGrid,
    Grid3X3, LayoutList, Table, ChevronRight
} from 'lucide-react';
import { SearchResult } from '../../types';

type ViewMode = 'standard' | 'compact' | 'detailed' | 'table';

interface DashboardCardItem {
    label: string;
    value: string | number;
    icon: string;
    color: string;
}

interface DashboardSearchBarProps {
    cards?: DashboardCardItem[];
    searchTerm: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    loading: boolean;
    perangkatDaerah?: string;
    onPerangkatDaerahChange?: (value: string) => void;
    showUnitFilter?: boolean;
    onFilter?: () => void;
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    itemCount?: number;
    results?: SearchResult[];
    showResults?: boolean;
    totalResults?: number;
    onSelectResult?: (nip: string) => void;
    onClearResults?: () => void;
    placeholder?: string;
    buttonText?: string;
    variant?: 'default' | 'integration' | 'light';
}

const iconMap: Record<string, any> = {
    Database, MapPin, RefreshCcw, Clock, FileText, Users, CheckCircle, AlertCircle
};

const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    sky: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600'
};

const viewModes = [
    { id: 'standard' as const, label: 'Standard', icon: LayoutGrid, title: 'Modern Card View' },
    { id: 'compact' as const, label: 'Compact', icon: Grid3X3, title: 'High Density View' },
    { id: 'detailed' as const, label: 'Detailed', icon: LayoutList, title: 'Informative List View' },
    { id: 'table' as const, label: 'Table', icon: Table, title: 'Administrative Table View' }
];

const DashboardCardItem: React.FC<DashboardCardItem> = ({ label, value, icon, color }) => {
    const IconComponent = iconMap[icon] || Database;
    const colorClass = colorMap[color] || colorMap.blue;
    const formattedValue = typeof value === 'number' && value > 999
        ? value.toLocaleString('id-ID')
        : value;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-lg transition-all hover:-translate-y-1">
            <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent size={24} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-slate-800 truncate" title={String(formattedValue)}>
                    {formattedValue}
                </p>
            </div>
        </div>
    );
};

export const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
    cards = [],
    searchTerm,
    onSearchChange,
    onSearch,
    loading,
    perangkatDaerah = '',
    onPerangkatDaerahChange,
    showUnitFilter = false,
    onFilter,
    viewMode = 'standard',
    onViewModeChange,
    itemCount = 0,
    results = [],
    showResults = false,
    totalResults = 0,
    onSelectResult,
    onClearResults,
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

    const variantClasses = {
        default: {
            button: 'bg-slate-900 hover:bg-blue-600 text-white',
            inputBorder: 'focus:ring-blue-500/5',
            resultHover: 'hover:bg-slate-50',
            viewModeActive: 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-200',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        integration: {
            button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            inputBorder: 'focus:ring-indigo-500/5',
            resultHover: 'hover:bg-indigo-50',
            viewModeActive: 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-200',
            viewModeInactive: 'text-slate-500 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        light: {
            button: 'bg-white text-amber-700 hover:bg-amber-50',
            inputBorder: 'focus:ring-white/50',
            resultHover: 'hover:bg-amber-50',
            viewModeActive: 'bg-amber-500 text-white shadow-sm',
            viewModeInactive: 'text-white/80 hover:text-white hover:bg-white/20',
            inputBg: 'bg-white',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        tubel: {
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            inputBorder: 'focus:ring-blue-500/5',
            resultHover: 'hover:bg-blue-50',
            viewModeActive: 'bg-blue-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        pltplh: {
            button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
            inputBorder: 'focus:ring-emerald-500/5',
            resultHover: 'hover:bg-emerald-50',
            viewModeActive: 'bg-emerald-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        pangkat: {
            button: 'bg-purple-600 hover:bg-purple-700 text-white',
            inputBorder: 'focus:ring-purple-500/5',
            resultHover: 'hover:bg-purple-50',
            viewModeActive: 'bg-purple-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        cuti: {
            button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
            inputBorder: 'focus:ring-cyan-500/5',
            resultHover: 'hover:bg-cyan-50',
            viewModeActive: 'bg-cyan-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        gaji: {
            button: 'bg-teal-600 hover:bg-teal-700 text-white',
            inputBorder: 'focus:ring-teal-500/5',
            resultHover: 'hover:bg-teal-50',
            viewModeActive: 'bg-teal-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        jf: {
            button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
            inputBorder: 'focus:ring-indigo-500/5',
            resultHover: 'hover:bg-indigo-50',
            viewModeActive: 'bg-indigo-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
        pemberhentian : {
            button: 'bg-rose-600 hover:bg-rose-700 text-white',
            inputBorder: 'focus:ring-rose-500/5',
            resultHover: 'hover:bg-rose-50',
            viewModeActive: 'bg-rose-600 text-white shadow-sm',
            viewModeInactive: 'text-slate-400 hover:text-slate-700 hover:bg-white/50',
            inputBg: 'bg-slate-50',
            inputText: 'text-slate-900',
            inputPlaceholder: 'placeholder:text-slate-400',
            inputBorderColor: 'border-slate-200'
        },
    };

    const currentVariant = variantClasses[variant] || variantClasses.default;

    return (
        <div className="space-y-6">
            {/* Dashboard Cards Grid */}
            {cards && cards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, idx) => (
                        <DashboardCardItem key={idx} {...card} />
                    ))}
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
                {/* Search and Filter Row - Gabungan */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search Input Gabungan - Mencari NIP, Nama, dan Unit Kerja */}
                    <div className="flex-1 relative group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${variant === 'light' ? 'text-amber-400' : 'text-slate-400 group-focus-within:text-indigo-500'
                            }`} size={18} />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan NIP, Nama Pegawai, atau Unit Kerja..."
                            className={`w-full pl-11 pr-10 py-3 ${currentVariant.inputBg} ${currentVariant.inputText} ${currentVariant.inputPlaceholder} ${currentVariant.inputBorderColor} border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all`}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{ color: '#1e293b' }}
                        />
                        {searchTerm && (
                            <button
                                onClick={handleClear}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${variant === 'light' ? 'text-amber-400 hover:text-amber-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
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
                                            className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${isActive ? currentVariant.viewModeActive : 'text-slate-400 hover:text-slate-700 hover:bg-white/50'
                                                }`}
                                            title={mode.title}
                                        >
                                            <Icon size={14} />
                                            <span className="hidden md:inline">{mode.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

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
                            <p className="text-sm text-slate-600">Ditemukan {totalResults} pegawai</p>
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
                                            className={`w-full flex items-center justify-between px-4 py-3 transition-colors border-b border-slate-100 last:border-0 text-left ${isValidNip ? `cursor-pointer ${currentVariant.resultHover}` : 'opacity-50 cursor-not-allowed'
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
            </div>

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

export default DashboardSearchBar;