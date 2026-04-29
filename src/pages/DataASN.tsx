// src/pages/DataASN.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, RefreshCcw, Database, Users, User,
    Eye, Edit, X, Award, UserCheck,
    Mail, Phone, MapPin, ChevronLeft, ChevronRight,
    Building
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { apiService, PegawaiData, SummaryData, SKPDData, getStatusInfo, getStatusOptionsGrouped } from '../service/api';

interface DataASNProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

interface FilterParams {
    page: number;
    per_page: number;
    nama: string;
    jenis_kelamin: string;
    status_id: string;
    skpd_id: string;
}

export default function DataASN({ activeTab, onTabChange }: DataASNProps) {
    // State untuk data
    const [data, setData] = useState<PegawaiData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [selectedPegawai, setSelectedPegawai] = useState<PegawaiData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

    // State untuk statistik
    const [stats, setStats] = useState<SummaryData>({
        total_pegawai: 0,
        laki_laki: 0,
        perempuan: 0
    });

    // State untuk SKPD
    const [skpdList, setSkpdList] = useState<SKPDData[]>([]);
    const [loadingSkpd, setLoadingSkpd] = useState<boolean>(false);
    const [showSkpdDropdown, setShowSkpdDropdown] = useState<boolean>(false);
    const [skpdSearch, setSkpdSearch] = useState<string>('');

    // State untuk filter
    const [filters, setFilters] = useState<FilterParams>({
        page: 1,
        per_page: 10,
        nama: '',
        jenis_kelamin: '',
        status_id: '',
        skpd_id: ''
    });

    // State untuk pagination
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalData, setTotalData] = useState<number>(0);

    const itemsPerPage = 10;
    const statusOptionsGrouped = getStatusOptionsGrouped();

    // Filtered SKPD list berdasarkan search
    const filteredSkpdList = skpdList.filter(skpd =>
        skpd.unit_org_induk_nm.toLowerCase().includes(skpdSearch.toLowerCase())
    );

    // Fetch SKPD list
    const fetchSKPDList = useCallback(async () => {
        setLoadingSkpd(true);
        try {
            const response = await apiService.getSKPDList();
            if (response.success && response.data) {
                setSkpdList(response.data);
            }
        } catch (error) {
            console.error('Error fetching SKPD list:', error);
        } finally {
            setLoadingSkpd(false);
        }
    }, []);

    // Fetch data dengan filter
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: filters.page,
                per_page: itemsPerPage,
            };

            if (filters.nama) params.nama = filters.nama;
            if (filters.jenis_kelamin) params.jenis_kelamin = filters.jenis_kelamin;
            if (filters.status_id) params.status_id = parseInt(filters.status_id);
            if (filters.skpd_id) params.skpd_id = parseInt(filters.skpd_id);

            const response = await apiService.getPegawaiWithSKPD(params);

            if (response.success && response.data) {
                setData(response.data);
                setTotalPages(response.last_page || 1);
                setTotalData(response.total || 0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Fetch statistik
    const fetchStats = useCallback(async () => {
        try {
            const response = await apiService.getSummary();
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchData();
        fetchStats();
        fetchSKPDList();
    }, []); // Hanya sekali saat mount

    // Effect untuk fetch data saat filter berubah
    useEffect(() => {
        fetchData();
    }, [filters.page, filters.nama, filters.jenis_kelamin, filters.status_id, filters.skpd_id]);

    // Handle search
    const handleSearch = () => {
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setFilters({
            page: 1,
            per_page: 10,
            nama: '',
            jenis_kelamin: '',
            status_id: '',
            skpd_id: ''
        });
        setSkpdSearch('');
    };

    // Handle change filter
    const handleFilterChange = (key: keyof FilterParams, value: string | number) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setFilters(prev => ({ ...prev, page: newPage }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle view detail
    const handleViewDetail = (id: number) => {
        const pegawai = data.find(p => p.peg_id === id);
        if (pegawai) {
            setSelectedPegawai(pegawai);
            setShowDetailModal(true);
        }
    };

    // Get selected SKPD name
    const getSelectedSkpdName = (): string => {
        if (!filters.skpd_id) return 'Semua SKPD';
        const skpd = skpdList.find(s => s.unit_org_induk_id === parseInt(filters.skpd_id));
        return skpd?.unit_org_induk_nm || 'SKPD Terpilih';
    };

    // Format gender
    const formatGender = (gender?: string): string => {
        if (!gender) return '-';
        const g = gender.toLowerCase();
        if (g === 'l') return 'Laki-laki';
        if (g === 'p') return 'Perempuan';
        return gender;
    };

    // Format date
    const formatDate = (dateStr?: string): string => {
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

    // Handle logout
    const handleLogout = () => {
        console.log("Logout clicked");
    };

    // Render pagination
    const renderPagination = () => {
        const maxVisible = 5;
        let startPage = Math.max(1, filters.page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return (
            <div className="flex gap-1">
                <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                    <ChevronLeft size={18} className="mx-auto" />
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="w-10 h-10 flex items-center justify-center">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${filters.page === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="w-10 h-10 flex items-center justify-center">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                >
                    <ChevronRight size={18} className="mx-auto" />
                </button>
            </div>
        );
    };

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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Database size={32} />
                        <h1 className="text-2xl font-black">Data ASN</h1>
                    </div>
                    <p className="text-blue-100">
                        Kelola dan pantau data Aparatur Sipil Negara di lingkungan Pemerintah Kota Pontianak
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
                                <p className="text-xs text-slate-400">Total ASN</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.total_pegawai}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <UserCheck size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Laki-laki</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.laki_laki}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <User size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Perempuan</p>
                                <p className="text-2xl font-bold text-slate-800">{stats.perempuan}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Building size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Unit Kerja</p>
                                <p className="text-2xl font-bold text-slate-800">{skpdList.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan NIP atau Nama Pegawai..."
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={filters.nama}
                                    onChange={(e) => handleFilterChange('nama', e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Search size={18} />
                                    Cari
                                </button>
                                <button
                                    onClick={handleResetFilters}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all flex items-center gap-2"
                                >
                                    <X size={18} />
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {/* SKPD Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowSkpdDropdown(!showSkpdDropdown)}
                                    className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-sm transition-all ${filters.skpd_id
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Building size={16} />
                                    {getSelectedSkpdName()}
                                    <ChevronLeft size={14} className={`transform transition-transform ${showSkpdDropdown ? '-rotate-90' : 'rotate-90'}`} />
                                </button>

                                {showSkpdDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-10 max-h-80 overflow-y-auto">
                                        <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Cari SKPD..."
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    value={skpdSearch}
                                                    onChange={(e) => setSkpdSearch(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-1">
                                            <button
                                                onClick={() => {
                                                    handleFilterChange('skpd_id', '');
                                                    setShowSkpdDropdown(false);
                                                    setSkpdSearch('');
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!filters.skpd_id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50'
                                                    }`}
                                            >
                                                Semua SKPD
                                            </button>
                                            {loadingSkpd ? (
                                                <div className="p-4 text-center">
                                                    <RefreshCcw size={20} className="animate-spin mx-auto text-slate-400" />
                                                </div>
                                            ) : (
                                                filteredSkpdList.map(skpd => (
                                                    <button
                                                        key={skpd.unit_org_induk_id}
                                                        onClick={() => {
                                                            handleFilterChange('skpd_id', skpd.unit_org_induk_id.toString());
                                                            setShowSkpdDropdown(false);
                                                            setSkpdSearch('');
                                                        }}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filters.skpd_id === skpd.unit_org_induk_id.toString()
                                                                ? 'bg-blue-50 text-blue-700'
                                                                : 'hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {skpd.unit_org_induk_nm}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Filter dengan Group */}
                            <select
                                className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-sm min-w-[180px]"
                                value={filters.status_id}
                                onChange={(e) => handleFilterChange('status_id', e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <optgroup label="AKTIF" className="font-bold text-green-700">
                                    {statusOptionsGrouped.AKTIF.map(status => (
                                        <option key={status.id} value={status.id}>
                                            {status.nama}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="TIDAK AKTIF" className="font-bold text-red-700">
                                    {statusOptionsGrouped.TIDAK_AKTIF.map(status => (
                                        <option key={status.id} value={status.id}>
                                            {status.nama}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="KONTRAK" className="font-bold text-pink-700">
                                    {statusOptionsGrouped.KONTRAK.map(status => (
                                        <option key={status.id} value={status.id}>
                                            {status.nama}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>

                            {/* Jenis Kelamin Filter */}
                            <select
                                className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                                value={filters.jenis_kelamin}
                                onChange={(e) => handleFilterChange('jenis_kelamin', e.target.value)}
                            >
                                <option value="">Semua Jenis Kelamin</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>

                        {/* Active Filters Display */}
                        {(filters.skpd_id || filters.status_id || filters.jenis_kelamin || filters.nama) && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-500">Filter aktif:</span>
                                {filters.skpd_id && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                        <Building size={12} />
                                        {getSelectedSkpdName()}
                                        <button onClick={() => handleFilterChange('skpd_id', '')} className="hover:text-blue-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filters.status_id && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                        {statusOptionsGrouped.AKTIF.find(s => s.id === parseInt(filters.status_id))?.nama ||
                                            statusOptionsGrouped.TIDAK_AKTIF.find(s => s.id === parseInt(filters.status_id))?.nama ||
                                            statusOptionsGrouped.KONTRAK.find(s => s.id === parseInt(filters.status_id))?.nama}
                                        <button onClick={() => handleFilterChange('status_id', '')} className="hover:text-green-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filters.jenis_kelamin && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                                        {filters.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        <button onClick={() => handleFilterChange('jenis_kelamin', '')} className="hover:text-purple-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                                {filters.nama && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                                        <Search size={12} />
                                        {filters.nama}
                                        <button onClick={() => handleFilterChange('nama', '')} className="hover:text-gray-900">
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center">
                            <RefreshCcw size={40} className="animate-spin mx-auto text-blue-500 mb-4" />
                            <p className="text-slate-500">Memuat data...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="p-12 text-center">
                            <Database size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">Tidak ada data ditemukan</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">NO</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">NIP</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">NAMA</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">SKPD / DINAS</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">TEMPAT LAHIR</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">JENIS KELAMIN</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">STATUS</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.map((item, idx) => {
                                            const statusInfo = item.status_info || getStatusInfo(item.status_id);
                                            return (
                                                <tr key={item.peg_id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {(filters.page - 1) * itemsPerPage + idx + 1}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{item.peg_nip}</td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {item.peg_gelar_depan ? item.peg_gelar_depan + ' ' : ''}
                                                                {item.peg_nama}
                                                                {item.peg_gelar_belakang ? ', ' + item.peg_gelar_belakang : ''}
                                                            </p>
                                                            {item.peg_nip_lama && item.peg_nip_lama !== '0' && (
                                                                <p className="text-xs text-slate-400">NIP Lama: {item.peg_nip_lama}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-1">
                                                            <Building size={14} className="text-slate-400" />
                                                            <span>{item.skpd_nama || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {item.peg_tmpt_lahir}, {formatDate(item.peg_lahir_tanggal)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600">{formatGender(item.peg_jenis_kelamin)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                                                            {statusInfo.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleViewDetail(item.peg_id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Detail"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            <button
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        Menampilkan {(filters.page - 1) * itemsPerPage + 1} - {Math.min(filters.page * itemsPerPage, totalData)} dari {totalData} data
                                    </p>
                                    {renderPagination()}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedPegawai && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />
                    <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <User size={24} />
                                        Detail Pegawai
                                    </h2>
                                    <p className="text-blue-100 text-xs mt-1">Informasi lengkap data ASN</p>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/20 rounded-xl">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {loadingDetail ? (
                            <div className="p-12 text-center">
                                <RefreshCcw size={40} className="animate-spin mx-auto text-blue-500 mb-4" />
                                <p className="text-slate-500">Memuat detail...</p>
                            </div>
                        ) : (
                            <>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-1">
                                            <div className="text-center">
                                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-blue-200 shadow-lg">
                                                    {selectedPegawai.peg_nama?.charAt(0) || '?'}
                                                </div>
                                                <h3 className="font-black text-slate-800 mt-3">
                                                    {selectedPegawai.peg_gelar_depan ? selectedPegawai.peg_gelar_depan + ' ' : ''}
                                                    {selectedPegawai.peg_nama}
                                                    {selectedPegawai.peg_gelar_belakang ? ', ' + selectedPegawai.peg_gelar_belakang : ''}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-mono">NIP. {selectedPegawai.peg_nip}</p>
                                                <div className="mt-2">
                                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${selectedPegawai.status_info?.bgColor || 'bg-slate-100'} ${selectedPegawai.status_info?.color || 'text-slate-700'} border ${selectedPegawai.status_info?.borderColor || 'border-slate-200'}`}>
                                                        {selectedPegawai.status_info?.text || getStatusInfo(selectedPegawai.status_id).text}
                                                    </span>
                                                </div>
                                                {selectedPegawai.skpd_nama && (
                                                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500">
                                                        <Building size={12} />
                                                        {selectedPegawai.skpd_nama}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="bg-slate-50 rounded-2xl p-4 mt-4">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Informasi Kontak</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{selectedPegawai.peg_email || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone size={14} className="text-slate-400" />
                                                        <span className="text-slate-600">{selectedPegawai.peg_telp || '-'}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin size={14} className="text-slate-400 mt-0.5" />
                                                        <span className="text-slate-600">{selectedPegawai.peg_rumah_alamat || '-'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">NIP Lama</label>
                                                    <p className="font-medium text-slate-700">
                                                        {selectedPegawai.peg_nip_lama && selectedPegawai.peg_nip_lama !== '0' ? selectedPegawai.peg_nip_lama : '-'}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">Tempat, Tanggal Lahir</label>
                                                    <p className="font-medium text-slate-700">
                                                        {selectedPegawai.peg_tmpt_lahir || '-'}, {formatDate(selectedPegawai.peg_lahir_tanggal)}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">Jenis Kelamin</label>
                                                    <p className="font-medium text-slate-700">{formatGender(selectedPegawai.peg_jenis_kelamin)}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">Agama</label>
                                                    <p className="font-medium text-slate-700">{selectedPegawai.agama_nama || '-'}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">Status</label>
                                                    <p className="font-medium text-slate-700">
                                                        {selectedPegawai.status_info?.text || getStatusInfo(selectedPegawai.status_id).text}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">Golongan / Pangkat</label>
                                                    <p className="font-medium text-slate-700">{selectedPegawai.golongan_text || '-'}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">TMT</label>
                                                    <p className="font-medium text-slate-700">{formatDate(selectedPegawai.peg_tmt)}</p>
                                                </div>
                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <label className="text-[10px] text-slate-400 uppercase">TMT PNS</label>
                                                    <p className="font-medium text-slate-700">{formatDate(selectedPegawai.peg_pns_tmt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-3xl flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowDetailModal(false)}
                                        className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}