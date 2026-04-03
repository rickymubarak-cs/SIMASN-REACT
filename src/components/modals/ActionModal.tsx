// src/components/modals/ActionModal.tsx
import React, { useState } from 'react';
import { Edit, Ban, Send, X, User, Loader, Maximize2, Minimize2 } from 'lucide-react';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, reason: string) => void;
    title: string;
    actionType: 'perbaiki' | 'tolak';
    data: any;
    isLoading?: boolean;
}

export const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    actionType,
    data,
    isLoading = false
}) => {
    const [reason, setReason] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isOpen || !data) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim()) {
            const id = data.layanan_tubel_id || data.slks_id || data.layanan_id ||
                data.layanan_cuti_id || data.layanan_gaji_id || data.layanan_jf_id ||
                data.layanan_pemberhentian_id || data.komp_id || data.layanan_diklat_id ||
                data.layanan_data_id || data.layanan_pltplh_id || data.id;
            onSubmit(id, reason);
            setReason("");
            onClose();
        }
    };

    const bgGradient = actionType === 'perbaiki'
        ? 'from-orange-500 to-orange-600'
        : 'from-red-500 to-red-600';

    const buttonClass = actionType === 'perbaiki'
        ? 'bg-orange-500 hover:bg-orange-600'
        : 'bg-red-500 hover:bg-red-600';

    const placeholder = actionType === 'perbaiki'
        ? 'Masukkan keterangan perbaikan...\n\nContoh:\n1. SK CPNS belum dilampirkan\n2. SK Pangkat Terakhir masih kurang jelas\n3. Surat Pengantar belum ditandatangani atasan'
        : 'Masukkan alasan penolakan...\n\nContoh:\nDokumen persyaratan tidak lengkap dan tidak dapat diproses lebih lanjut.';

    const label = actionType === 'perbaiki'
        ? 'Keterangan Perbaikan'
        : 'Alasan Penolakan';

    const IconComponent = actionType === 'perbaiki' ? Edit : Ban;

    const namaLengkap = [
        data.peg_gelar_depan || "",
        data.peg_nama || "",
        data.peg_gelar_belakang || ""
    ].filter(Boolean).join(" ").trim();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-white rounded-3xl w-full shadow-2xl animate-fadeIn transition-all duration-300 ${isExpanded ? 'max-w-4xl' : 'max-w-md'}`}>
                <div className={`bg-gradient-to-r ${bgGradient} text-white p-6 rounded-t-3xl`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <IconComponent size={24} />
                            <h2 className="text-xl font-black">{title}</h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                title={isExpanded ? "Kecilkan" : "Perbesar"}
                            >
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-600 mb-2">Nama Pegawai</label>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <User size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-700">
                                {namaLengkap || data.peg_nama || data.nama || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-600 mb-2">{label}</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y ${isExpanded ? 'min-h-[300px]' : 'min-h-[150px]'}`}
                            rows={isExpanded ? 12 : 6}
                            placeholder={placeholder}
                            required
                            disabled={isLoading}
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-[10px] text-slate-400">
                                {actionType === 'perbaiki'
                                    ? 'Berikan penjelasan detail mengenai dokumen yang perlu diperbaiki'
                                    : 'Berikan alasan yang jelas mengapa pengajuan ini ditolak'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                                {reason.length} karakter
                            </p>
                        </div>
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
                            disabled={isLoading || !reason.trim()}
                            className={`flex-1 px-4 py-2 text-white rounded-xl text-sm font-bold ${buttonClass} transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                            {isLoading ? "Mengirim..." : "Kirim"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActionModal;