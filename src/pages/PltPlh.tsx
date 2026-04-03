// src/pages/PltPlh.tsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, UserCog } from 'lucide-react';
import { usePltplhData } from '../hooks/usePltplhData';
import { Navbar } from '../components/layout/Navbar';
import { DashboardSearchBar } from '../components/layout/DashboardSearchBar';
import { DataCardPltplh } from '../components/cards/Pelayanan/Admin/Pltplh/DataCardPltplh';
import { DataCardPltplhCompact } from '../components/cards/Pelayanan/Admin/Pltplh/DataCardPltplhCompact';
import { DataCardPltplhDetailed } from '../components/cards/Pelayanan/Admin/Pltplh/DataCardPltplhDetailed';
import { DataTablePltplh } from '../components/tables/DataTablePltplh';
import { DetailModalPltplh } from '../components/modals/Layanan/Admin/Pltplh/DetailModalPltplh';
import { ActionModal } from '../components/modals/ActionModal';
import { UploadModalPltplh } from '../components/modals/Layanan/Admin/Pltplh/UploadModalPltplh';
import { SkeletonLoading } from '../components/common/SkeletonLoading';
import { pltplhService } from '../service/pltplhService';

type ViewMode = 'standard' | 'compact' | 'detailed' | 'table';

interface PltPlhProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function PltPlh({ activeTab, onTabChange }: PltPlhProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [viewMode, setViewMode] = useState<ViewMode>('standard');
    const [unitKerjaName, setUnitKerjaName] = useState("");
    const [modalState, setModalState] = useState({
        detail: false,
        perbaiki: false,
        tolak: false,
        upload: false
    });

    const { data, loading, error, refreshData } = usePltplhData();

    const getItemsPerPage = () => {
        switch (viewMode) {
            case 'compact': return 12;
            case 'detailed': return 6;
            case 'table': return 10;
            default: return 8;
        }
    };

    const itemsPerPage = getItemsPerPage();

    const filteredData = data.filter(item => {
        const namaLengkap = `${item.peg_gelar_depan || ""} ${item.peg_nama || ""} ${item.peg_gelar_belakang || ""}`.trim();
        const nipStr = item.peg_nip ? String(item.peg_nip) : "";
        const unitKerja = item.unit_org_induk_nm || "";

        const searchLower = searchTerm.toLowerCase();

        return (
            namaLengkap.toLowerCase().includes(searchLower) ||
            nipStr.includes(searchTerm) ||
            unitKerja.toLowerCase().includes(searchLower)
        );
    });

    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [viewMode, searchTerm]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey) {
                switch (e.key) {
                    case '1':
                        setViewMode('standard');
                        e.preventDefault();
                        break;
                    case '2':
                        setViewMode('compact');
                        e.preventDefault();
                        break;
                    case '3':
                        setViewMode('detailed');
                        e.preventDefault();
                        break;
                    case '4':
                        setViewMode('table');
                        e.preventDefault();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleLogout = () => {
        console.log("Logout clicked");
    };

    const renderContent = () => {
        if (loading) {
            const skeletonCount = getItemsPerPage();
            let skeletonGridClass = '';

            switch (viewMode) {
                case 'compact':
                    skeletonGridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4';
                    break;
                case 'detailed':
                    skeletonGridClass = 'grid-cols-1 lg:grid-cols-2 gap-6';
                    break;
                case 'table':
                    return <SkeletonLoading count={skeletonCount} className="bg-white rounded-2xl" />;
                default:
                    skeletonGridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
            }

            return (
                <div className={`grid ${skeletonGridClass}`}>
                    {[...Array(skeletonCount)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 animate-pulse">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-slate-200 rounded-2xl"></div>
                                    <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                                </div>
                                <div className="pt-4 border-t border-slate-100">
                                    <div className="h-8 bg-slate-200 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (error) {
            return (
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
            );
        }

        if (paginatedData.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <UserCog size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Belum Ada Usulan PLT/PLH</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                        Saat ini belum terdapat pengajuan usulan Pelaksana Tugas (PLT) atau Pejabat Laksana Harian (PLH)
                        {unitKerjaName ? ` untuk unit kerja dengan ID ${unitKerjaName}` : ''}.
                    </p>
                    <button
                        onClick={refreshData}
                        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>
            );
        }

        switch (viewMode) {
            case 'compact':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        {paginatedData.map((item, idx) => (
                            <DataCardPltplhCompact
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
                );

            case 'detailed':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {paginatedData.map((item, idx) => (
                            <DataCardPltplhDetailed
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
                );

            case 'table':
                return (
                    <DataTablePltplh
                        data={paginatedData}
                        startIndex={(currentPage - 1) * itemsPerPage}
                        onDetail={(item) => {
                            setSelectedData(item);
                            setModalState(prev => ({ ...prev, detail: true }));
                        }}
                        onPerbaiki={(item) => {
                            setSelectedData(item);
                            setModalState(prev => ({ ...prev, perbaiki: true }));
                        }}
                        onTolak={(item) => {
                            setSelectedData(item);
                            setModalState(prev => ({ ...prev, tolak: true }));
                        }}
                        onTerima={handleTerima}
                        onUpload={(item) => {
                            setSelectedData(item);
                            setModalState(prev => ({ ...prev, upload: true }));
                        }}
                    />
                );

            default:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {paginatedData.map((item, idx) => (
                            <DataCardPltplh
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
                );
        }
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
                {/* Welcome Section dengan DashboardSearchBar Terintegrasi */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
                    <div className="mb-4">
                        <h1 className="text-2xl font-black mb-1">
                            Pelaksana Tugas (PLT) / Pejabat Laksana Harian (PLH)
                        </h1>
                        <p className="text-blue-100 text-sm">
                            Kelola dan pantau pengajuan usulan Pelaksana Tugas (PLT) dan Pejabat Laksana Harian (PLH) pegawai
                        </p>
                    </div>

                    {/* DashboardSearchBar dengan cards yang sudah didefinisikan */}
                    <DashboardSearchBar
                        searchTerm={searchTerm}
                        onSearchChange={(value) => {
                            setSearchTerm(value);
                            setCurrentPage(1);
                        }}
                        onSearch={() => setCurrentPage(1)}
                        loading={loading}
                        perangkatDaerah={unitKerjaName}
                        onPerangkatDaerahChange={setUnitKerjaName}
                        showUnitFilter={true}
                        onFilter={refreshData}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setViewMode(mode);
                            setCurrentPage(1);
                        }}
                        itemCount={filteredData.length}
                        variant="tubel"
                        placeholder="Cari berdasarkan NIP atau Nama Pegawai..."
                        buttonText="Cari"
                    />
                </div>

                {/* Data Content */}
                {renderContent()}

                {/* Pagination */}
                {!loading && !error && paginatedData.length > 0 && totalPages > 1 && (
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
            </main>

            {/* Modals */}
            <DetailModalPltplh
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

            <UploadModalPltplh
                isOpen={modalState.upload}
                onClose={() => setModalState(prev => ({ ...prev, upload: false }))}
                onSubmit={handleUpload}
                data={selectedData}
            />
        </div>
    );
}