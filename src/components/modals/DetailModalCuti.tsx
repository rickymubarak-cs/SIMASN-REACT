import React, { useState } from 'react';
import {
    X, User, Building, Paperclip, FileCheck, Clock, Info, Coffee, ChevronDown, ChevronUp,
    FileText, File, FileImage, FileSignature, Plane, MapPin, Stethoscope, Hospital,
    Cross, Heart, Baby, Users, IdCard, Calendar, Award, FileArchive,
    Mail, Eye, ExternalLink, Landmark
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId, getInitials } from '../../utils/formatters';

// Komponen Preview Modal Internal
const FilePreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
}> = ({ isOpen, onClose, fileUrl, fileName }) => {
    const [loadError, setLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!isOpen) return null;

    const fileExt = fileUrl.split('.').pop()?.toLowerCase() || '';
    const isPdf = fileExt === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setLoadError(true);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-sm truncate flex-1">
                        <Eye size={14} className="inline mr-2" />
                        {fileName}
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-3 bg-slate-100 min-h-[400px] max-h-[calc(85vh-100px)] overflow-auto relative">
                    {isLoading && !loadError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-slate-500 text-sm font-medium">Memuat dokumen...</p>
                        </div>
                    )}

                    {loadError ? (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <FileX size={48} className="text-slate-400 mb-3" />
                            <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                            <div className="flex gap-2">
                                <a href={fileUrl} download className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700">
                                    Download File
                                </a>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                    Buka Tab Baru
                                </a>
                            </div>
                        </div>
                    ) : isImage ? (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className={`max-w-full max-h-[65vh] mx-auto rounded-lg shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleLoad}
                            onError={handleError}
                            style={{ opacity: isLoading ? 0 : 1 }}
                        />
                    ) : isPdf ? (
                        <iframe
                            src={googleViewerUrl}
                            className={`w-full h-[65vh] rounded-lg border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            title={fileName}
                            onLoad={handleLoad}
                            onError={handleError}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            referrerPolicy="no-referrer"
                            allow="fullscreen"
                            style={{ opacity: isLoading ? 0 : 1 }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <FileX size={48} className="text-slate-400 mb-3" />
                            <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                            <p className="text-slate-400 text-xs mb-4">Format file {fileExt.toUpperCase()} tidak dapat dipreview</p>
                            <div className="flex gap-2">
                                <a href={fileUrl} download className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700">
                                    Download File
                                </a>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                                    Buka Tab Baru
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 p-2.5 bg-slate-50 flex justify-end gap-2">
                    <a href={fileUrl} download className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-200">
                        Download
                    </a>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50">
                        Buka Tab Baru
                    </a>
                    <button onClick={onClose} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// Import FileX untuk error state
import { FileX } from 'lucide-react';

interface DetailModalCutiProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const BASE_URL_FOTO = "https://simasn.pontianak.go.id/assets/berkas/profil/";
const BASE_URL_BERKAS = "https://simasn.pontianak.go.id/assets/berkas/Layanan/Cuti/";

// Konfigurasi file labels berdasarkan jenis cuti (sama seperti sebelumnya)
const fileLabelsByJenisCuti: Record<string, Record<string, { label: string; icon: any; color: string }>> = {
    'TAHUNAN': {
        'file_a': { label: 'Form Cuti Tahunan', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Foto Copy Tiket/Passport', icon: Plane, color: 'cyan' },
        'file_c': { label: 'Surat Keterangan Biro Perjalanan', icon: MapPin, color: 'orange' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'SAKIT': {
        'file_a': { label: 'Form Cuti Sakit', icon: FileText, color: 'blue' },
        'file_b': { label: 'Surat Keterangan Sakit', icon: Stethoscope, color: 'red' },
        'file_c': { label: 'Surat Keterangan Rawat Inap', icon: Hospital, color: 'orange' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'ALASAN PENTING': {
        'file_a': { label: 'Form Cuti Alasan Penting', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Surat Keterangan Rumah Sakit', icon: Hospital, color: 'red' },
        'file_c': { label: 'Surat Keterangan/Akte Kematian', icon: Cross, color: 'gray' },
        'file_d': { label: 'Undangan Perkawinan', icon: Heart, color: 'pink' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'BESAR': {
        'file_a': { label: 'Form Cuti Besar', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Surat Keterangan Biro Perjalanan (Haji)', icon: Landmark, color: 'purple' },
        'file_c': { label: 'Surat Keterangan Bersalin', icon: Baby, color: 'pink' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'MELAHIRKAN': {
        'file_a': { label: 'Form Cuti Melahirkan', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Surat Keterangan Bersalin', icon: Baby, color: 'pink' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'CLTN AWAL': {
        'file_a': { label: 'Surat Usulan CLTN dari PD', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Surat Usulan CLTN dari YBS', icon: User, color: 'indigo' },
        'file_c': { label: 'Surat Pernyataan Tidak Menuntut', icon: FileText, color: 'orange' },
        'file_d': { label: 'Surat Pernyataan Suami/Isteri', icon: Users, color: 'green' },
        'file_e': { label: 'SK Suami/Isteri (Asli)', icon: FileCheck, color: 'red' },
        'file_f': { label: 'FC. SK CPNS', icon: FileCheck, color: 'blue' },
        'file_g': { label: 'FC. SK PNS', icon: FileCheck, color: 'cyan' },
        'file_h': { label: 'FC. SK Pangkat Terakhir', icon: Award, color: 'orange' },
        'file_i': { label: 'FC. SK Berkala Terakhir', icon: Clock, color: 'green' },
        'file_j': { label: 'FC. Karpeg', icon: IdCard, color: 'red' },
        'file_k': { label: 'FC. Buku Nikah (Legalisir)', icon: Heart, color: 'pink' },
        'file_l': { label: 'FC. KTP (Legalisir)', icon: IdCard, color: 'blue' },
        'file_m': { label: 'FC. KK (Legalisir)', icon: Users, color: 'cyan' },
        'file_n': { label: 'FC. SKP 2 Tahun Terakhir', icon: Calendar, color: 'orange' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'CLTN PERPANJANGAN': {
        'file_a': { label: 'Surat Usulan CLTN dari PD', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'Surat Usulan CLTN dari YBS', icon: User, color: 'indigo' },
        'file_c': { label: 'SK Suami/Isteri', icon: FileCheck, color: 'orange' },
        'file_d': { label: 'FC. SK CLTN Pertama', icon: FileArchive, color: 'green' },
        'file_e': { label: 'FC. Persetujuan Teknis CLTN', icon: FileCheck, color: 'red' },
        'file_f': { label: 'FC. SK CPNS', icon: FileCheck, color: 'blue' },
        'file_g': { label: 'FC. SK PNS', icon: FileCheck, color: 'cyan' },
        'file_h': { label: 'FC. SK Pangkat Terakhir', icon: Award, color: 'orange' },
        'file_i': { label: 'FC. SK Berkala Terakhir', icon: Clock, color: 'green' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    },
    'CLTN PENGAKTIFAN': {
        'file_a': { label: 'Surat Keterangan dari PNS', icon: FileSignature, color: 'blue' },
        'file_b': { label: 'FC. SK CLTN', icon: FileArchive, color: 'cyan' },
        'file_c': { label: 'FC. Persetujuan Teknis CLTN', icon: FileCheck, color: 'orange' },
        'file_d': { label: 'FC. SK Pangkat Terakhir', icon: Award, color: 'green' },
        'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
    }
};

// Default file labels
const defaultFileLabels: Record<string, { label: string; icon: any; color: string }> = {
    'file_a': { label: 'Berkas A', icon: FileText, color: 'gray' },
    'file_b': { label: 'Berkas B', icon: FileText, color: 'gray' },
    'file_c': { label: 'Berkas C', icon: FileText, color: 'gray' },
    'file_d': { label: 'Berkas D', icon: FileText, color: 'gray' },
    'file_e': { label: 'Berkas E', icon: FileText, color: 'gray' },
    'file_f': { label: 'Berkas F', icon: FileText, color: 'gray' },
    'file_g': { label: 'Berkas G', icon: FileText, color: 'gray' },
    'file_h': { label: 'Berkas H', icon: FileText, color: 'gray' },
    'file_i': { label: 'Berkas I', icon: FileText, color: 'gray' },
    'file_j': { label: 'Berkas J', icon: FileText, color: 'gray' },
    'file_k': { label: 'Berkas K', icon: FileText, color: 'gray' },
    'file_l': { label: 'Berkas L', icon: FileText, color: 'gray' },
    'file_m': { label: 'Berkas M', icon: FileText, color: 'gray' },
    'file_n': { label: 'Berkas N', icon: FileText, color: 'gray' },
    'file_pengantar': { label: 'Surat Pengantar', icon: Mail, color: 'green' }
};

// Order file untuk ditampilkan
const fileOrder = ['file_a', 'file_b', 'file_c', 'file_d', 'file_e', 'file_f', 'file_g', 'file_h', 'file_i', 'file_j', 'file_k', 'file_l', 'file_m', 'file_n', 'file_pengantar'];

// Map warna untuk badge
const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
};

export const DetailModalCuti: React.FC<DetailModalCutiProps> = ({
    isOpen,
    onClose,
    data
}) => {
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [previewState, setPreviewState] = useState<{ isOpen: boolean; url: string; title: string }>({
        isOpen: false,
        url: '',
        title: ''
    });

    if (!isOpen || !data) return null;

    const fotoUrl = data.foto_url || (data.foto ? `${BASE_URL_FOTO}${data.foto}` : null);
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const initials = getInitials(namaLengkap);
    const status = data.layanan_cuti_status || "pengajuan";
    const jenisCuti = data.jenis_cuti || "CUTI";

    // Detail cuti berdasarkan jenis
    const cutiDetail = data.cTahunan_dalamLuar === 'luar' ? 'Cuti Luar Tanggungan Negara' :
        data.cTahunan_dalamLuar === 'dalam' ? 'Cuti Dalam Tanggungan Negara' : '';
    const cutiSakitDetail = data.cSakit_InapJalan === 'inap' ? 'Rawat Inap' :
        data.cSakit_InapJalan === 'jalan' ? 'Rawat Jalan' : '';
    const cutiAlasanPentingDetail = data.cAP_kategori || '';
    const cutiBesarDetail = data.cBESAR_kategori || '';

    // Ambil konfigurasi file berdasarkan jenis cuti
    const fileLabels = fileLabelsByJenisCuti[jenisCuti] || defaultFileLabels;

    // Filter file yang tersedia
    const availableFiles = fileOrder
        .filter(key => data[key] && data[key].trim() !== "")
        .map(key => ({
            key,
            ...fileLabels[key] || defaultFileLabels[key] || { label: key.replace('file_', '').toUpperCase(), icon: FileText, color: 'gray' },
            url: data[`${key}_url`] || `${BASE_URL_BERKAS}${data[key]}`
        }));

    const visibleFiles = showAllFiles ? availableFiles : availableFiles.slice(0, 6);
    const hasMoreFiles = availableFiles.length > 6;

    const handlePreview = (url: string, title: string) => {
        setPreviewState({ isOpen: true, url, title });
    };

    const getDetailInfo = () => {
        if (jenisCuti === 'TAHUNAN' && cutiDetail) return cutiDetail;
        if (jenisCuti === 'SAKIT' && cutiSakitDetail) return cutiSakitDetail;
        if (jenisCuti === 'ALASAN PENTING' && cutiAlasanPentingDetail) return cutiAlasanPentingDetail;
        if (jenisCuti === 'BESAR' && cutiBesarDetail) return cutiBesarDetail;
        return null;
    };

    const detailInfo = getDetailInfo();

    return (
        <>
            {/* Main Modal Detail */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'visible' : 'invisible'}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-t-3xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <Coffee size={24} />
                                    Detail Cuti Pegawai
                                </h2>
                                <p className="text-amber-100 text-xs mt-1">
                                    Informasi lengkap pengajuan cuti pegawai
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sidebar Info - sama seperti sebelumnya */}
                            <div className="md:col-span-1 space-y-4">
                                <div className="text-center">
                                    {fotoUrl ? (
                                        <img src={fotoUrl} alt={namaLengkap} className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-amber-200 shadow-lg" />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-amber-200 shadow-lg">
                                            {initials}
                                        </div>
                                    )}
                                    <h3 className="font-black text-slate-800 mt-3">{namaLengkap || "Tanpa Nama"}</h3>
                                    <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || "-"}</p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User size={14} /> Informasi Pegawai
                                    </h4>
                                    <div className="space-y-3">
                                        <div><p className="text-[10px] text-slate-400">Unit Kerja</p><p className="font-medium text-slate-700 text-sm">{data.unit_org_induk_nm || "-"}</p></div>
                                        <div><p className="text-[10px] text-slate-400">Jenis Cuti</p><p className="font-medium text-slate-700 text-sm">{jenisCuti.replace(/_/g, ' ')}</p></div>
                                        {detailInfo && <div><p className="text-[10px] text-slate-400">Keterangan Cuti</p><p className="font-medium text-slate-700 text-sm">{detailInfo}</p></div>}
                                        <div><p className="text-[10px] text-slate-400">Tanggal Pengajuan</p><p className="font-medium text-slate-700 text-sm">{formatDateTimeId(data.timestamp)}</p></div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Info size={14} /> Status Pengajuan
                                    </h4>
                                    <StatusBadge status={status} />
                                    {data.keterangan && <div className="mt-3 pt-3 border-t border-slate-200"><p className="text-xs text-slate-600">{data.keterangan}</p></div>}
                                </div>
                            </div>

                            {/* Dokumen Section */}
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2"><Paperclip size={16} /> Dokumen Persyaratan</h4>
                                    <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold">{availableFiles.length} berkas</span>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {visibleFiles.map((file) => {
                                        const IconComponent = file.icon || FileText;
                                        const colorClass = colorMap[file.color] || colorMap.gray;

                                        return (
                                            <div key={file.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-amber-200 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${colorClass}`}><IconComponent size={16} /></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-700">{file.label}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{data[file.key]}</p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button onClick={() => window.open(file.url, '_blank')} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all text-[10px] font-medium">
                                                                    <ExternalLink size={10} className="inline mr-1" /> Buka
                                                                </button>
                                                                <button onClick={() => handlePreview(file.url, file.label)} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all text-[10px] font-medium">
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

                                {hasMoreFiles && (
                                    <button onClick={() => setShowAllFiles(!showAllFiles)} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                                        {showAllFiles ? <><ChevronUp size={14} /> Sembunyikan Berkas</> : <><ChevronDown size={14} /> Tampilkan {availableFiles.length - 6} Berkas Lainnya</>}
                                    </button>
                                )}

                                {data.file_status_pelayanan && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3"><FileCheck size={16} className="text-amber-600" /> Berkas Hasil</h4>
                                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-amber-100 text-amber-700"><FileCheck size={16} /></div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-700">SK Cuti / Surat Keputusan</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{data.file_status_pelayanan}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => window.open(data.file_status_pelayanan_url, '_blank')} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all text-[10px] font-medium">
                                                        <ExternalLink size={10} className="inline mr-1" /> Buka
                                                    </button>
                                                    <button onClick={() => handlePreview(data.file_status_pelayanan_url, 'SK Cuti / Surat Keputusan')} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-all text-[10px] font-medium">
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
                        <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50">Tutup</button>
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

export default DetailModalCuti;