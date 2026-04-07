import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, FileCheck, RefreshCcw, User, TrendingUp, Building, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UploadModalPangkatProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, file: File) => void;
    onEdit?: (id: string, oldFile: string, newFile: File) => void;
    data: any;
    mode?: 'upload' | 'edit';
}

export const UploadModalPangkat: React.FC<UploadModalPangkatProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onEdit,
    data,
    mode = 'upload'
}) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setUploadFile(null);
            setError(null);
            setUploading(false);
            setIsDragOver(false);
        }
    }, [isOpen]);

    if (!isOpen || !data) return null;

    const handleFileSelect = (file: File) => {
        setError(null);

        if (file.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB");
            return false;
        }

        if (file.type !== 'application/pdf') {
            setError("Hanya file PDF yang diperbolehkan");
            return false;
        }

        setUploadFile(file);
        return true;
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            handleFileSelect(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!uploadFile) {
            setError("Pilih file terlebih dahulu");
            return;
        }

        if (uploadFile.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB");
            return;
        }

        if (uploadFile.type !== 'application/pdf') {
            setError("Hanya file PDF yang diperbolehkan");
            return;
        }

        setUploading(true);
        const loadingToast = toast.loading(mode === 'edit' ? 'Mengganti berkas...' : 'Mengupload berkas...');

        try {
            if (mode === 'edit' && onEdit) {
                const oldFileName = data.file_status_pelayanan;
                if (!oldFileName) {
                    throw new Error('Nama file lama tidak ditemukan');
                }
                await onEdit(data.layanan_id || data.id, oldFileName, uploadFile);
                toast.success('Berkas berhasil diganti!', { id: loadingToast });
            } else {
                await onSubmit(data.layanan_id || data.id, uploadFile);
                toast.success('Berkas berhasil diupload!', { id: loadingToast });
            }
            setUploadFile(null);
            setError(null);
            onClose();
        } catch (err) {
            console.error("Upload error:", err);
            toast.error('Gagal upload berkas. Silakan coba lagi.', { id: loadingToast });
            setError("Gagal upload berkas. Silakan coba lagi.");
        } finally {
            setUploading(false);
        }
    };

    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisKp = data.lay_kp_jenis || "-";
    const golongan = data.gol_id || "-";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Tambahkan max-h-[90vh] dan flex flex-col */}
            <div className="relative bg-white rounded-3xl max-w-md w-full max-h-[90vh] shadow-2xl flex flex-col" style={{ animation: 'fadeIn 0.2s ease-out' }}>

                {/* Header - Fixed */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-3xl flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Upload size={24} />
                            <h2 className="text-xl font-black">
                                {mode === 'edit' ? 'Ganti Berkas Hasil Kenaikan Pangkat' : 'Upload Berkas Hasil Kenaikan Pangkat'}
                            </h2>
                        </div>
                        {mode === 'edit' && (
                            <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">Edit Mode</span>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Form Content - Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                    {/* Informasi Pegawai */}
                    <div className="mb-4 bg-slate-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Informasi Pegawai</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User size={14} className="text-slate-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[9px] text-slate-400">Nama Lengkap</p>
                                    <p className="text-sm font-medium text-slate-700">{namaLengkap || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <TrendingUp size={14} className="text-slate-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[9px] text-slate-400">NIP</p>
                                    <p className="text-sm font-mono text-slate-700">{data.peg_nip || "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Building size={14} className="text-slate-400 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-[9px] text-slate-400">Unit Kerja</p>
                                    <p className="text-sm text-slate-700 line-clamp-1">{data.unit_org_induk_nm || "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Usulan */}
                    <div className="mb-4 bg-purple-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-3">Detail Usulan</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[9px] text-slate-400">Jenis Kenaikan Pangkat</p>
                                <p className="text-sm font-bold text-purple-700">{jenisKp}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400">Golongan Ruang</p>
                                <p className="text-sm font-bold text-purple-700">{golongan}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400">Tanggal Pengajuan</p>
                                <p className="text-sm font-bold text-purple-700">{data.layanan_tgl ? new Date(data.layanan_tgl).toLocaleDateString('id-ID') : "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Berkas Saat Ini (Edit Mode) */}
                    {mode === 'edit' && data.file_status_pelayanan && (
                        <div className="mb-4 bg-amber-50 rounded-xl p-3 border border-amber-200">
                            <p className="text-[10px] font-bold text-amber-600 mb-1">Berkas Saat Ini</p>
                            <p className="text-xs text-amber-700 font-mono break-all">{data.file_status_pelayanan}</p>
                        </div>
                    )}

                    {/* Upload Area */}
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-600 mb-2">
                            {mode === 'edit' ? 'Berkas Baru (PDF)' : 'Berkas Hasil (PDF)'}
                        </label>
                        <div
                            className={`
                        border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer
                        ${error ? 'border-red-300 bg-red-50' : ''}
                        ${isDragOver
                                    ? 'border-purple-500 bg-purple-100'
                                    : 'border-slate-200 hover:border-purple-500 bg-slate-50 hover:bg-purple-50'
                                }
                    `}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {isDragOver ? (
                                <div className="animate-bounce">
                                    <Upload size={32} className="mx-auto mb-2 text-purple-500" />
                                    <p className="text-xs font-medium text-purple-600">
                                        Lepaskan file di sini
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} className={`mx-auto mb-2 ${error ? 'text-red-400' : 'text-slate-400'}`} />
                                    <p className="text-xs font-medium text-slate-600">
                                        Drag & Drop file PDF di sini
                                    </p>
                                    <p className="text-[9px] text-slate-400 mt-1">
                                        atau klik untuk pilih file
                                    </p>
                                </>
                            )}
                            <p className="text-[9px] text-slate-400 mt-2">
                                Maksimal 2MB
                            </p>
                            <input
                                ref={fileInputRef}
                                id="uploadFileInputPangkat"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileSelect(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>

                        {/* File Preview */}
                        {uploadFile && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center gap-2 border border-green-200">
                                <FileCheck size={16} className="text-green-600 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-green-700 truncate">{uploadFile.name}</p>
                                    <p className="text-[9px] text-green-500">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setUploadFile(null);
                                        setError(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    type="button"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2" style={{ animation: 'shake 0.3s ease-in-out' }}>
                                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                                <p className="text-[10px] text-red-600">{error}</p>
                            </div>
                        )}

                        <p className="text-[10px] text-slate-400 mt-3">
                            {mode === 'edit'
                                ? 'Upload file PDF baru untuk menggantikan berkas yang lama'
                                : 'Pastikan berkas yang diupload adalah SK Kenaikan Pangkat hasil akhir yang sudah diverifikasi'
                            }
                        </p>
                    </div>

                    {/* Buttons - Fixed di Bottom dalam scroll area, tapi tetap terlihat */}
                    <div className="flex gap-3 pt-2 pb-1 sticky bottom-0 bg-white">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !uploadFile}
                            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-bold hover:bg-purple-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? <RefreshCcw size={14} className="animate-spin" /> : <Upload size={14} />}
                            {uploading ? "Mengupload..." : (mode === 'edit' ? "Ganti Berkas" : "Upload")}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `}</style>
        </div>
    );
};

export default UploadModalPangkat;