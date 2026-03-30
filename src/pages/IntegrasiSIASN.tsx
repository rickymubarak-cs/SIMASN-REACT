import React, { useState, useEffect } from 'react';
import {
    Search, RefreshCcw, Database, Link2, Users, Building, User,
    Key, Shield, CheckCircle, XCircle, AlertCircle, Clock,
    GitMerge, Zap, Globe, ShieldCheck, Lock, Eye, Download,
    FileText, Calendar, ChevronRight, ChevronDown, ChevronUp,
    Briefcase, FileCheck, Wallet, TrendingUp
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { bknApiService } from '../service/bknApiService';

interface DataASN {
    nip: string;
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
    [key: string]: any;
}

interface TokenStatus {
    oauth: { active: boolean; expires: string | null };
    sso: { active: boolean };
}

interface IntegrasiSIASNProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function IntegrasiSIASN({ activeTab, onTabChange }: IntegrasiSIASNProps) {
    const [nip, setNip] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<DataASN | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
    const [currentTab, setCurrentTab] = useState('profile');
    const [expandedSections, setExpandedSections] = useState({
        profile: true,
        dokumen: false,
        sk: false,
        pendidikan: false,
        instansi: false,
        keuangan: false
    });
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchPage, setSearchPage] = useState(1);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dokumenList, setDokumenList] = useState<any[]>([]);
    const [dokumenLoading, setDokumenLoading] = useState(false);

    // Fetch token status on mount
    useEffect(() => {
        fetchTokenStatus();
    }, []);

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

            // Perbaiki: pastikan result.data adalah array
            if (result.success) {
                // Handle berbagai kemungkinan struktur response
                let dataArray = [];
                if (Array.isArray(result.data)) {
                    dataArray = result.data;
                } else if (result.data?.data && Array.isArray(result.data.data)) {
                    dataArray = result.data.data;
                } else if (result.data?.pegawai && Array.isArray(result.data.pegawai)) {
                    dataArray = result.data.pegawai;
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
        console.log('🖱️ [handleSelectPegawai] Raw selected NIP:', selectedNip);
        console.log('🖱️ [handleSelectPegawai] Type:', typeof selectedNip);
        console.log('🖱️ [handleSelectPegawai] Length:', selectedNip?.length);

        // Bersihkan NIP dari karakter yang tidak perlu
        let cleanNip = String(selectedNip || '').trim();

        // Jika NIP masih kosong, coba ambil dari state lain
        if (!cleanNip && searchResults.length > 0) {
            console.warn('⚠️ NIP kosong, mencoba ambil dari hasil pencarian pertama');
            cleanNip = searchResults[0]?.nip || searchResults[0]?.peg_nip || '';
        }

        console.log('🖱️ [handleSelectPegawai] Cleaned NIP:', cleanNip);

        // Validasi NIP
        if (!cleanNip) {
            console.error('❌ NIP is empty');
            alert('NIP tidak ditemukan');
            return;
        }

        // Pastikan NIP adalah 18 digit angka
        const nipRegex = /^\d{18}$/;
        if (!nipRegex.test(cleanNip)) {
            console.error('❌ Invalid NIP format:', cleanNip);
            console.log('📝 NIP characters:', cleanNip.split('').map(c => ({ char: c, code: c.charCodeAt(0) })));
            alert(`NIP tidak valid (harus 18 digit angka). Diterima: ${cleanNip}`);
            return;
        }

        setNip(cleanNip);
        setShowSearchResults(false);
        fetchDataFromBKN(cleanNip);
    };

    const fetchDataFromBKN = async (selectedNip: string) => {
        console.log('🚀 [fetchDataFromBKN] Starting fetch for NIP:', selectedNip);
        console.log('🚀 [fetchDataFromBKN] NIP type:', typeof selectedNip);
        console.log('🚀 [fetchDataFromBKN] NIP length:', selectedNip?.length);

        // Validasi NIP
        if (!selectedNip || selectedNip.length !== 18) {
            console.error('❌ [fetchDataFromBKN] Invalid NIP format:', selectedNip);
            alert('NIP harus 18 digit');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const result = await bknApiService.getDataASN(selectedNip);
            console.log('📦 [fetchDataFromBKN] BKN API Response:', result);

            if (result.success && result.data) {
                console.log('✅ [fetchDataFromBKN] Data received:', {
                    nip: result.data.nip,
                    nama: result.data.nama,
                    hasData: !!result.data
                });
                setData(result.data);

                // Load dokumen setelah data ASN didapat
                await loadDokumen(selectedNip);

                // Fetch additional data
                Promise.all([
                    bknApiService.getRiwayatJabatan(selectedNip),
                    bknApiService.getRiwayatGolongan(selectedNip),
                    bknApiService.getRiwayatKGB(selectedNip)
                ]).catch(err => console.error('Error fetching additional data:', err));

            } else {
                console.warn('⚠️ [fetchDataFromBKN] No data from BKN API:', result.message);
                alert(result.message || 'Data tidak ditemukan');
                setData(null);
            }
        } catch (error) {
            console.error('❌ [fetchDataFromBKN] Error:', error);
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
            // Simpan data ke database lokal
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

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const formatGender = (gender: string) => {
        if (!gender) return '-';
        const g = gender.toUpperCase();
        if (g === 'L' || g === 'LAKI-LAKI' || g === 'M') return 'Laki-laki';
        if (g === 'P' || g === 'PEREMPUAN' || g === 'F') return 'Perempuan';
        return gender;
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

    const getTokenStatusBadge = () => {
        const oauthActive = tokenStatus?.oauth?.active;
        const ssoActive = tokenStatus?.sso?.active;

        if (oauthActive && ssoActive) {
            return { status: 'success', text: 'Terhubung', icon: CheckCircle };
        } else if (oauthActive || ssoActive) {
            return { status: 'warning', text: 'Sebagian Terhubung', icon: AlertCircle };
        }
        return { status: 'danger', text: 'Tidak Terhubung', icon: XCircle };
    };

    // Tambahkan fungsi untuk memuat dokumen
    const loadDokumen = async (nip: string) => {
        if (!nip) return;

        setDokumenLoading(true);
        try {
            const result = await bknApiService.getDokumenList(nip);
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



    const tokenBadge = getTokenStatusBadge();
    const TokenIcon = tokenBadge.icon;

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            {/* Navbar */}
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
                                <p className="text-2xl font-bold text-slate-800">
                                    {data ? '1' : '0'}
                                </p>
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
                                        : '-'
                                    }
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
                                <p className="text-sm font-medium text-slate-800">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan NIP atau Nama Pegawai..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value.length === 0) {
                                        setShowSearchResults(false);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchPegawai();
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSearchPegawai}
                            disabled={searchLoading}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {searchLoading ? <RefreshCcw size={18} className="animate-spin" /> : <Search size={18} />}
                            Cari Pegawai
                        </button>
                        <button
                            onClick={() => fetchTokenStatus()}
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <RefreshCcw size={18} />
                            Cek Status Token
                        </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Ditemukan {searchTotal} pegawai
                                </p>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {!Array.isArray(searchResults) || searchResults.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500">
                                        {searchLoading ? 'Mencari...' : 'Tidak ada data ditemukan'}
                                    </div>
                                ) : (
                                    searchResults.map((pegawai, idx) => {
                                        // Debug: lihat struktur data
                                        console.log(`🔍 [Result ${idx}] Raw data:`, pegawai);

                                        // Ambil NIP dari berbagai kemungkinan field
                                        const nipValue = pegawai.nip || pegawai.peg_nip || pegawai.nipBaru || '';
                                        const namaValue = pegawai.nama || pegawai.peg_nama || '';

                                        console.log(`🔍 [Result ${idx}] Extracted NIP:`, nipValue, 'Length:', nipValue.length);

                                        // Validasi NIP sebelum ditampilkan
                                        const isValidNip = /^\d{18}$/.test(String(nipValue));

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (isValidNip) {
                                                        console.log('🖱️ Clicked NIP:', nipValue);
                                                        handleSelectPegawai(nipValue);
                                                    } else {
                                                        console.error('❌ Cannot select: invalid NIP', nipValue);
                                                        alert(`NIP tidak valid: ${nipValue}`);
                                                    }
                                                }}
                                                disabled={!isValidNip}
                                                className={`w-full flex items-center justify-between px-4 py-3 transition-colors border-b border-slate-100 last:border-0 text-left ${isValidNip
                                                    ? 'hover:bg-slate-50 cursor-pointer'
                                                    : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-800">{namaValue}</p>
                                                    <p className="text-xs text-slate-400 font-mono">
                                                        {nipValue || '-'}
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

                {/* Data Display */}
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <RefreshCcw size={40} className="animate-spin mx-auto text-indigo-500 mb-4" />
                        <p className="text-slate-500">Memuat data dari BKN...</p>
                    </div>
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
                                <div className="flex gap-2">
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
                            {/* Data Pribadi Tab */}
                            {currentTab === 'profile' && data && (
                                <div className="space-y-4">
                                    {/* Identitas Pribadi */}
                                    <div className="border rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('profile')}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700 flex items-center gap-2">
                                                <User size={18} className="text-indigo-600" />
                                                Identitas Pribadi
                                            </span>
                                            {expandedSections.profile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {expandedSections.profile && (
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-400">NIP Baru</label>
                                                    <p className="font-medium font-mono">{data.nipBaru || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Nama Lengkap</label>
                                                    <p className="font-medium">{data.nama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Gelar Belakang</label>
                                                    <p className="font-medium">{data.gelarBelakang || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Tempat, Tanggal Lahir</label>
                                                    <p className="font-medium">{data.tempatLahir || '-'}, {data.tglLahir || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Jenis Kelamin</label>
                                                    <p className="font-medium">{data.jenisKelamin === 'M' ? 'Laki-laki' : 'Perempuan'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Agama</label>
                                                    <p className="font-medium">{data.agama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Email</label>
                                                    <p className="font-medium">{data.email || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Email Pemerintah</label>
                                                    <p className="font-medium">{data.emailGov || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">No. HP</label>
                                                    <p className="font-medium">{data.noHp || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Alamat</label>
                                                    <p className="font-medium">{data.alamat || '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dokumen Kepegawaian */}
                                    <div className="border rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('dokumen')}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700 flex items-center gap-2">
                                                <FileText size={18} className="text-indigo-600" />
                                                Dokumen Kepegawaian
                                            </span>
                                            {expandedSections.dokumen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {expandedSections.dokumen && (
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-400">Nomor Karpeg</label>
                                                    <p className="font-medium">{data.noSeriKarpeg || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Nomor Taspen</label>
                                                    <p className="font-medium">{data.noTaspen || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">NPWP</label>
                                                    <p className="font-medium">{data.noNpwp || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">BPJS</label>
                                                    <p className="font-medium">{data.bpjs || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Kartu ASN</label>
                                                    <p className="font-medium">{data.kartuAsn || '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* SK CPNS & PNS */}
                                    <div className="border rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('sk')}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700 flex items-center gap-2">
                                                <FileCheck size={18} className="text-indigo-600" />
                                                SK CPNS & PNS
                                            </span>
                                            {expandedSections.sk ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {expandedSections.sk && (
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-400">No. SK CPNS</label>
                                                    <p className="font-medium">{data.nomorSkCpns || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Tgl SK CPNS</label>
                                                    <p className="font-medium">{data.tglSkCpns || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">TMT CPNS</label>
                                                    <p className="font-medium">{data.tmtCpns || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">No. SK PNS</label>
                                                    <p className="font-medium">{data.nomorSkPns || '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Instansi & Jabatan */}
                                    <div className="border rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => toggleSection('instansi')}
                                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-700 flex items-center gap-2">
                                                <Building size={18} className="text-indigo-600" />
                                                Instansi & Jabatan
                                            </span>
                                            {expandedSections.instansi ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {expandedSections.instansi && (
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-400">Instansi Kerja</label>
                                                    <p className="font-medium">{data.instansiKerjaNama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Satuan Kerja</label>
                                                    <p className="font-medium">{data.satuanKerjaKerjaNama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Unit Organisasi</label>
                                                    <p className="font-medium">{data.unorNama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Jabatan</label>
                                                    <p className="font-medium">{data.jabatanNama || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Golongan / Pangkat</label>
                                                    <p className="font-medium">{data.golRuangAkhir || '-'} - {data.pangkatAkhir || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Eselon</label>
                                                    <p className="font-medium">{data.eselon || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">TMT Jabatan</label>
                                                    <p className="font-medium">{data.tmtJabatan || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">TMT Golongan</label>
                                                    <p className="font-medium">{data.tmtGolAkhir || '-'}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Dokumen Digital Tab */}
                            {/* Dokumen Digital Tab */}
                            {currentTab === 'dokumen' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-slate-800">Dokumen Digital</h3>
                                        <button
                                            onClick={() => loadDokumen(nip)}
                                            disabled={dokumenLoading}
                                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 disabled:opacity-50"
                                        >
                                            <RefreshCcw size={14} className={`inline mr-1 ${dokumenLoading ? 'animate-spin' : ''}`} />
                                            {dokumenLoading ? 'Memuat...' : 'Muat Dokumen'}
                                        </button>
                                    </div>

                                    {dokumenLoading ? (
                                        <div className="text-center py-8">
                                            <RefreshCcw size={32} className="animate-spin mx-auto text-indigo-500" />
                                            <p className="text-slate-500 mt-2">Memuat dokumen...</p>
                                        </div>
                                    ) : dokumenList.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                                            <p className="text-slate-500">Tidak ada dokumen tersedia</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {dokumenList.map((doc, idx) => (
                                                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                                <FileText size={20} className="text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-slate-800">{doc.nama}</p>
                                                                <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">
                                                                    {doc.object?.slice(0, 50)}...
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <a
                                                                href={bknApiService.previewDokumen(doc.object)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Preview"
                                                            >
                                                                <Eye size={16} />
                                                            </a>
                                                            <a
                                                                href={bknApiService.downloadDokumen(doc.object, doc.nama)}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Download"
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Riwayat Jabatan Tab */}
                            {currentTab === 'jabatan' && (
                                <div className="text-center py-8">
                                    <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-700">Riwayat Jabatan</h3>
                                    <p className="text-slate-400 mt-1">Fitur ini akan menampilkan riwayat jabatan pegawai dari BKN</p>
                                </div>
                            )}

                            {/* Riwayat Golongan Tab */}
                            {currentTab === 'golongan' && (
                                <div className="text-center py-8">
                                    <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-700">Riwayat Golongan</h3>
                                    <p className="text-slate-400 mt-1">Fitur ini akan menampilkan riwayat kenaikan pangkat/golongan</p>
                                </div>
                            )}

                            {/* Gaji Berkala Tab */}
                            {currentTab === 'kgb' && (
                                <div className="text-center py-8">
                                    <Wallet size={48} className="mx-auto text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-700">Kenaikan Gaji Berkala (KGB)</h3>
                                    <p className="text-slate-400 mt-1">Fitur ini akan menampilkan riwayat kenaikan gaji berkala</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <Database size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-700">Belum Ada Data</h3>
                        <p className="text-slate-400 mt-1">
                            Cari pegawai berdasarkan NIP atau nama untuk melihat data integrasi
                        </p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease forwards;
        }
      `}</style>
        </div>
    );
}