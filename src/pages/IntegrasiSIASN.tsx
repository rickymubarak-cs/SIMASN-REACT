import React, { useState, useEffect } from 'react';
import {
    Search, RefreshCcw, Database, Link2, Users, Building, User,
    Key, Shield, CheckCircle, XCircle, AlertCircle, Clock,
    GitMerge, Zap, Globe, ShieldCheck, Lock, Eye, Download,
    FileText, Calendar, ChevronRight, ChevronDown, ChevronUp,
    Briefcase, FileCheck, Wallet, TrendingUp, Loader2, X,
    ChevronLeft, ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { bknApiService } from '../service/bknApiService';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { StatusBadge } from '../components/common/StatusBadge';
import { PegawaiInfo } from '../components/pegawai/PegawaiInfo';

// ============================================
// TYPE DEFINITIONS
// ============================================
interface DataASN {
    id?: string;
    nip: string;
    nipBaru?: string;
    nipLama: string;
    nama: string;
    gelarDepan: string;
    gelarBelakang: string;
    tempatLahir: string;
    tglLahir: string;
    jenisKelamin: string;
    agama: string;
    statusPerkawinan: string;
    email: string;
    emailGov?: string;
    alamat: string;
    statusPegawai: string;
    jenisPegawai: string;
    golRuangAkhir: string;
    pangkatAkhir: string;
    eselon: string;
    tmtJabatan: string;
    tmtGolAkhir: string;
    noSeriKarpeg?: string;
    noTaspen?: string;
    noNpwp?: string;
    bpjs?: string;
    nomorSkCpns?: string;
    tglSkCpns?: string;
    tmtCpns?: string;
    nomorSkPns?: string;
    tglSkPns?: string;
    tmtPns?: string;
    instansiKerjaNama?: string;
    satuanKerjaKerjaNama?: string;
    jabatanNama?: string;
    unorNama?: string;
    kartuAsn?: string;
    noHp?: string;
    [key: string]: any;
}

interface TokenStatus {
    oauth: { active: boolean; expires: string | null };
    sso: { active: boolean };
}

interface SearchResult {
    id: string;
    nip: string;
    nip_lama: string;
    nama: string;
    nama_lengkap: string;
    gelar_depan: string;
    gelar_belakang: string;
}

interface IntegrasiSIASNProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function IntegrasiSIASN({ activeTab, onTabChange }: IntegrasiSIASNProps) {
    // ========== STATE ==========
    const [nip, setNip] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<DataASN | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
    const [currentTab, setCurrentTab] = useState('profile');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchPage] = useState(1);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dokumenList, setDokumenList] = useState<any[]>([]);
    const [dokumenLoading, setDokumenLoading] = useState(false);

    // State untuk accordion preview dokumen
    const [expandedDocId, setExpandedDocId] = useState<string | null>(null);
    const [docPreviewUrls, setDocPreviewUrls] = useState<Record<string, string>>({});
    const [docPreviewLoading, setDocPreviewLoading] = useState<Record<string, boolean>>({});
    const [docPreviewError, setDocPreviewError] = useState<Record<string, boolean>>({});

    // ========== EFFECTS ==========
    useEffect(() => {
        fetchTokenStatus();
    }, []);

    // ========== FUNGSI API ==========
    const fetchTokenStatus = async () => {
        try {
            const result = await bknApiService.checkTokenStatus();
            if (result.success && result.data) {
                setTokenStatus(result.data);
            }
        } catch (error) {
            console.error('Error fetching token status:', error);
        }
    };

    const handleSearchPegawai = async () => {
        if (!searchTerm || searchTerm.length < 2) {
            alert('Masukkan minimal 2 karakter untuk pencarian');
            return;
        }

        setSearchLoading(true);
        try {
            const result = await bknApiService.searchPegawai(searchTerm, searchPage, 10);

            if (result.success) {
                let dataArray: SearchResult[] = [];
                if (Array.isArray(result.data)) {
                    dataArray = result.data;
                }
                setSearchResults(dataArray);
                setSearchTotal(result.pagination?.total || dataArray.length);
                setShowSearchResults(true);
            } else {
                console.warn('Search failed:', result.message);
                setSearchResults([]);
                setSearchTotal(0);
                setShowSearchResults(true);
            }
        } catch (error) {
            console.error('Error searching pegawai:', error);
            setSearchResults([]);
            alert('Gagal mencari pegawai');
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSelectPegawai = (selectedNip: string) => {
        let cleanNip = String(selectedNip || '').trim();

        if (!cleanNip) {
            console.error('❌ NIP is empty');
            alert('NIP tidak ditemukan');
            return;
        }

        const nipRegex = /^\d{18}$/;
        if (!nipRegex.test(cleanNip)) {
            console.error('❌ Invalid NIP format:', cleanNip);
            alert(`NIP tidak valid (harus 18 digit angka). Diterima: ${cleanNip}`);
            return;
        }

        setNip(cleanNip);
        setShowSearchResults(false);
        fetchDataFromBKN(cleanNip);
    };

    const fetchDataFromBKN = async (selectedNip: string) => {
        if (!selectedNip || selectedNip.length !== 18) {
            alert('NIP harus 18 digit');
            return;
        }

        setLoading(true);
        try {
            const result = await bknApiService.getDataASN(selectedNip);

            if (result.success && result.data) {
                setData(result.data);
                await loadDokumen(selectedNip);
            } else {
                alert(result.message || 'Data tidak ditemukan');
                setData(null);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal mengambil data dari BKN');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncWithSIASN = async () => {
        if (!data) {
            alert('Tidak ada data untuk disinkronkan');
            return;
        }

        setSyncing(true);
        try {
            const result = await bknApiService.getSavedData(nip);
            if (result.success) {
                alert('Sinkronisasi berhasil! Data telah disimpan ke database lokal.');
            } else {
                alert('Gagal menyimpan data: ' + result.message);
            }
        } catch (error) {
            console.error('Error syncing data:', error);
            alert('Gagal sinkronisasi data');
        } finally {
            setSyncing(false);
        }
    };

    const loadDokumen = async (selectedNip: string) => {
        if (!selectedNip) return;

        setDokumenLoading(true);
        try {
            const result = await bknApiService.getDokumenList(selectedNip);
            if (result.success && result.data) {
                setDokumenList(result.data);
            } else {
                setDokumenList([]);
            }
        } catch (error) {
            console.error('Error loading dokumen:', error);
            setDokumenList([]);
        } finally {
            setDokumenLoading(false);
        }
    };

    // ========== FUNGSI ACCORDION PREVIEW ==========
    const toggleDocPreview = async (doc: any) => {
        const docId = doc.id || doc.object;

        if (expandedDocId === docId) {
            // Tutup preview
            setExpandedDocId(null);
        } else {
            // Buka preview untuk dokumen ini
            setExpandedDocId(docId);

            // Jika belum ada URL preview, buat dan muat
            if (!docPreviewUrls[docId]) {
                setDocPreviewLoading(prev => ({ ...prev, [docId]: true }));
                setDocPreviewError(prev => ({ ...prev, [docId]: false }));

                try {
                    const url = bknApiService.previewDokumen(doc.object);
                    setDocPreviewUrls(prev => ({ ...prev, [docId]: url }));

                    // Test if URL is accessible
                    const response = await fetch(url, { method: 'HEAD' });
                    if (!response.ok) {
                        setDocPreviewError(prev => ({ ...prev, [docId]: true }));
                    }
                } catch (error) {
                    console.error('Preview error:', error);
                    setDocPreviewError(prev => ({ ...prev, [docId]: true }));
                } finally {
                    setDocPreviewLoading(prev => ({ ...prev, [docId]: false }));
                }
            }
        }
    };

    // ========== UTILITY FUNCTIONS ==========
    const getTokenBadge = () => {
        const oauthActive = tokenStatus?.oauth?.active;
        const ssoActive = tokenStatus?.sso?.active;

        if (oauthActive && ssoActive) {
            return { status: 'success' as const, text: 'Terhubung' };
        } else if (oauthActive || ssoActive) {
            return { status: 'warning' as const, text: 'Sebagian Terhubung' };
        }
        return { status: 'danger' as const, text: 'Tidak Terhubung' };
    };

    const tokenBadge = getTokenBadge();
    const TokenIcon = tokenBadge.status === 'success' ? CheckCircle : tokenBadge.status === 'warning' ? AlertCircle : XCircle;

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    const formatGender = (gender: string) => {
        if (!gender) return '-';
        const g = gender.toUpperCase();
        if (g === 'L' || g === 'LAKI-LAKI' || g === 'M') return 'Laki-laki';
        if (g === 'P' || g === 'PEREMPUAN' || g === 'F') return 'Perempuan';
        return gender;
    };

    // ========== RENDER ==========
    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            <Navbar
                activeTab={activeTab}
                onTabChange={onTabChange}
                userName="Administrator"
                userRole="BKPSDM Kota Pontianak"
                onLogout={handleLogout}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <GitMerge size={32} />
                        <h1 className="text-2xl font-black">Integrasi SIASN</h1>
                    </div>
                    <p className="text-indigo-100">
                        Sinkronisasi dan integrasi data ASN dengan Sistem Informasi ASN (SIASN) dan BKN
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Users size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Data ASN</p>
                                <p className="text-2xl font-bold text-slate-800">{data ? '1' : '0'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Link2 size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Status Integrasi</p>
                                <div className="flex items-center gap-1">
                                    <TokenIcon size={16} className={`text-${tokenBadge.status}-500`} />
                                    <p className="text-sm font-semibold text-slate-800">{tokenBadge.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Key size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Token Status</p>
                                <p className="text-sm font-mono text-slate-800">
                                    {tokenStatus?.oauth?.expires
                                        ? `Exp: ${new Date(tokenStatus.oauth.expires).toLocaleDateString()}`
                                        : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <RefreshCcw size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Last Sync</p>
                                <p className="text-sm font-medium text-slate-800">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={handleSearchPegawai}
                    loading={searchLoading}
                    results={searchResults}
                    showResults={showSearchResults}
                    totalResults={searchTotal}
                    onSelectResult={handleSelectPegawai}
                    onClearResults={() => {
                        setSearchResults([]);
                        setShowSearchResults(false);
                    }}
                    placeholder="Cari berdasarkan NIP atau Nama Pegawai..."
                    buttonText="Cari Pegawai"
                    variant="integration"
                />

                {/* Data Display */}
                {loading ? (
                    <LoadingSpinner text="Memuat data dari BKN..." />
                ) : data ? (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Pegawai Info Header */}
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">
                                        {data.gelarDepan ? data.gelarDepan + ' ' : ''}
                                        {data.nama}
                                        {data.gelarBelakang ? ', ' + data.gelarBelakang : ''}
                                    </h2>
                                    <p className="text-sm text-slate-500 font-mono mt-1">
                                        NIP. {data.nip} {data.nipLama && `(NIP Lama: ${data.nipLama})`}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                            {data.golRuangAkhir || '-'} - {data.pangkatAkhir || '-'}
                                        </span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {data.jenisPegawai || '-'}
                                        </span>
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                            {data.statusPegawai || '-'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSyncWithSIASN}
                                    disabled={syncing}
                                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {syncing ? <RefreshCcw size={16} className="animate-spin" /> : <GitMerge size={16} />}
                                    Sinkronisasi SIASN
                                </button>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-b border-slate-200 px-6">
                            <div className="flex gap-6 overflow-x-auto">
                                {[
                                    { id: 'profile', label: 'Data Pribadi', icon: User },
                                    { id: 'dokumen', label: 'Dokumen Digital', icon: FileText },
                                    { id: 'jabatan', label: 'Riwayat Jabatan', icon: Briefcase },
                                    { id: 'golongan', label: 'Riwayat Golongan', icon: TrendingUp },
                                    { id: 'kgb', label: 'Gaji Berkala', icon: Wallet }
                                ].map(tab => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setCurrentTab(tab.id)}
                                            className={`flex items-center gap-2 px-3 py-3 border-b-2 transition-all ${currentTab === tab.id
                                                ? 'border-indigo-600 text-indigo-600 font-medium'
                                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <Icon size={16} />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {currentTab === 'profile' && <PegawaiInfo data={data} />}

                            {currentTab === 'dokumen' && (
                                <div className="space-y-6">
                                    {/* Header dengan tombol refresh */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                            <FileText size={20} className="text-indigo-600" />
                                            Dokumen Digital
                                        </h3>
                                        <button
                                            onClick={() => loadDokumen(nip)}
                                            disabled={dokumenLoading}
                                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <RefreshCcw size={14} className={dokumenLoading ? 'animate-spin' : ''} />
                                            {dokumenLoading ? 'Memuat...' : 'Muat Dokumen'}
                                        </button>
                                    </div>

                                    {/* Dokumen List dengan Accordion */}
                                    {dokumenLoading ? (
                                        <div className="text-center py-12">
                                            <Loader2 size={40} className="animate-spin mx-auto text-indigo-500 mb-3" />
                                            <p className="text-slate-500">Memuat dokumen...</p>
                                        </div>
                                    ) : dokumenList.length === 0 ? (
                                        <div className="text-center py-12 bg-slate-50 rounded-xl">
                                            <FileText size={48} className="mx-auto text-slate-300 mb-3" />
                                            <p className="text-slate-500">Tidak ada dokumen tersedia</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {dokumenList.map((doc, idx) => {
                                                const docId = doc.id || doc.object;
                                                const isExpanded = expandedDocId === docId;
                                                const isLoading = docPreviewLoading[docId] || false;
                                                const hasError = docPreviewError[docId] || false;
                                                const previewUrl = docPreviewUrls[docId];

                                                return (
                                                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                                                        {/* Header Card */}
                                                        <div
                                                            className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                                            onClick={() => toggleDocPreview(doc)}
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <div className="p-2 bg-indigo-50 rounded-lg">
                                                                    <FileText size={20} className="text-indigo-600" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-slate-800">{doc.nama}</p>
                                                                    <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                                                                        {doc.object?.split('/').pop()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <a
                                                                    href={bknApiService.downloadDokumen(doc.object, doc.nama)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                    title="Download"
                                                                >
                                                                    <Download size={18} />
                                                                </a>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleDocPreview(doc);
                                                                    }}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title={isExpanded ? "Tutup" : "Preview"}
                                                                >
                                                                    {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Preview Panel (Accordion) */}
                                                        {isExpanded && (
                                                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                                                                {isLoading ? (
                                                                    <div className="flex flex-col items-center justify-center py-12">
                                                                        <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                                                                        <p className="text-sm text-slate-500">Memuat preview...</p>
                                                                    </div>
                                                                ) : hasError ? (
                                                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                                                        <AlertCircle size={48} className="text-red-500 mb-3" />
                                                                        <p className="text-slate-600 mb-4">Gagal memuat preview dokumen</p>
                                                                        <div className="flex gap-3">
                                                                            <a
                                                                                href={bknApiService.downloadDokumen(doc.object, doc.nama)}
                                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                                                            >
                                                                                <Download size={14} className="inline mr-1" />
                                                                                Download
                                                                            </a>
                                                                            <a
                                                                                href={bknApiService.previewDokumen(doc.object)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                                                            >
                                                                                <ExternalLink size={14} className="inline mr-1" />
                                                                                Buka Tab Baru
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <iframe
                                                                            src={previewUrl}
                                                                            className="w-full h-[400px] rounded-lg border-0 bg-white shadow-sm"
                                                                            title={doc.nama}
                                                                            onLoad={() => {
                                                                                setDocPreviewLoading(prev => ({ ...prev, [docId]: false }));
                                                                            }}
                                                                            onError={() => {
                                                                                setDocPreviewLoading(prev => ({ ...prev, [docId]: false }));
                                                                                setDocPreviewError(prev => ({ ...prev, [docId]: true }));
                                                                            }}
                                                                        />
                                                                        <div className="mt-3 flex justify-end gap-2">
                                                                            <a
                                                                                href={bknApiService.downloadDokumen(doc.object, doc.nama)}
                                                                                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200"
                                                                            >
                                                                                <Download size={12} className="inline mr-1" />
                                                                                Download
                                                                            </a>
                                                                            <a
                                                                                href={bknApiService.previewDokumen(doc.object)}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50"
                                                                            >
                                                                                <ExternalLink size={12} className="inline mr-1" />
                                                                                Buka Tab Baru
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(currentTab === 'jabatan' || currentTab === 'golongan' || currentTab === 'kgb') && (
                                <EmptyState
                                    icon={Database}
                                    title="Fitur dalam Pengembangan"
                                    description="Fitur ini akan segera tersedia"
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={Database}
                        title="Belum Ada Data"
                        description="Cari pegawai berdasarkan NIP atau nama untuk melihat data integrasi"
                    />
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease forwards;
                }
            `}</style>
        </div>
    );
}