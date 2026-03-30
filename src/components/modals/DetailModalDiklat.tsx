import React, { useState } from 'react';
import {
    X, User, Building, Paperclip, FileCheck, Clock, Info, GraduationCap, Eye, ExternalLink,
    Mail, FileText
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId, getInitials } from '../../utils/formatters';
import { diklatFileConfig } from '../../service/diklatService';

interface DetailModalDiklatProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const BASE_URL_FOTO = "https://simasn.pontianak.go.id/assets/berkas/profil/";
const BASE_URL_BERKAS = "https://simasn.pontianak.go.id/assets/berkas/Layanan/Diklat/";

// Map icon untuk file
const fileIconMap: Record<string, any> = {
    Mail: Mail,
    FileText: FileText
};

// Map warna untuk badge
const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200'
};

export const DetailModalDiklat: React.FC<DetailModalDiklatProps> = ({
    isOpen,
    onClose,
    data
}) => {
    const [previewState, setPreviewState] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: '',
        title: ''
    });

    if (!isOpen || !data) return null;

    const fotoUrl = data.foto_url || (data.foto ? `${BASE_URL_FOTO}${data.foto}` : null);
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const initials = getInitials(namaLengkap);
    const status = data.layanan_diklat_status || "pengajuan";
    const namaUsulan = data.nama_usulan_diklat || "-";

    // Filter file yang tersedia
    const availableFiles = diklatFileConfig
        .filter(fileConfig => data[fileConfig.key] && data[fileConfig.key].trim() !== "")
        .map(fileConfig => ({
            ...fileConfig,
            url: data[`${fileConfig.key}_url`] || `${BASE_URL_BERKAS}${data[fileConfig.key]}`,
            icon: fileIconMap[fileConfig.icon] || FileText
        }));

    const handlePreview = (url: string, title: string) => {
        setPreviewState({ isOpen: true, url, title });
    };

    // Komponen Preview Modal Internal
    const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileName }: { isOpen: boolean; onClose: () => void; fileUrl: string; fileName: string }) => {
        const [loadError, setLoadError] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        if (!isOpen) return null;

        const fileExt = fileUrl.split('.').pop()?.toLowerCase() || '';
        const isPdf = fileExt === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

        const handleLoad = () => setIsLoading(false);
        const handleError = () => {
            setIsLoading(false);
            setLoadError(true);
        };

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-fadeIn">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold text-sm truncate flex-1"><Eye size={14} className="inline mr-2" />{fileName}</h3>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg"><X size={18} /></button>
                    </div>
                    <div className="p-3 bg-slate-100 min-h-[400px] max-h-[calc(85vh-100px)] overflow-auto relative">
                        {isLoading && !loadError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-slate-500 text-sm">Memuat dokumen...</p>
                            </div>
                        )}
                        {loadError ? (
                            <div className="flex flex-col items-center justify-center h-80 text-center">
                                <FileX size={48} className="text-slate-400 mb-3" />
                                <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                                <div className="flex gap-2">
                                    <a href={fileUrl} download className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs">Download</a>
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">Buka Tab Baru</a>
                                </div>
                            </div>
                        ) : isImage ? (
                            <img src={fileUrl} alt={fileName} className={`max-w-full max-h-[65vh] mx-auto rounded-lg transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`} onLoad={handleLoad} onError={handleError} />
                        ) : isPdf ? (
                            <iframe src={googleViewerUrl} className={`w-full h-[65vh] rounded-lg border-0 ${isLoading ? 'opacity-0' : 'opacity-100'}`} title={fileName} onLoad={handleLoad} onError={handleError} sandbox="allow-same-origin allow-scripts allow-popups allow-forms" referrerPolicy="no-referrer" allow="fullscreen" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-80 text-center">
                                <FileX size={48} className="text-slate-400 mb-3" />
                                <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                                <div className="flex gap-2">
                                    <a href={fileUrl} download className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs">Download</a>
                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs">Buka Tab Baru</a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="border-t border-slate-100 p-2.5 bg-slate-50 flex justify-end gap-2">
                        <a href={fileUrl} download className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold">Download</a>
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold">Buka Tab Baru</a>
                        <button onClick={onClose} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold">Tutup</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Main Modal Detail */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-violet-700 text-white p-6 rounded-t-3xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <GraduationCap size={24} />
                                    Detail Usulan Diklat
                                </h2>
                                <p className="text-violet-100 text-xs mt-1">
                                    Informasi lengkap pengajuan usulan diklat / pengembangan kompetensi
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl"><X size={20} /></button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sidebar Info */}
                            <div className="md:col-span-1 space-y-4">
                                {/* Foto Profile */}
                                <div className="text-center">
                                    {fotoUrl ? (
                                        <img
                                            src={fotoUrl}
                                            alt={namaLengkap}
                                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-violet-200 shadow-lg"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const fallback = document.createElement('div');
                                                    fallback.className = "w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-violet-200 shadow-lg";
                                                    fallback.textContent = initials;
                                                    parent.appendChild(fallback);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-violet-200 shadow-lg">
                                            {initials}
                                        </div>
                                    )}
                                    <h3 className="font-black text-slate-800 mt-3">{namaLengkap || "Tanpa Nama"}</h3>
                                    <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || "-"}</p>
                                </div>

                                {/* Info Pegawai */}
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User size={14} /> Informasi Pegawai
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-slate-400">Unit Kerja</p>
                                            <p className="font-medium text-slate-700 text-sm">
                                                {data.unit_org_induk_nm || data.unit_kerja || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Tanggal Pengajuan</p>
                                            <p className="font-medium text-slate-700 text-sm">
                                                {formatDateTimeId(data.timestamp || data.tgl_usul)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Info size={14} /> Status Pengajuan
                                    </h4>
                                    <StatusBadge status={status} />
                                    {data.keterangan && (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-[10px] text-slate-400">Keterangan Admin</p>
                                            <p className="text-xs text-slate-600 mt-1">{data.keterangan}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detail Usulan Section */}
                            <div className="md:col-span-2">
                                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                                        <GraduationCap size={16} className="text-violet-600" /> Detail Usulan Diklat
                                    </h4>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-[10px] text-slate-400">Nama Usulan Diklat</p>
                                            <p className="font-medium text-slate-700 text-sm leading-relaxed">{namaUsulan}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dokumen Section */}
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <Paperclip size={16} /> Dokumen Persyaratan
                                    </h4>
                                    <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold">
                                        {availableFiles.length} berkas
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {availableFiles.map((file) => {
                                        const IconComponent = file.icon;
                                        const colorClass = colorMap[file.color] || colorMap.blue;

                                        return (
                                            <div key={file.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-violet-200 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                                        <IconComponent size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-700">{file.label}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{data[file.key]}</p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => window.open(file.url, '_blank')}
                                                                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-all text-[10px] font-medium"
                                                                >
                                                                    <ExternalLink size={10} className="inline mr-1" /> Buka
                                                                </button>
                                                                <button
                                                                    onClick={() => handlePreview(file.url, file.label)}
                                                                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-all text-[10px] font-medium"
                                                                >
                                                                    <Eye size={10} className="inline mr-1" /> Preview
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Berkas Hasil */}
                                {data.file_status_pelayanan && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                                            <FileCheck size={16} className="text-violet-600" /> Berkas Hasil
                                        </h4>
                                        <div className="bg-violet-50 rounded-xl p-3 border border-violet-200">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                                                    <FileCheck size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-700">SK / Surat Keputusan</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{data.file_status_pelayanan}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => window.open(data.file_status_pelayanan_url, '_blank')}
                                                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-all text-[10px] font-medium"
                                                    >
                                                        <ExternalLink size={10} className="inline mr-1" /> Buka
                                                    </button>
                                                    <button
                                                        onClick={() => handlePreview(data.file_status_pelayanan_url, 'SK / Surat Keputusan')}
                                                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-600 transition-all text-[10px] font-medium"
                                                    >
                                                        <Eye size={10} className="inline mr-1" /> Preview
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-3xl flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>

            {/* File Preview Modal */}
            <FilePreviewModal
                isOpen={previewState.isOpen}
                onClose={() => setPreviewState({ isOpen: false, url: '', title: '' })}
                fileUrl={previewState.url}
                fileName={previewState.title}
            />
        </>
    );
};

// Import FileX
import { FileX } from 'lucide-react';

export default DetailModalDiklat;