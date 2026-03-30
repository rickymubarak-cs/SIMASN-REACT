import React, { useState, useEffect } from 'react';
import {
    Search, RefreshCcw, Database, Users, Building, User,
    ChevronRight, ChevronDown, ChevronUp, Eye, Download,
    FileText, Calendar, Briefcase, TrendingUp, Wallet,
    Filter, X, Printer, DownloadCloud, Edit, Trash2,
    CheckCircle, XCircle, Clock, AlertCircle, Info,
    Mail, Phone, MapPin, Calendar as CalendarIcon, UserCheck,
    UserX, Award, GraduationCap, BookOpen, Home
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

interface PegawaiData {
    peg_id: string;
    peg_nip: string;
    peg_nip_lama: string;
    peg_nama: string;
    peg_gelar_depan: string;
    peg_gelar_belakang: string;
    peg_tmpt_lahir: string;
    peg_lahir_tanggal: string;
    peg_jenis_kelamin: string;
    agama_id: string;
    agama_nama?: string;
    status_id: string;
    status_nama?: string;
    unit_org_induk_nm: string;
    unit_org_nama?: string;
    jabatan_nama?: string;
    gol_id: string;
    gol_nama?: string;
    eselon_id: string;
    eselon_nama?: string;
    peg_tmt: string;
    peg_pns_tmt: string;
    peg_email: string;
    peg_telp: string;
    peg_rumah_alamat: string;
    foto: string;
    [key: string]: any;
}

interface DataASNProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function DataASN({ activeTab, onTabChange }: DataASNProps) {
    const [data, setData] = useState<PegawaiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGolongan, setSelectedGolongan] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [selectedPegawai, setSelectedPegawai] = useState<PegawaiData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [units, setUnits] = useState<{ id: string; nama: string }[]>([]);
    const [statuses, setStatuses] = useState<{ id: string; nama: string }[]>([]);
    const [golongan, setGolongan] = useState<{ id: string; nama: string }[]>([]);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchData();
        fetchFilters();
    }, [currentPage, selectedUnit, selectedStatus, selectedGolongan]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Simulasi fetch data dari API - Ganti dengan API real Anda
            await new Promise(resolve => setTimeout(resolve, 500));
            const dummyData: PegawaiData[] = [
                {
                    peg_id: "1",
                    peg_nip: "197506151998031001",
                    peg_nip_lama: "123456789",
                    peg_nama: "AHMAD SUPRIYADI",
                    peg_gelar_depan: "Drs.",
                    peg_gelar_belakang: "M.Si",
                    peg_tmpt_lahir: "PONTIANAK",
                    peg_lahir_tanggal: "1975-06-15",
                    peg_jenis_kelamin: "L",
                    agama_id: "1",
                    agama_nama: "Islam",
                    status_id: "1",
                    status_nama: "Aktif",
                    unit_org_induk_nm: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
                    jabatan_nama: "Kepala Dinas",
                    gol_id: "12",
                    gol_nama: "IV/c - Pembina Utama Muda",
                    eselon_id: "2",
                    eselon_nama: "II.b",
                    peg_tmt: "2020-01-01",
                    peg_pns_tmt: "1998-03-01",
                    peg_email: "ahmad.supriyadi@pontianak.go.id",
                    peg_telp: "081234567890",
                    peg_rumah_alamat: "Jl. Ahmad Yani No. 123 Pontianak",
                    foto: ""
                },
                {
                    peg_id: "2",
                    peg_nip: "198002202005012002",
                    peg_nip_lama: "987654321",
                    peg_nama: "SITI NURHALIZA",
                    peg_gelar_depan: "",
                    peg_gelar_belakang: "S.Kom",
                    peg_tmpt_lahir: "SINGKAWANG",
                    peg_lahir_tanggal: "1980-02-20",
                    peg_jenis_kelamin: "P",
                    agama_id: "1",
                    agama_nama: "Islam",
                    status_id: "1",
                    status_nama: "Aktif",
                    unit_org_induk_nm: "DINAS KESEHATAN",
                    jabatan_nama: "Kepala Seksi",
                    gol_id: "10",
                    gol_nama: "III/d - Penata Tingkat I",
                    eselon_id: "3",
                    eselon_nama: "III.a",
                    peg_tmt: "2018-07-01",
                    peg_pns_tmt: "2005-05-01",
                    peg_email: "siti.nurhaliza@pontianak.go.id",
                    peg_telp: "082345678901",
                    peg_rumah_alamat: "Jl. Gajah Mada No. 45 Pontianak",
                    foto: ""
                },
                {
                    peg_id: "3",
                    peg_nip: "196812151992032013",
                    peg_nip_lama: "520012424",
                    peg_nama: "RITA MARDIANA",
                    peg_gelar_depan: "",
                    peg_gelar_belakang: "",
                    peg_tmpt_lahir: "PONTIANAK",
                    peg_lahir_tanggal: "1968-12-15",
                    peg_jenis_kelamin: "P",
                    agama_id: "1",
                    agama_nama: "Islam",
                    status_id: "3",
                    status_nama: "Pensiun",
                    unit_org_induk_nm: "SEKRETARIAT DAERAH",
                    jabatan_nama: "Kepala Bagian",
                    gol_id: "11",
                    gol_nama: "IV/a - Pembina",
                    eselon_id: "3",
                    eselon_nama: "III.a",
                    peg_tmt: "2015-01-01",
                    peg_pns_tmt: "1992-03-01",
                    peg_email: "rita.mardiana@pontianak.go.id",
                    peg_telp: "081250243496",
                    peg_rumah_alamat: "Jl. Andalas No. 9 Kota Baru",
                    foto: ""
                },
                {
                    peg_id: "4",
                    peg_nip: "199404252015071001",
                    peg_nip_lama: "2073",
                    peg_nama: "IMAM HARRIS PRATAMA",
                    peg_gelar_depan: "",
                    peg_gelar_belakang: "S.STP., M.A.",
                    peg_tmpt_lahir: "PONTIANAK",
                    peg_lahir_tanggal: "1994-04-25",
                    peg_jenis_kelamin: "L",
                    agama_id: "1",
                    agama_nama: "Islam",
                    status_id: "1",
                    status_nama: "Aktif",
                    unit_org_induk_nm: "KECAMATAN PONTIANAK TIMUR",
                    jabatan_nama: "Kasi Pemberdayaan Masyarakat",
                    gol_id: "9",
                    gol_nama: "III/c - Penata",
                    eselon_id: "4",
                    eselon_nama: "IV.a",
                    peg_tmt: "2021-10-01",
                    peg_pns_tmt: "2015-07-01",
                    peg_email: "imam.harris@pontianak.go.id",
                    peg_telp: "081349442008",
                    peg_rumah_alamat: "Jl. Budi Utomo GG. Pendidikan No 12",
                    foto: ""
                }
            ];
            setData(dummyData);
            setTotalPages(3);
            setTotalData(25);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilters = async () => {
        try {
            setUnits([
                { id: "1", nama: "SEKRETARIAT DAERAH" },
                { id: "2", nama: "DINAS PENDIDIKAN DAN KEBUDAYAAN" },
                { id: "3", nama: "DINAS KESEHATAN" },
                { id: "4", nama: "DINAS KOPERASI, USAHA MIKRO DAN PERDAGANGAN" },
                { id: "5", nama: "KECAMATAN PONTIANAK TIMUR" }
            ]);
            setStatuses([
                { id: "1", nama: "Aktif" },
                { id: "2", nama: "Cuti" },
                { id: "3", nama: "Pensiun" },
                { id: "4", nama: "Meninggal" }
            ]);
            setGolongan([
                { id: "7", nama: "III/a - Penata Muda" },
                { id: "8", nama: "III/b - Penata Muda Tingkat I" },
                { id: "9", nama: "III/c - Penata" },
                { id: "10", nama: "III/d - Penata Tingkat I" },
                { id: "11", nama: "IV/a - Pembina" },
                { id: "12", nama: "IV/b - Pembina Tingkat I" }
            ]);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedUnit('');
        setSelectedStatus('');
        setSelectedGolongan('');
        setCurrentPage(1);
        setTimeout(() => fetchData(), 0);
    };

    const formatGender = (gender: string) => {
        if (gender === 'L') return 'Laki-laki';
        if (gender === 'P') return 'Perempuan';
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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Aktif':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Cuti':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Pensiun':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Meninggal':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

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
                                <p className="text-2xl font-bold text-slate-800">{totalData}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Building size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Unit Kerja</p>
                                <p className="text-2xl font-bold text-slate-800">{units.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <UserCheck size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">ASN Aktif</p>
                                <p className="text-2xl font-bold text-slate-800">-</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Award size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">PNS Pensiun</p>
                                <p className="text-2xl font-bold text-slate-800">-</p>
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
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                            <select
                                className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                            >
                                <option value="">Semua Unit Kerja</option>
                                {units.map(unit => (
                                    <option key={unit.id} value={unit.id}>{unit.nama}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.nama}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 text-sm"
                                value={selectedGolongan}
                                onChange={(e) => setSelectedGolongan(e.target.value)}
                            >
                                <option value="">Semua Golongan</option>
                                {golongan.map(gol => (
                                    <option key={gol.id} value={gol.id}>{gol.nama}</option>
                                ))}
                            </select>
                        </div>
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
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">UNIT KERJA</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">JABATAN</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">GOLONGAN</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">STATUS</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">AKSI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.map((item, idx) => (
                                            <tr key={item.peg_id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-slate-600">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-slate-600">{item.peg_nip}</td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {item.peg_gelar_depan ? item.peg_gelar_depan + ' ' : ''}
                                                            {item.peg_nama}
                                                            {item.peg_gelar_belakang ? ', ' + item.peg_gelar_belakang : ''}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{item.peg_nip_lama ? `NIP Lama: ${item.peg_nip_lama}` : ''}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.unit_org_induk_nm}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.jabatan_nama || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{item.gol_nama || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(item.status_nama || '')}`}>
                                                        {item.status_nama || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPegawai(item);
                                                                setShowDetailModal(true);
                                                            }}
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalData)} dari {totalData} data
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                                        >
                                            Sebelumnya
                                        </button>
                                        <div className="flex gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                                                                ? 'bg-blue-600 text-white'
                                                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
                                        >
                                            Selanjutnya
                                        </button>
                                    </div>
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
                    <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                        {/* Header */}
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

                        {/* Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Section */}
                                <div className="md:col-span-1">
                                    <div className="text-center">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-blue-200 shadow-lg">
                                            {selectedPegawai.peg_nama.charAt(0)}
                                        </div>
                                        <h3 className="font-black text-slate-800 mt-3">
                                            {selectedPegawai.peg_gelar_depan ? selectedPegawai.peg_gelar_depan + ' ' : ''}
                                            {selectedPegawai.peg_nama}
                                            {selectedPegawai.peg_gelar_belakang ? ', ' + selectedPegawai.peg_gelar_belakang : ''}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-mono">NIP. {selectedPegawai.peg_nip}</p>
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

                                {/* Detail Information */}
                                <div className="md:col-span-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">NIP Lama</label>
                                            <p className="font-medium text-slate-700">{selectedPegawai.peg_nip_lama || '-'}</p>
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
                                            <label className="text-[10px] text-slate-400 uppercase">Unit Kerja</label>
                                            <p className="font-medium text-slate-700">{selectedPegawai.unit_org_induk_nm}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">Jabatan</label>
                                            <p className="font-medium text-slate-700">{selectedPegawai.jabatan_nama || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">Golongan / Pangkat</label>
                                            <p className="font-medium text-slate-700">{selectedPegawai.gol_nama || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">Eselon</label>
                                            <p className="font-medium text-slate-700">{selectedPegawai.eselon_nama || '-'}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">TMT Jabatan</label>
                                            <p className="font-medium text-slate-700">{formatDate(selectedPegawai.peg_tmt)}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">TMT PNS</label>
                                            <p className="font-medium text-slate-700">{formatDate(selectedPegawai.peg_pns_tmt)}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3">
                                            <label className="text-[10px] text-slate-400 uppercase">Status</label>
                                            <p className="font-medium text-slate-700">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(selectedPegawai.status_nama || '')}`}>
                                                    {selectedPegawai.status_nama || '-'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-3xl flex justify-end gap-2">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

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