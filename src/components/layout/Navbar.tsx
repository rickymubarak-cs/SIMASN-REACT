import React, { useState } from 'react';
import {
    Database, Briefcase, TrendingUp, Coffee, Wallet, User, UserMinus, ClipboardList,
    LogOut, Menu, X, ChevronDown, Settings, Bell, Clock, Gavel, BookOpen, Users,
    FileCheck, Award, Building, AlertTriangle, GraduationCap, LayoutDashboard,
    BarChart3, Settings2, Server, Link2, BookOpen as BookOpenIcon, RefreshCcw, Shield, Cloud, GitMerge, Zap, Globe, ShieldCheck, Key, Lock
} from 'lucide-react';
import logoPontianak from '../../assets/Pontianak.png';

// ============================================
// KONFIGURASI MENU UTAMA
// ============================================

interface SubMenuItem {
    id: string;
    label: string;
    icon: any;
    path?: string;
    badge?: number;
}

interface MenuGroup {
    id: string;
    label: string;
    icon: any;
    items: SubMenuItem[];
}

const dataMasterMenus: (SubMenuItem | { id: string; label: string; icon: any; items: SubMenuItem[] })[] = [
    { id: "data_asn", label: "Data ASN", icon: Users, path: "/data-asn" },
    { id: "integrasi_siasn", label: "Integrasi SIASN", icon: GitMerge, path: "/integrasi-siasn" }
];

const bidangDisiplinMenus: SubMenuItem[] = [
    { id: "hukdis", label: "Hukuman Disiplin", icon: AlertTriangle, path: "/hukdis" },
    { id: "slks", label: "Satya Lencana Karya Satya", icon: Award, path: "/slks" }
];

const bidangPsdaMenus: SubMenuItem[] = [
    { id: "tubel", label: "Tugas Belajar", icon: GraduationCap, path: "/tubel" },
    { id: "diklat", label: "Diklat", icon: BookOpenIcon, path: "/diklat" },
    { id: "data", label: "Data Riwayat", icon: Database, path: "/data" },
    { id: "kompetensi", label: "Pengembangan Kompetensi", icon: TrendingUp, path: "/kompetensi" }
];

const bidangMutasiMenus: SubMenuItem[] = [
    { id: "pltplh", label: "PLT / PLH", icon: Database, path: "/pltplh" },
    { id: "lpp", label: "Layanan LPP", icon: Briefcase, path: "/lpp" },
    { id: "pangkat", label: "Kenaikan Pangkat", icon: TrendingUp, path: "/pangkat" },
    { id: "cuti", label: "Cuti Pegawai", icon: Coffee, path: "/cuti" },
    { id: "gaji", label: "KGB (Gaji Berkala)", icon: Wallet, path: "/gaji" },
    { id: "jf", label: "Jabatan Fungsional", icon: User, path: "/jf" },
    { id: "pemberhentian", label: "Pemberhentian ASN", icon: UserMinus, path: "/pemberhentian" }
];

const lainnyaMenus: SubMenuItem[] = [
    { id: "waktu", label: "Setting Waktu Pelayanan", icon: Clock, path: "/waktu" }
];

const menuGroups: MenuGroup[] = [
    {
        id: "data_master",
        label: "Data Master",
        icon: Server,
        items: dataMasterMenus
    },
    {
        id: "pelayanan",
        label: "Pelayanan",
        icon: LayoutDashboard,
        items: [
            { id: "bidang_disiplin", label: "Bidang Disiplin", icon: Gavel, items: bidangDisiplinMenus } as any,
            { id: "bidang_psda", label: "Bidang PSDA", icon: Building, items: bidangPsdaMenus } as any,
            { id: "bidang_mutasi", label: "Bidang Mutasi", icon: Users, items: bidangMutasiMenus } as any,
            ...lainnyaMenus.map(item => ({ ...item, items: [] }))
        ]
    }
];

interface NavbarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    userName?: string;
    userRole?: string;
    userAvatar?: string;
    onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    activeTab,
    onTabChange,
    userName = "Administrator",
    userRole = "BKPSDM Kota Pontianak",
    userAvatar,
    onLogout
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const [openSubDropdowns, setOpenSubDropdowns] = useState<Record<string, boolean>>({});

    const toggleDropdown = (groupId: string) => {
        setOpenDropdowns(prev => ({ ...prev, [groupId]: !prev[groupId] }));
        setOpenSubDropdowns({});
    };

    const handleMouseEnterSub = (itemId: string) => {
        setOpenSubDropdowns({ [itemId]: true });
    };

    const handleMenuClick = (itemId: string) => {
        onTabChange(itemId);
        setIsMobileMenuOpen(false);
        setOpenDropdowns({});
        setOpenSubDropdowns({});
    };

    const isItemActive = (itemId: string) => activeTab === itemId;

    const isGroupHasActiveItem = (group: MenuGroup) => {
        const checkItems = (items: any[]): boolean => {
            for (const item of items) {
                if (item.items && item.items.length > 0) {
                    if (checkItems(item.items)) return true;
                }
                if (item.id === activeTab) return true;
            }
            return false;
        };
        return checkItems(group.items);
    };

    return (
        <>
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo Section - Menggunakan placeholder SVG jika file lokal tidak ditemukan */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <img src={logoPontianak} alt="SIMASN Logo" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                </div>
                                <div className="ml-2 flex flex-col">
                                    <span className="font-bold text-base tracking-tighter text-slate-800 leading-tight">SIMASN</span>
                                    <span className="text-[9px] font-medium text-slate-500 tracking-wide uppercase leading-none">Kota Pontianak</span>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-1">
                            {menuGroups.map((group) => (
                                <div key={group.id} className="relative group/main">
                                    <button
                                        onClick={() => toggleDropdown(group.id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${isGroupHasActiveItem(group) || openDropdowns[group.id]
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                                            }`}
                                    >
                                        <group.icon size={16} />
                                        <span>{group.label}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdowns[group.id] ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openDropdowns[group.id] && (
                                        <div
                                            className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[60] animate-fadeIn"
                                            onMouseLeave={() => {
                                                setOpenDropdowns({});
                                                setOpenSubDropdowns({});
                                            }}
                                        >
                                            {group.items.map((item: any) => {
                                                const hasSubmenu = item.items && item.items.length > 0;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="relative"
                                                        onMouseEnter={() => hasSubmenu && handleMouseEnterSub(item.id)}
                                                    >
                                                        <button
                                                            onClick={() => !hasSubmenu && handleMenuClick(item.id)}
                                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${isItemActive(item.id) || openSubDropdowns[item.id]
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <item.icon size={16} className={isItemActive(item.id) ? 'text-blue-600' : 'text-slate-400'} />
                                                                <span className="font-medium">{item.label}</span>
                                                            </div>
                                                            {hasSubmenu && <ChevronDown size={14} className="-rotate-90 text-slate-400" />}
                                                        </button>

                                                        {/* Sub-menu level 2 (Flyout) dengan Bridge Logic */}
                                                        {hasSubmenu && openSubDropdowns[item.id] && (
                                                            <div
                                                                className="absolute left-full top-0 -ml-1 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[70] animate-fadeIn"
                                                                style={{ paddingLeft: '4px' }}
                                                            >
                                                                <div className="bg-white rounded-xl py-2 border border-slate-50 shadow-sm">
                                                                    {item.items.map((subItem: SubMenuItem) => (
                                                                        <button
                                                                            key={subItem.id}
                                                                            onClick={() => handleMenuClick(subItem.id)}
                                                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${isItemActive(subItem.id)
                                                                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                                                                : 'text-slate-600 hover:bg-slate-50'
                                                                                }`}
                                                                        >
                                                                            <subItem.icon size={16} className={isItemActive(subItem.id) ? 'text-blue-600' : 'text-slate-400'} />
                                                                            <span className="flex-1 text-left font-medium">{subItem.label}</span>
                                                                            {subItem.badge && (
                                                                                <span className="bg-red-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">
                                                                                    {subItem.badge}
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all relative">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('profile')}
                                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
                                        <User size={16} className="text-white" />
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-xs font-bold text-slate-800 leading-none mb-0.5">{userName}</p>
                                        <p className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">{userRole}</p>
                                    </div>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                {openDropdowns.profile && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-[60] animate-fadeIn" onMouseLeave={() => setOpenDropdowns({})}>
                                        <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                            <p className="text-xs font-bold text-slate-800">{userName}</p>
                                            <p className="text-[9px] text-slate-500">{userRole}</p>
                                        </div>
                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-medium text-left">
                                            <User size={14} /> Profil Saya
                                        </button>
                                        <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 font-medium text-left">
                                            <Settings size={14} /> Pengaturan
                                        </button>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-bold text-left">
                                            <LogOut size={14} /> Keluar Akun
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
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
                                <div key={group.id} className="border-b border-slate-50 last:border-0 pb-1">
                                    <button
                                        onClick={() => toggleDropdown(group.id)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-bold ${isGroupHasActiveItem(group) ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <group.icon size={18} />
                                            <span>{group.label}</span>
                                        </div>
                                        <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdowns[group.id] ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openDropdowns[group.id] && (
                                        <div className="ml-6 space-y-1 pb-2 border-l-2 border-slate-100 mt-1 pl-2">
                                            {group.items.map((item: any) => {
                                                const hasSub = item.items && item.items.length > 0;
                                                return (
                                                    <div key={item.id}>
                                                        <button
                                                            onClick={() => hasSub ? setOpenSubDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] })) : handleMenuClick(item.id)}
                                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${isItemActive(item.id) ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <item.icon size={16} />
                                                                <span>{item.label}</span>
                                                            </div>
                                                            {hasSub && <ChevronDown size={14} className={`transition-transform ${openSubDropdowns[item.id] ? 'rotate-180' : ''}`} />}
                                                        </button>
                                                        {hasSub && openSubDropdowns[item.id] && (
                                                            <div className="ml-6 space-y-1 mt-1 bg-slate-50 rounded-lg p-1">
                                                                {item.items.map((subItem: SubMenuItem) => (
                                                                    <button
                                                                        key={subItem.id}
                                                                        onClick={() => handleMenuClick(subItem.id)}
                                                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold ${isItemActive(subItem.id) ? 'bg-blue-100 text-blue-700' : 'text-slate-500'}`}
                                                                    >
                                                                        <subItem.icon size={14} />
                                                                        <span>{subItem.label}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
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
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.1s ease-out forwards; }
            `}</style>
        </>
    );
};

export default Navbar;