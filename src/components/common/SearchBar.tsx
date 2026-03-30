import React from 'react';
import { Search, MapPin, RefreshCcw } from 'lucide-react';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    perangkatDaerah: string;
    onPerangkatDaerahChange: (value: string) => void;
    onFilter: () => void;
    loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
    perangkatDaerah,
    onPerangkatDaerahChange,
    onFilter,
    loading
}) => {
    return (
        <section className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4 max-w-7xl mx-auto w-full">
            <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Cari berdasarkan Nama atau NIP Pegawai..."
                    className="w-full pl-16 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex gap-3">
                <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="ID Unit"
                        className="w-28 md:w-36 pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-xs font-bold focus:outline-none focus:bg-white transition-all"
                        value={perangkatDaerah}
                        onChange={(e) => onPerangkatDaerahChange(e.target.value)}
                    />
                </div>
                <button
                    onClick={onFilter}
                    disabled={loading}
                    className="px-10 py-4 bg-slate-900 text-white font-black text-[10px] rounded-[1.5rem] hover:bg-blue-600 transition-all flex items-center gap-3 shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                    {loading ? <RefreshCcw size={16} className="animate-spin" /> : "Filter"}
                </button>
            </div>
        </section>
    );
};