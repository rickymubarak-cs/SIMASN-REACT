// src/pages/PltPlh.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Search } from 'lucide-react';
import { usePltplhData } from '../hooks/usePltplhData';
import { Navbar } from '../components/layout/Navbar';
import { DashboardCard } from '../components/layout/DashboardCard';
import { DataCard } from '../components/cards/DataCard';
import { DetailModal } from '../components/modals/DetailModal';
import { ActionModal } from '../components/modals/ActionModal';
import { UploadModal } from '../components/modals/UploadModal';
import { SkeletonLoading } from '../components/common/SkeletonLoading';
import { SearchBar } from '../components/common/SearchBar';
import { pltplhService } from '../service/pltplhService';

interface PltPlhProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function PltPlh({ activeTab, onTabChange }: PltPlhProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [modalState, setModalState] = useState({
        detail: false,
        perbaiki: false,
        tolak: false,
        upload: false
    });

    const { data, loading, error, perangkatDaerah, setPerangkatDaerah, refreshData } = usePltplhData();
    const itemsPerPage = 8;

    // Filter data based on search term
    const filteredData = data.filter(item => {
        const namaLengkap = `${item.peg_gelar_depan || ""} ${item.peg_nama || item.nama || ""} ${item.peg_gelar_belakang || ""}`.trim();
        return (
            namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.peg_nip || item.nip || "").includes(searchTerm)
        );
    });

    // Pagination
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Action handlers
    const handlePerbaiki = async (id: string, keterangan: string) => {
        try {
            await pltplhService.updateStatus(id, 'perbaikan', keterangan);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal mengirim perbaikan");
        }
    };

    const handleTolak = async (id: string, alasan: string) => {
        try {
            await pltplhService.updateStatus(id, 'ditolak', alasan);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal menolak pengajuan");
        }
    };

    const handleTerima = async (id: string, isTembusan: boolean) => {
        try {
            const status = isTembusan ? 'selesai' : 'diterima';
            await pltplhService.updateStatus(id, status);
            refreshData();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal menerima pengajuan");
        }
    };

    const handleUpload = async (id: string, file: File) => {
        try {
            await pltplhService.uploadBerkas(id, file);
            refreshData();
        } catch (err) {
            console.error("Error uploading file:", err);
            alert("Gagal upload berkas");
            throw err;
        }
    };

    const handleLocalTabChange = (tab: string) => {
        onTabChange(tab);
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            <Navbar
                activeTab={activeTab}
                onTabChange={handleLocalTabChange}
                userName="Administrator"
                userRole="BKPSDM Kota Pontianak"
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
                    <h1 className="text-2xl font-black mb-1">
                        PLT / PLH
                    </h1>
                    <p className="text-blue-100 text-sm">
                        Kelola dan pantau pengajuan PLT (Pelaksana Tugas) dan PLH (Pejabat Laksana Harian)
                    </p>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardCard
                        label="Total Berkas"
                        value={data.length}
                        icon="Database"
                        color="blue"
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
                                <DataCard
                                    key={idx}
                                    data={item}
                                    index={idx + 1 + (currentPage - 1) * itemsPerPage}
                                    activeTab={activeTab}
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
                            <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Data Tidak Ditemukan</h3>
                        <p className="text-slate-400 text-sm mt-2">Silakan gunakan filter atau pencarian yang berbeda</p>
                    </div>
                )}
            </main>

            {/* Modals */}
            <DetailModal
                isOpen={modalState.detail}
                onClose={() => setModalState(prev => ({ ...prev, detail: false }))}
                data={selectedData}
                activeTab={activeTab}
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

            <UploadModal
                isOpen={modalState.upload}
                onClose={() => setModalState(prev => ({ ...prev, upload: false }))}
                onSubmit={handleUpload}
                data={selectedData}
            />
        </div>
    );
}