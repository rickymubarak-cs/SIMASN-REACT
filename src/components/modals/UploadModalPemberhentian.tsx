import React, { useState } from 'react';
import { X, Upload, FileCheck, RefreshCcw, User, UserMinus, Loader } from 'lucide-react';

interface UploadModalPemberhentianProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, file: File) => void;
    data: any;
    isLoading?: boolean;
}

export const UploadModalPemberhentian: React.FC<UploadModalPemberhentianProps> = ({
    isOpen,
    onClose,
    onSubmit,
    data,
    isLoading = false
}) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    if (!isOpen || !data) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) {
            alert("Pilih file terlebih dahulu");
            return;
        }

        if (uploadFile.size > 2 * 1024 * 1024) {
            alert("Ukuran file maksimal 2MB");
            return;
        }

        if (uploadFile.type !== 'application/pdf') {
            alert("Hanya file PDF yang diperbolehkan");
            return;
        }

        try {
            await onSubmit(data.layanan_pemberhentian_id || data.id, uploadFile);
            setUploadFile(null);
            onClose();
        } catch (err) {
            console.error("Upload error:", err);
            // Error sudah ditangani di parent component
        }
    };

    const namaLengkap = [
        data.peg_gelar_depan || "",
        data.peg_nama || "",
        data.peg_gelar_belakang || ""
    ].filter(Boolean).join(" ").trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl animate-fadeIn">
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-6 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Upload size={24} />
                            <h2 className="text-xl font-black">Upload Berkas Hasil Pemberhentian</h2>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-600 mb-2">Nama Pegawai</label>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <User size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                                {namaLengkap || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-600 mb-2">NIP</label>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <UserMinus size={16} className="text-slate-400" />
                            <span className="text-sm font-mono text-slate-700">
                                {data.peg_nip || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-600 mb-2">Berkas Hasil (PDF)</label>
                        <div
                            className={`border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-rose-500 transition-colors cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => !isLoading && document.getElementById('uploadFileInputPemberhentian')?.click()}
                        >
                            <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500">Klik untuk pilih file PDF</p>
                            <p className="text-[9px] text-slate-400">Maksimal 2MB</p>
                            <input
                                id="uploadFileInputPemberhentian"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                disabled={isLoading}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        if (file.size > 2 * 1024 * 1024) {
                                            alert("Ukuran file maksimal 2MB");
                                            return;
                                        }
                                        if (file.type !== 'application/pdf') {
                                            alert("Hanya file PDF yang diperbolehkan");
                                            return;
                                        }
                                        setUploadFile(file);
                                    }
                                }}
                            />
                        </div>
                        {uploadFile && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl flex items-center gap-2">
                                <FileCheck size={16} className="text-green-600" />
                                <span className="text-xs text-green-700 truncate flex-1">{uploadFile.name}</span>
                                <button
                                    onClick={() => setUploadFile(null)}
                                    className="text-red-500 hover:text-red-700"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2">
                            Pastikan berkas yang diupload adalah SK Pemberhentian hasil akhir yang sudah diverifikasi
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !uploadFile}
                            className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                            {isLoading ? "Mengupload..." : "Upload"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadModalPemberhentian;