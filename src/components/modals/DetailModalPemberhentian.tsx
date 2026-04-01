import React, { useState } from 'react';
import {
    X, User, Building, Paperclip, FileCheck, Clock, Info, UserMinus, ChevronDown, ChevronUp,
    Mail, FileSignature, IdCard, Award, Wallet, Briefcase, Gavel, Scale, Camera, Baby,
    GraduationCap, Users, Heart, CreditCard, Cross, MapPin, File, CheckCircle,
    Eye, ExternalLink, FileX, Loader
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId, getInitials } from '../../utils/formatters';
import { pemberhentianFileConfig } from '../../service/pemberhentianService';

interface DetailModalPemberhentianProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

// Map icon untuk file
const fileIconMap: Record<string, any> = {
    FileSignature: FileSignature,
    IdCard: IdCard,
    FileCertificate: FileCheck,
    Award: Award,
    Wallet: Wallet,
    FileCheck: FileCheck,
    Briefcase: Briefcase,
    UserMinus: UserMinus,
    Calendar: Clock,
    Gavel: Gavel,
    Scale: Scale,
    Camera: Camera,
    Baby: Baby,
    GraduationCap: GraduationCap,
    Users: Users,
    Heart: Heart,
    CreditCard: CreditCard,
    Cross: Cross,
    FileText: File,
    MapPin: MapPin,
    File: File,
    CheckCircle: CheckCircle,
    Mail: Mail
};

// Map warna untuk badge
const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200'
};

export const DetailModalPemberhentian: React.FC<DetailModalPemberhentianProps> = ({
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
    const [imageError, setImageError] = useState(false);

    if (!isOpen || !data) return null;

    const fotoUrl = data.foto_url;
    const namaLengkap = [
        data.peg_gelar_depan || "",
        data.peg_nama || "",
        data.peg_gelar_belakang || ""
    ].filter(Boolean).join(" ").trim();
    const initials = getInitials(namaLengkap);
    const status = data.layanan_pemberhentian_status || "pengajuan";
    const jenisPemberhentian = data.jenis_pemberhentian || "Pemberhentian ASN";

    const availableFiles = pemberhentianFileConfig
        .filter(fileConfig => data[fileConfig.key] && data[fileConfig.key].trim() !== "")
        .map(fileConfig => ({
            ...fileConfig,
            url: data[`${fileConfig.key}_url`],
            icon: fileIconMap[fileConfig.icon] || File
        }));

    const visibleFiles = showAllFiles ? availableFiles : availableFiles.slice(0, 6);
    const hasMoreFiles = availableFiles.length > 6;

    const handlePreview = (url: string, title: string) => {
        if (url) {
            setPreviewState({ isOpen: true, url, title });
        }
    };

    // Komponen Preview Modal yang Dioptimalkan
    const FilePreviewModal = ({ isOpen, onClose, fileUrl, fileName }: { isOpen: boolean; onClose: () => void; fileUrl: string; fileName: string }) => {
        const [loadError, setLoadError] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        if (!isOpen) return null;

        const fileExt = fileUrl.split('.').pop()?.toLowerCase() || '';
        const isPdf = fileExt === 'pdf';
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

        // Gunakan URL langsung tanpa Google Viewer untuk PDF (lebih cepat)
        const directPdfUrl = fileUrl;
        const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

        const handleLoad = () => {
            setIsLoading(false);
        };

        const handleError = () => {
            setIsLoading(false);
            setLoadError(true);
        };

        // Preload file saat modal dibuka
        React.useEffect(() => {
            if (isOpen && fileUrl) {
                // Preload untuk image
                if (isImage) {
                    const img = new Image();
                    img.src = fileUrl;
                }
                // Preload untuk PDF
                if (isPdf) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = fileUrl;
                    document.head.appendChild(link);

                    return () => {
                        document.head.removeChild(link);
                    };
                }
            }
        }, [isOpen, fileUrl, isImage, isPdf]);

        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-4 flex justify-between items-center">
                        <h3 className="font-bold text-sm truncate flex-1">
                            <Eye size={14} className="inline mr-2" />
                            {fileName}
                        </h3>
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-3 bg-slate-100 min-h-[400px] max-h-[calc(85vh-100px)] overflow-auto relative">
                        {isLoading && !loadError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
                                <Loader size={40} className="animate-spin text-rose-600 mb-3" />
                                <p className="text-slate-500 text-sm">Memuat dokumen...</p>
                            </div>
                        )}

                        {loadError ? (
                            <div className="flex flex-col items-center justify-center h-80 text-center">
                                <FileX size={48} className="text-slate-400 mb-3" />
                                <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                                <div className="flex gap-2">
                                    <a
                                        href={fileUrl}
                                        download
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors"
                                    >
                                        Download
                                    </a>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Buka Tab Baru
                                    </a>
                                </div>
                            </div>
                        ) : isImage ? (
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className={`max-w-full max-h-[65vh] mx-auto rounded-lg shadow-sm transition-opacity duration-150 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                onLoad={handleLoad}
                                onError={handleError}
                                loading="eager"
                            />
                        ) : isPdf ? (
                            <iframe
                                src={directPdfUrl}
                                className={`w-full h-[65vh] rounded-lg border-0 transition-opacity duration-150 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                                title={fileName}
                                onLoad={handleLoad}
                                onError={handleError}
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                referrerPolicy="no-referrer"
                                allow="fullscreen"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-80 text-center">
                                <FileX size={48} className="text-slate-400 mb-3" />
                                <p className="text-slate-600 mb-2">Preview tidak tersedia untuk format file ini</p>
                                <div className="flex gap-2">
                                    <a
                                        href={fileUrl}
                                        download
                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors"
                                    >
                                        Download
                                    </a>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                                    >
                                        Buka Tab Baru
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 p-2.5 bg-slate-50 flex justify-end gap-2">
                        <a
                            href={fileUrl}
                            download
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-200 transition-colors"
                        >
                            Download
                        </a>
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors"
                        >
                            Buka Tab Baru
                        </a>
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-colors"
                        >
                            Tutup
                        </button>
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
                    <div className="sticky top-0 bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 rounded-t-3xl z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-black flex items-center gap-2">
                                    <UserMinus size={24} />
                                    Detail Pemberhentian ASN
                                </h2>
                                <p className="text-rose-100 text-xs mt-1">
                                    Informasi lengkap pengajuan pemberhentian ASN
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body - sama seperti sebelumnya */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sidebar Info */}
                            <div className="md:col-span-1 space-y-4">
                                <div className="text-center">
                                    {fotoUrl && !imageError ? (
                                        <img
                                            src={fotoUrl}
                                            alt={namaLengkap}
                                            className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-rose-200 shadow-lg"
                                            onError={(e) => {
                                                console.error('Gagal memuat foto dari URL:', fotoUrl);
                                                setImageError(true);
                                                e.currentTarget.style.display = "none";
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                    const fallback = document.createElement('div');
                                                    fallback.className = "w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-rose-200 shadow-lg";
                                                    fallback.textContent = initials;
                                                    parent.appendChild(fallback);
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-rose-200 shadow-lg">
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
                                        <div>
                                            <p className="text-[10px] text-slate-400">Unit Kerja</p>
                                            <p className="font-medium text-slate-700 text-sm break-words">
                                                {data.unit_org_induk_nm || data.unit_kerja || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400">Jenis Pemberhentian</p>
                                            <p className="font-medium text-slate-700 text-sm">
                                                {jenisPemberhentian}
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

                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Info size={14} /> Status Pengajuan
                                    </h4>
                                    <StatusBadge status={status} />
                                    {data.keterangan && (
                                        <div className="mt-3 pt-3 border-t border-slate-200">
                                            <p className="text-[10px] text-slate-400">Keterangan Admin</p>
                                            <p className="text-xs text-slate-600 whitespace-pre-wrap mt-1">{data.keterangan}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dokumen Section */}
                            <div className="md:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <Paperclip size={16} /> Dokumen Persyaratan
                                    </h4>
                                    <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold">
                                        {availableFiles.length} berkas
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {visibleFiles.map((file) => {
                                        const IconComponent = file.icon;
                                        const colorClass = colorMap[file.color] || colorMap.gray;

                                        return (
                                            <div key={file.key} className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-rose-200 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${colorClass}`}>
                                                        <IconComponent size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-700">{file.label}</p>
                                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[200px]">{data[file.key]}</p>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => file.url && window.open(file.url, '_blank')}
                                                                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-all text-[10px] font-medium"
                                                                >
                                                                    <ExternalLink size={10} className="inline mr-1" /> Buka
                                                                </button>
                                                                <button
                                                                    onClick={() => file.url && handlePreview(file.url, file.label)}
                                                                    className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-all text-[10px] font-medium"
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

                                {hasMoreFiles && (
                                    <button
                                        onClick={() => setShowAllFiles(!showAllFiles)}
                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                                    >
                                        {showAllFiles ? (
                                            <>
                                                <ChevronUp size={14} />
                                                Sembunyikan Berkas
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown size={14} />
                                                Tampilkan {availableFiles.length - 6} Berkas Lainnya
                                            </>
                                        )}
                                    </button>
                                )}

                                {data.file_status_pelayanan && data.file_status_pelayanan_url && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                                            <FileCheck size={16} className="text-rose-600" /> Berkas Hasil
                                        </h4>
                                        <div className="bg-rose-50 rounded-xl p-3 border border-rose-200">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                                                    <FileCheck size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-slate-700">SK Pemberhentian</p>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{data.file_status_pelayanan}</p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => window.open(data.file_status_pelayanan_url, '_blank')}
                                                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-all text-[10px] font-medium"
                                                    >
                                                        <ExternalLink size={10} className="inline mr-1" /> Buka
                                                    </button>
                                                    <button
                                                        onClick={() => handlePreview(data.file_status_pelayanan_url, 'SK Pemberhentian')}
                                                        className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-600 transition-all text-[10px] font-medium"
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

            <FilePreviewModal
                isOpen={previewState.isOpen}
                onClose={() => setPreviewState({ isOpen: false, url: '', title: '' })}
                fileUrl={previewState.url}
                fileName={previewState.title}
            />
        </>
    );
};

export default DetailModalPemberhentian;