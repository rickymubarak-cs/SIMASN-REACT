// src/pages/Pemberhentian.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertCircle, UserMinus, Settings2 } from 'lucide-react';
import { usePemberhentianData } from '../hooks/usePemberhentianData';
import { Navbar } from '../components/layout/Navbar';
import { DashboardSearchBar } from '../components/layout/DashboardSearchBar';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonLoading } from '../components/common/SkeletonLoading';
import { pemberhentianService } from '../service/pemberhentianService';

// Import komponen untuk berbagai mode tampilan
import { ViewModeSelector, ViewMode } from '../components/common/ViewModeSelector';
import { StandardCard } from '../components/cards/StandardCard';
import { CompactCard } from '../components/cards/CompactCard';
import { DetailedListItem } from '../components/cards/DetailedListItem';
import { DataTableView } from '../components/tables/DataTableView';

// Import modals
import { DetailModalPemberhentian } from '../components/modals/DetailModalPemberhentian';
import { ActionModal } from '../components/modals/ActionModal';
import { UploadModalPemberhentian } from '../components/modals/UploadModalPemberhentian';

interface PemberhentianProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Pemberhentian({ activeTab, onTabChange }: PemberhentianProps) {
    // State untuk view mode
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const saved = localStorage.getItem('pemberhentian_view_mode');
        return (saved as ViewMode) || 'standard';
    });

    // State untuk pencarian dan pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalState, setModalState] = useState({
        detail: false,
        perbaiki: false,
        tolak: false,
        upload: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, loading, error, perangkatDaerah, setPerangkatDaerah, refreshData } = usePemberhentianData();

    // Tentukan items per page berdasarkan view mode
    const getItemsPerPage = useCallback(() => {
        switch (viewMode) {
            case 'compact': return 24;
            case 'list': return 10;
            case 'table': return 15;
            default: return 8;
        }
    }, [viewMode]);

    const itemsPerPage = getItemsPerPage();

    // Optimasi filtering dengan useMemo
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;

        return data.filter(item => {
            const namaLengkap = [
                item.peg_gelar_depan || "",
                item.peg_nama || "",
                item.peg_gelar_belakang || ""
            ].filter(Boolean).join(" ").trim();

            const searchLower = searchTerm.toLowerCase();
            return (
                namaLengkap.toLowerCase().includes(searchLower) ||
                (item.peg_nip || "").includes(searchTerm)
            );
        });
    }, [data, searchTerm]);

    // Optimasi pagination dengan useMemo
    const paginatedData = useMemo(() => {
        if (viewMode === 'table') return filteredData; // Table menggunakan filtering internal
        return filteredData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredData, currentPage, itemsPerPage, viewMode]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Save view mode preference
    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem('pemberhentian_view_mode', mode);
        setCurrentPage(1); // Reset ke halaman pertama saat ganti mode
    }, []);

    // Handler untuk aksi
    const handlePerbaiki = useCallback(async (id: string, keterangan: string) => {
        setIsSubmitting(true);
        try {
            await pemberhentianService.updateStatus(id, 'perbaikan', keterangan);
            await refreshData();
        } catch (err: any) {
            console.error("Error updating status:", err);
            alert(err.message || "Gagal mengirim perbaikan");
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshData]);

    const handleTolak = useCallback(async (id: string, alasan: string) => {
        setIsSubmitting(true);
        try {
            await pemberhentianService.updateStatus(id, 'ditolak', alasan);
            await refreshData();
        } catch (err: any) {
            console.error("Error updating status:", err);
            alert(err.message || "Gagal menolak pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshData]);

    const handleTerima = useCallback(async (id: string, isTembusan: boolean) => {
        setIsSubmitting(true);
        try {
            const status = isTembusan ? 'selesai' : 'diterima';
            await pemberhentianService.updateStatus(id, status);
            await refreshData();
        } catch (err: any) {
            console.error("Error updating status:", err);
            alert(err.message || "Gagal menerima pengajuan");
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshData]);

    const handleUpload = useCallback(async (id: string, file: File) => {
        setIsSubmitting(true);
        try {
            await pemberhentianService.uploadBerkas(id, file);
            await refreshData();
        } catch (err: any) {
            console.error("Error uploading file:", err);
            alert(err.message || "Gagal upload berkas");
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, [refreshData]);

    const handleLocalTabChange = useCallback((tab: string) => {
        onTabChange(tab);
    }, [onTabChange]);

    const handleLogout = useCallback(() => {
        console.log("Logout clicked");
    }, []);

    const handleSearch = useCallback(() => {
        setCurrentPage(1);
        refreshData();
    }, [refreshData]);

    // Render konten berdasarkan view mode
    const renderContent = () => {
        if (loading) {
            const skeletonCount = viewMode === 'compact' ? 12 : viewMode === 'list' ? 5 : viewMode === 'table' ? 5 : 8;
            return <SkeletonLoading count={skeletonCount} />;
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
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Memuat...' : 'Coba Lagi'}
                    </button>
                </div>
            );
        }

        if (filteredData.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <UserMinus size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Belum Ada Data Pemberhentian ASN</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                        Saat ini belum terdapat pengajuan pemberhentian ASN
                        {perangkatDaerah ? ` untuk unit kerja dengan ID ${perangkatDaerah}` : ''}.
                    </p>
                    <button
                        onClick={refreshData}
                        disabled={isSubmitting}
                        className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Memuat...' : 'Refresh Data'}
                    </button>
                </div>
            );
        }

        switch (viewMode) {
            case 'compact':
                return (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                            {paginatedData.map((item, idx) => (
                                <CompactCard
                                    key={item.layanan_pemberhentian_id || idx}
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
                    </>
                );

            case 'list':
                return (
                    <div className="space-y-3">
                        {paginatedData.map((item, idx) => (
                            <DetailedListItem
                                key={item.layanan_pemberhentian_id || idx}
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
                    <DataTableView
                        data={filteredData}
                        onDetail={(item) => {
                            setSelectedData(item);
                            setModalState(prev => ({ ...prev, detail: true }));
                        }}
                        onPerbaiki={(id) => {
                            const item = data.find(d => d.layanan_pemberhentian_id === id);
                            if (item) {
                                setSelectedData(item);
                                setModalState(prev => ({ ...prev, perbaiki: true }));
                            }
                        }}
                        onTolak={(id) => {
                            const item = data.find(d => d.layanan_pemberhentian_id === id);
                            if (item) {
                                setSelectedData(item);
                                setModalState(prev => ({ ...prev, tolak: true }));
                            }
                        }}
                        onTerima={handleTerima}
                        onUpload={(id) => {
                            const item = data.find(d => d.layanan_pemberhentian_id === id);
                            if (item) {
                                setSelectedData(item);
                                setModalState(prev => ({ ...prev, upload: true }));
                            }
                        }}
                        isLoading={loading}
                    />
                );

            default: // standard
                return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedData.map((item, idx) => (
                                <StandardCard
                                    key={item.layanan_pemberhentian_id || idx}
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
                    </>
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
                {/* Welcome Section dengan View Mode Selector */}
                <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-3xl p-6 text-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-black mb-1">
                                Pemberhentian ASN
                            </h1>
                            <p className="text-rose-100 text-sm">
                                Kelola dan pantau pengajuan pemberhentian ASN (pensiun, meninggal dunia, dll)
                            </p>
                        </div>
                        <ViewModeSelector
                            currentMode={viewMode}
                            onModeChange={handleViewModeChange}
                        />
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <DashboardSearchBar
                        label="Total Berkas"
                        value={data.length}
                        icon="Database"
                        color="rose"
                    />
                    <DashboardSearchBar
                        label="Unit Kerja"
                        value={perangkatDaerah || 'Semua'}
                        icon="MapPin"
                        color="orange"
                    />
                    <DashboardSearchBar
                        label="Status Sistem"
                        value="Online"
                        icon="RefreshCcw"
                        color="emerald"
                    />
                    <DashboardSearchBar
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
                    onSearch={handleSearch}
                    perangkatDaerah={perangkatDaerah}
                    onPerangkatDaerahChange={setPerangkatDaerah}
                    onFilter={refreshData}
                    loading={loading || isSubmitting}
                    showUnitFilter={true}
                />

                {/* Data Content */}
                {renderContent()}

                {/* Pagination - hanya untuk mode yang tidak menggunakan internal pagination di table */}
                {totalPages > 1 && viewMode !== 'table' && (
                    <div className="flex justify-center mt-12">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || isSubmitting}
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
                                disabled={currentPage === totalPages || isSubmitting}
                                className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-slate-100 transition-colors"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                )}

                {/* Info jumlah data untuk mode table */}
                {viewMode === 'table' && filteredData.length > 0 && (
                    <div className="text-center text-xs text-slate-500">
                        Menampilkan {filteredData.length} dari {data.length} data
                    </div>
                )}
            </main>

            {/* Modals */}
            <DetailModalPemberhentian
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
                isLoading={isSubmitting}
            />

            <ActionModal
                isOpen={modalState.tolak}
                onClose={() => setModalState(prev => ({ ...prev, tolak: false }))}
                onSubmit={handleTolak}
                title="Alasan Penolakan"
                actionType="tolak"
                data={selectedData}
                isLoading={isSubmitting}
            />

            <UploadModalPemberhentian
                isOpen={modalState.upload}
                onClose={() => setModalState(prev => ({ ...prev, upload: false }))}
                onSubmit={handleUpload}
                data={selectedData}
                isLoading={isSubmitting}
            />
        </div>
    );
}