import React from 'react';
import { Menu, X, User } from 'lucide-react';

interface HeaderProps {
    title: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, isSidebarOpen, onToggleSidebar }) => {
    return (
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
            <div className="flex items-center gap-6">
                <button
                    onClick={onToggleSidebar}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-colors"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dashboard Layanan Kepegawaian</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black text-slate-800 uppercase">Administrator</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">BKPSDM Kota Pontianak</span>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center">
                    <User size={20} className="text-slate-400" />
                </div>
            </div>
        </header>
    );
};