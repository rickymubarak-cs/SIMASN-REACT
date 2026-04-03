// src/components/modals/UploadModalJf.tsx
import React, { useState } from 'react';
import { X, Upload, FileCheck, RefreshCcw, User, Briefcase, Building, AlertCircle, Award } from 'lucide-react';

interface UploadModalJfProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, file: File) => void;
    data: any;
}

export const UploadModalJf: React.FC<UploadModalJfProps> = ({
    isOpen,
    onClose,
    onSubmit,
    data
}) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !data) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!uploadFile) {
            setError("Pilih file terlebih dahulu");
            return;
        }

        if (uploadFile.size > 2 * 1024 * 1024) {
            setError("Ukuran file maksimal 2MB");
            return;
        }

        if (uploadFile.type !== 'application/pdf') {
            setError("Hanya file PDF yang diperbolehkan");
            return;
        }

        setUploading(true);
        try {
            await onSubmit(data.layanan_jf_id || data.id, uploadFile);
            setUploadFile(null);
            setError(null);
            onClose();
        } catch (err) {
            console.error("Upload error:", err);
            setError("Gagal upload berkas. Silakan coba lagi.");
        } finally {
            setUploading(false);
        }
    };

    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisJf = data.jenis_jf || "-";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl animate-fadeIn">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Upload size={24} />
                            <h2 className="text-xl font-black">Upload Berkas Hasil Jabatan Fungsional</h2>
                        </div>
                        <button onClick={onClose} disabled={uploading} className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
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
                                <Briefcase size={14} className="text-slate-400 flex-shrink-0" />
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

                    <div className="mb-4 bg-indigo-50 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-3">Detail Usulan</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[9px] text-slate-400">Jenis Jabatan Fungsional</p>
                                <p className="text-sm font-bold text-indigo-700">{jenisJf}</p>
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400">Tanggal Pengajuan</p>
                                <p className="text-sm font-bold text-indigo-700">{data.timestamp ? new Date(data.timestamp).toLocaleDateString('id-ID') : "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-600 mb-2">Berkas Hasil (PDF)</label>
                        <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50'}`} onClick={() => document.getElementById('uploadFileInputJf')?.click()}>
                            <Upload size={32} className={`mx-auto mb-2 ${error ? 'text-red-400' : 'text-slate-400'}`} />
                            <p className="text-xs font-medium text-slate-600">Klik untuk pilih file PDF</p>
                            <p className="text-[9px] text-slate-400 mt-1">Maksimal 2MB</p>
                            <input id="uploadFileInputJf" type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) { setError(null); setUploadFile(e.target.files[0]); } }} />
                        </div>
                        {uploadFile && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center gap-2 border border-green-200">
                                <FileCheck size={16} className="text-green-600 flex-shrink-0" />
                                <span className="text-xs text-green-700 truncate flex-1">{uploadFile.name}</span>
                                <button onClick={() => { setUploadFile(null); setError(null); }} className="text-red-500 hover:text-red-700 transition-colors" type="button"><X size={14} /></button>
                            </div>
                        )}
                        {error && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg flex items-center gap-2">
                                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                                <p className="text-[10px] text-red-600">{error}</p>
                            </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-3">
                            Pastikan berkas yang diupload adalah SK Jabatan Fungsional hasil akhir yang sudah diverifikasi dan ditandatangani.
                        </p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} disabled={uploading} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50">Batal</button>
                        <button type="submit" disabled={uploading || !uploadFile} className="flex-1 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {uploading ? <RefreshCcw size={14} className="animate-spin" /> : <Upload size={14} />}
                            {uploading ? "Mengupload..." : "Upload Berkas"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModalJf;