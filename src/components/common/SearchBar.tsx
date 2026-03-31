import React from 'react';
import { Search, MapPin, RefreshCcw, ChevronRight, X } from 'lucide-react';
import { SearchResult } from '../../types';

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

    // Props untuk hasil pencarian (dropdown)
    results?: SearchResult[];
    showResults?: boolean;
    totalResults?: number;
    onSelectResult?: (nip: string) => void;
    onClearResults?: () => void;

    // Props untuk styling
    placeholder?: string;
    buttonText?: string;
    variant?: 'default' | 'integration';
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    onSearch,
    loading,
    perangkatDaerah = '',
    onPerangkatDaerahChange,
    showUnitFilter = false,
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

    // Variant styling
    const variantClasses = {
        default: {
            button: 'bg-slate-900 hover:bg-blue-600',
            inputBorder: 'focus:ring-blue-500/5',
            resultHover: 'hover:bg-slate-50'
        },
        integration: {
            button: 'bg-indigo-600 hover:bg-indigo-700',
            inputBorder: 'focus:ring-indigo-500/5',
            resultHover: 'hover:bg-indigo-50'
        }
    };

    const currentVariant = variantClasses[variant];

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/60">
            <div className="flex flex-col md:flex-row gap-4">
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
            </div>

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