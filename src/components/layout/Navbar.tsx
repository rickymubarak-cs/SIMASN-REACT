import React, { useState } from 'react';
import {
    Database, Briefcase, TrendingUp, Coffee, Wallet, User, UserMinus, ClipboardList,
    LogOut, Menu, X, ChevronDown, Settings, Bell, Clock, Gavel, BookOpen, Users,
    FileCheck, Award, Building, AlertTriangle, GraduationCap
} from 'lucide-react';

// Konfigurasi menu
const menuGroups = [
    {
        id: "waktu",
        label: "Setting Waktu Pelayanan",
        icon: Clock,
        items: []
    },
    {
        id: "disiplin",
        label: "Bidang Disiplin",
        icon: Gavel,
        items: [
            { id: "hukdis", label: "Hukuman Disiplin", icon: AlertTriangle },
            { id: "slks", label: "Usul SLKS", icon: FileCheck }
        ]
    },
    {
        id: "bpsda",
        label: "Bidang BPSDA",
        icon: Building,
        items: [
            { id: "kompetensi", label: "Pengembangan Kompetensi", icon: BookOpen },
            { id: "tubel", label: "Tugas Belajar", icon: GraduationCap },
            { id: "diklat", label: "Diklat", icon: Award },
            { id: "data", label: "Data", icon: Database }
        ]
    },
    {
        id: "mutasi",
        label: "Bidang Mutasi",
        icon: Users,
        items: [
            { id: "pltplh", label: "PLT / PLH", icon: Database },
            { id: "lpp", label: "LPP", icon: Briefcase },
            { id: "pangkat", label: "Pangkat", icon: TrendingUp },
            { id: "cuti", label: "Cuti Pegawai", icon: Coffee },
            { id: "gaji", label: "Gaji Berkala", icon: Wallet },
            { id: "jf", label: "Jabatan Fungsional", icon: User },
            { id: "pemberhentian", label: "Pemberhentian ASN", icon: UserMinus }
        ]
    }
];

interface NavbarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    userName?: string;
    userRole?: string;
    onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    activeTab,
    onTabChange,
    userName = "Administrator",
    userRole = "BKPSDM Kota Pontianak",
    onLogout
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const handleMenuClick = (itemId: string) => {

        // Panggil onTabChange dari props
        if (onTabChange) {
            onTabChange(itemId);
        } else {
            console.error('Navbar - onTabChange is undefined!');
        }

        setIsMobileMenuOpen(false);
        setOpenDropdowns({});
    };

    const toggleDropdown = (groupId: string) => {
        setOpenDropdowns(prev => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    const isGroupActive = (group: typeof menuGroups[0]) => {
        return group.items.some(item => item.id === activeTab);
    };

    return (
        <>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    src="https://simasn.pontianak.go.id/assets/foto/Pontianak.png"
                                    alt="SIMASN Logo"
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                                <div className="ml-2 flex flex-col">
                                    <span className="font-bold text-base tracking-tighter text-slate-800 leading-tight">
                                        SIMASN
                                    </span>
                                    <span className="text-[9px] font-medium text-slate-500 tracking-wide">
                                        Kota Pontianak
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {menuGroups.map((group) => (
                                <div key={group.id} className="relative group">
                                    <button
                                        onClick={() => toggleDropdown(group.id)}
                                        className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                      ${isGroupActive(group) || openDropdowns[group.id]
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                                            }
                    `}
                                    >
                                        <group.icon size={16} />
                                        <span>{group.label}</span>
                                        {group.items.length > 0 && (
                                            <ChevronDown size={14} className={`transition-transform ${openDropdowns[group.id] ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {group.items.length > 0 && openDropdowns[group.id] && (
                                        <div
                                            className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn"
                                            onMouseLeave={() => setOpenDropdowns({})}
                                        >
                                            {group.items.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleMenuClick(item.id)}
                                                    className={`
                            w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors
                            ${activeTab === item.id
                                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                                            : 'text-slate-600 hover:bg-slate-50'
                                                        }
                          `}
                                                >
                                                    <item.icon size={16} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
                                                    <span className="flex-1 text-left">{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-xs font-semibold text-slate-800">{userName}</p>
                                        <p className="text-[8px] font-medium text-slate-400 uppercase tracking-wider">{userRole}</p>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                                </button>
                            </div>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden ml-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 bg-white py-2 animate-fadeIn max-h-[calc(100vh-64px)] overflow-y-auto">
                        <div className="px-3 space-y-1">
                            {menuGroups.map((group) => (
                                <div key={group.id} className="border-b border-slate-50 last:border-0">
                                    <button
                                        onClick={() => toggleDropdown(group.id)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all ${isGroupActive(group) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <group.icon size={18} />
                                            <span>{group.label}</span>
                                        </div>
                                        {group.items.length > 0 && (
                                            <ChevronDown size={16} className={`transition-transform ${openDropdowns[group.id] ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>
                                    {group.items.length > 0 && openDropdowns[group.id] && (
                                        <div className="ml-6 space-y-1 pb-2">
                                            {group.items.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleMenuClick(item.id)}
                                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <item.icon size={14} />
                                                    <span>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease forwards; }
      `}</style>
        </>
    );
};

export default Navbar;