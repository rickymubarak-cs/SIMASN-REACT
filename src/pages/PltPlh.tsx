import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
    FileText,
    User,
    Calendar,
    ExternalLink,
    Search,
    RefreshCcw,
    AlertCircle,
    Database,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Users,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    BarChart3,
    Clock,
    ShieldCheck,
    Briefcase,
    TrendingUp,
    Coffee,
    Wallet,
    UserMinus,
    ClipboardList,
    MapPin
} from "lucide-react";

/**
 * Konfigurasi API Dasar
 * Menghubungkan ke endpoint SIMASN Kota Pontianak
 */
const API = axios.create({
    baseURL: "https://simasn.pontianak.go.id/api/",
    timeout: 15000,
});

const BASE_URL_BERKAS = "https://simasn.pontianak.go.id/assets/berkas/Layanan/";

// Pemetaan Endpoint & Path Berkas berdasarkan Tab sesuai Controller CI
const configMap = {
    pltplh: {
        endpoint: "EndPointAPI/getpltplh",
        filePath: "PltPlh/",
        files: ["file_usulan", "file_sk_pltplh", "file_skpengganti", "file_pengantar"]
    },
    lpp: {
        endpoint: "EndPointAPI/getlpp",
        filePath: "KarisKarsu/",
        files: ["file_layLpp_pak", "file_layLpp_cpns"]
    },
    pangkat: {
        endpoint: "EndPointAPI/getpangkat",
        filePath: "KenaikanPangkat/",
        files: ["file_skp", "file_pangkat"]
    },
    cuti: {
        endpoint: "EndPointAPI/getcuti",
        filePath: "Cuti/",
        files: ["file_pengantar", "file_a"]
    },
    gaji: {
        endpoint: "EndPointAPI/getgaji",
        filePath: "Berkala/",
        files: ["file_pengantar", "file_skp"]
    },
    jf: {
        endpoint: "EndPointAPI/getjf",
        filePath: "JF/",
        files: ["file_pengantar", "file_a"]
    },
    pemberhentian: {
        endpoint: "EndPointAPI/getpemberhentian",
        filePath: "Pemberhentian/",
        files: ["file_pengantar", "file_form_permintaan"]
    },
    rekap_cuti: {
        endpoint: "EndPointAPI/getrekapcuti",
        filePath: "Rekap/Cuti/",
        files: ["file_rekapCuti_pengantar"]
    },
};

/**
 * Komponen Kecil: Tautan Berkas
 */
const FileLink = React.memo(({ label, href }) => {
    const hasFile = useMemo(() => {
        return href &&
            !href.endsWith('undefined') &&
            !href.endsWith('/') &&
            !href.includes('null') &&
            href !== "";
    }, [href]);

    if (!hasFile) return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] bg-slate-50 text-slate-400 border border-slate-100 italic opacity-60">
            <FileText size={12} className="shrink-0 opacity-40" />
            <span className="truncate flex-1 font-medium">{label} (Tidak Ada)</span>
        </div>
    );

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-95 group/link"
        >
            <div className="flex items-center gap-3 truncate">
                <FileText size={14} className="text-blue-500 shrink-0 group-hover/link:scale-110 transition-transform" />
                <span className="truncate">{label}</span>
            </div>
            <ExternalLink size={12} className="text-slate-300 group-hover/link:text-blue-400" />
        </a>
    );
});

export default function App() {
    // State UI & Navigasi
    const [activeTab, setActiveTab] = useState("pltplh");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State Data
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [perangkatDaerahParam, setPerangkatDaerahParam] = useState("");

    // State Paginasi
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fungsi Pengambilan Data Dinamis
    const fetchData = useCallback(async (pd = "") => {
        setLoading(true);
        setError(null);
        try {
            const config = configMap[activeTab];
            const res = await API.get(`${config.endpoint}/${pd}`);

            if (res.data?.status && res.data?.data) {
                const dataKey = Object.keys(res.data.data).find(key => key !== 'kunci');
                const rawData = res.data.data[dataKey] || [];

                setData(Array.isArray(rawData) ? rawData : []);
                setCurrentPage(1);
            } else {
                setData([]);
                setError("Data tidak ditemukan atau format API salah.");
            }
        } catch (err) {
            setError("Gagal terhubung ke server SIMASN. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData(perangkatDaerahParam);
    }, [activeTab, fetchData]);

    // Filter Data
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowSearch = searchTerm.toLowerCase();
        return data.filter((item) =>
            (item.peg_nama && item.peg_nama.toLowerCase().includes(lowSearch)) ||
            (item.peg_nip && item.peg_nip.includes(searchTerm)) ||
            (item.nama && item.nama.toLowerCase().includes(lowSearch)) ||
            (item.nama_pd && item.nama_pd.toLowerCase().includes(lowSearch)) ||
            (item.perangkat_daerah && item.perangkat_daerah.toLowerCase().includes(lowSearch))
        );
    }, [data, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const navItems = [
        { id: "pltplh", label: "PLT / PLH", icon: Database },
        { id: "lpp", label: "Layanan LPP", icon: Briefcase },
        { id: "pangkat", label: "Kenaikan Pangkat", icon: TrendingUp },
        { id: "cuti", label: "Layanan Cuti", icon: Coffee },
        { id: "gaji", label: "KGB (Gaji)", icon: Wallet },
        { id: "jf", label: "Jabatan Fungsional", icon: User },
        { id: "pemberhentian", label: "Pemberhentian", icon: UserMinus },
        { id: "rekap_cuti", label: "Rekap Cuti", icon: ClipboardList },
    ];

    // Helper untuk merapikan nama label file dari snake_case
    const formatFileLabel = (fileName) => {
        return fileName.replace('file_', '').replace(/_/g, ' ').toUpperCase();
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50`}>
                <div className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-transparent flex items-center justify-center shrink-0">
                        <img 
                            src="https://www.pontianak.go.id/frontend_asset/image/logo/pemkot-pontianak.webp" 
                            alt="Logo Pemkot Pontianak"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    {isSidebarOpen && <span className="font-black text-xl tracking-tight text-slate-800">SIMASN</span>}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2 ${!isSidebarOpen && 'hidden'}`}>Layanan ASN</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSearchTerm("");
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${activeTab === item.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                }`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? "text-white" : "group-hover:scale-110 transition-transform"} />
                            {isSidebarOpen && <span className="font-bold text-xs truncate">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-50 rounded-2xl font-bold text-xs transition-all">
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Keluar</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                                {navItems.find(n => n.id === activeTab)?.label}
                            </h2>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portal Integrasi Layanan</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase">Sistem Online</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Search & Filter */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder="ID PD..."
                                    className="bg-transparent px-4 py-2 w-full text-xs font-bold focus:outline-none"
                                    value={perangkatDaerahParam}
                                    onChange={(e) => setPerangkatDaerahParam(e.target.value)}
                                />
                                <button onClick={() => fetchData(perangkatDaerahParam)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 transition-all">
                                    LOAD
                                </button>
                            </div>

                            <div className="relative flex-1">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Cari nama/nip di tab ${activeTab}...`}
                                    className="w-full pl-14 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 font-bold transition-all"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <button onClick={() => fetchData(perangkatDaerahParam)} disabled={loading} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
                                <RefreshCcw size={20} className={`${loading ? "animate-spin text-blue-500" : "text-slate-400"}`} />
                            </button>
                        </div>

                        {/* Grid Data */}
                        {error ? (
                            <div className="p-20 text-center bg-red-50 rounded-[3rem] border border-red-100">
                                <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                                <h4 className="text-xl font-black text-red-800 uppercase">Terjadi Kesalahan</h4>
                                <p className="text-red-600 text-xs font-bold">{error}</p>
                            </div>
                        ) : loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="bg-white h-[300px] rounded-[2.5rem] border border-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : paginatedData.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {paginatedData.map((item, idx) => (
                                        <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 p-2 shadow-sm hover:shadow-xl transition-all group">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {activeTab === 'rekap_cuti' ? <MapPin size={20} /> : <User size={20} />}
                                                    </div>
                                                    <span className="text-[8px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-full uppercase">
                                                        {activeTab}
                                                    </span>
                                                </div>

                                                <h3 className="font-black text-slate-800 text-xs leading-tight line-clamp-2 min-h-[2rem] mb-1 uppercase">
                                                    {activeTab === 'rekap_cuti'
                                                        ? (item.nama_pd || item.unit_org_induk_nm || "PD Tidak Diketahui")
                                                        : (item.peg_nama || item.nama || "Tanpa Nama")
                                                    }
                                                </h3>

                                                {activeTab !== 'rekap_cuti' && (
                                                    <p className="text-[10px] font-black text-blue-500 mb-4">NIP: {item.peg_nip || item.nip || "-"}</p>
                                                )}

                                                <div className="space-y-1.5 border-t border-slate-50 pt-3">
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase">
                                                        <Calendar size={12} />
                                                        <span>{item.timestamp || item.tgl_usul || "Data Terkini"}</span>
                                                    </div>
                                                    {activeTab === 'rekap_cuti' && item.perangkat_daerah_id && (
                                                        <div className="text-[9px] font-bold text-blue-400 uppercase">
                                                            ID PD: {item.perangkat_daerah_id}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Berkas Dinamis Berdasarkan Config dan Controller */}
                                            <div className="bg-slate-50 rounded-[2rem] p-3 m-1 space-y-1.5 border border-slate-100">
                                                {configMap[activeTab].files.map((fileKey) => {
                                                    const fileValue = item[fileKey] || (item.files && item.files[fileKey]);
                                                    const fileUrl = fileValue ? `${BASE_URL_BERKAS}${configMap[activeTab].filePath}${fileValue}` : null;

                                                    return (
                                                        <FileLink
                                                            key={fileKey}
                                                            label={formatFileLabel(fileKey)}
                                                            href={fileUrl}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center py-8">
                                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-20"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <span className="text-xs font-black text-slate-600 px-4">
                                            {currentPage} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-20"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-200">
                                <Search size={48} className="mx-auto text-slate-100 mb-4" />
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Data Tidak Ditemukan</h3>
                                <p className="text-slate-400 text-xs font-bold">Coba ubah kata kunci atau ID Perangkat Daerah.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Tambahkan gaya CSS kustom untuk scrollbar
const styleTag = document.createElement("style");
styleTag.innerHTML = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
`;
document.head.appendChild(styleTag);