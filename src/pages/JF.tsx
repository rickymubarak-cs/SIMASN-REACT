import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Briefcase } from 'lucide-react';
import { useJFData } from '../hooks/useJFData';
import { Navbar } from '../components/layout/Navbar';
import { DashboardCard } from '../components/layout/DashboardCard';
import { DataCardJF } from '../components/cards/DataCardJF';
import { DetailModalJF } from '../components/modals/DetailModalJF';
import { ActionModal } from '../components/modals/ActionModal';
import { UploadModalJF } from '../components/modals/UploadModalJF';
import { SkeletonLoading } from '../components/common/SkeletonLoading';
import { SearchBar } from '../components/common/SearchBar';
import { jfService } from '../service/jfService';

interface JFProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function JF({ activeTab, onTabChange }: JFProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [modalState, setModalState] = useState({
        detail: false,
        perbaiki: false,
        tolak: false,
        upload: false
    });

    const { data, loading, error, perangkatDaerah, setPerangkatDaerah, refreshData } = useJFData();
    const itemsPerPage = 8;

    useEffect(() => {
        console.log('JF Page - Data:', data);
        console.log('JF Page - Data count:', data.length);
    }, [data]);

    const filteredData = data.filter(item => {
        const namaLengkap = `${item.peg_gelar_depan || ""} ${item.peg_nama || ""} ${item.peg_gelar_belakang || ""}`.trim();
        return (
            namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.peg_nip || "").includes(searchTerm)
        );
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePerbaiki = async (id: string, keterangan: string) => {
        try {
            await jfService.updateStatus(id, 'perbaikan', keterangan);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal mengirim perbaikan");
        }
    };

    const handleTolak = async (id: string, alasan: string) => {
        try {
            await jfService.updateStatus(id, 'ditolak', alasan);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal menolak pengajuan");
        }
    };

    const handleTerima = async (id: string, isTembusan: boolean) => {
        try {
            const status = isTembusan ? 'selesai' : 'diterima';
            await jfService.updateStatus(id, status);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal menerima pengajuan");
        }
    };

    const handleUpload = async (id: string, file: File) => {
        try {
            await jfService.uploadBerkas(id, file);
            refreshData();
        } catch (err) {
            console.error("Error uploading file:", err);
            alert("Gagal upload berkas");
            throw err;
        }
    };

    const handleLocalTabChange = (tab: string) => {
        console.log('JF - handleLocalTabChange called with:', tab);
        onTabChange(tab);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            <Navbar
                activeTab={activeTab}
                onTabChange={handleLocalTabChange}
                userName="Administrator"
                userRole="BKPSDM Kota Pontianak"
                onLogout={handleLogout}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white">
                    <h1 className="text-2xl font-black mb-1">
                        Jabatan Fungsional
                    </h1>
                    <p className="text-indigo-100 text-sm">
                        Kelola dan pantau pengajuan jabatan fungsional ASN
                    </p>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        label="Total Berkas"
                        value={data.length}
                        icon="Database"
                        color="indigo"
                    />
                    <DashboardCard
                        label="Unit Kerja"
                        value={perangkatDaerah || 'Semua'}
                        icon="MapPin"
                        color="orange"
                    />
                    <DashboardCard
                        label="Status Sistem"
                        value="Online"
                        icon="RefreshCcw"
                        color="emerald"
                    />
                    <DashboardCard
                        label="Jam Server"
                        value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        icon="Clock"
                        color="purple"
                    />
                </div>

                {/* Search & Filter */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={(value) => {
                        setSearchTerm(value);
                        setCurrentPage(1);
                    }}
                    perangkatDaerah={perangkatDaerah}
                    onPerangkatDaerahChange={setPerangkatDaerah}
                    onFilter={refreshData}
                    loading={loading}
                />

                {/* Data Grid */}
                {loading ? (
                    <SkeletonLoading />
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-rose-500" />
                        </div>
                        <h3 className="text-xl font-black text-rose-800 mb-2">Terjadi Gangguan</h3>
                        <p className="text-rose-600 text-sm mb-6">{error}</p>
                        <button
                            onClick={refreshData}
                            className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : paginatedData.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {paginatedData.map((item, idx) => (
                                <DataCardJF
                                    key={idx}
                                    data={item}
                                    index={idx + 1 + (currentPage - 1) * itemsPerPage}
                                    onDetail={() => {
                                        setSelectedData(item);
                                        setModalState(prev => ({ ...prev, detail: true }));
                                    }}
                                    onPerbaiki={() => {
                                        setSelectedData(item);
                                        setModalState(prev => ({ ...prev, perbaiki: true }));
                                    }}
                                    onTolak={() => {
                                        setSelectedData(item);
                                        setModalState(prev => ({ ...prev, tolak: true }));
                                    }}
                                    onTerima={handleTerima}
                                    onUpload={() => {
                                        setSelectedData(item);
                                        setModalState(prev => ({ ...prev, upload: true }));
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-slate-100 transition-colors"
                                    >
                                        Sebelumnya
                                    </button>
                                    <div className="px-4">
                                        <span className="text-sm font-bold text-slate-800">{currentPage}</span>
                                        <span className="text-slate-400"> / </span>
                                        <span className="text-sm text-slate-600">{totalPages}</span>
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-slate-100 transition-colors"
                                    >
                                        Selanjutnya
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Briefcase size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Belum Ada Data Jabatan Fungsional</h3>
                        <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                            Saat ini belum terdapat pengajuan jabatan fungsional
                            {perangkatDaerah ? ` untuk unit kerja dengan ID ${perangkatDaerah}` : ''}.
                        </p>
                        <p className="text-slate-400 text-xs mt-4">
                            Data akan muncul setelah ada pengajuan yang masuk ke sistem.
                        </p>
                        <button
                            onClick={refreshData}
                            className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors"
                        >
                            Refresh Data
                        </button>
                    </div>
                )}
            </main>

            {/* Modals */}
            <DetailModalJF
                isOpen={modalState.detail}
                onClose={() => setModalState(prev => ({ ...prev, detail: false }))}
                data={selectedData}
            />

            <ActionModal
                isOpen={modalState.perbaiki}
                onClose={() => setModalState(prev => ({ ...prev, perbaiki: false }))}
                onSubmit={handlePerbaiki}
                title="Keterangan Perbaikan"
                actionType="perbaiki"
                data={selectedData}
            />

            <ActionModal
                isOpen={modalState.tolak}
                onClose={() => setModalState(prev => ({ ...prev, tolak: false }))}
                onSubmit={handleTolak}
                title="Alasan Penolakan"
                actionType="tolak"
                data={selectedData}
            />

            <UploadModalJF
                isOpen={modalState.upload}
                onClose={() => setModalState(prev => ({ ...prev, upload: false }))}
                onSubmit={handleUpload}
                data={selectedData}
            />
        </div>
    );
}