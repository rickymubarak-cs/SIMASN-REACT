// src/components/cards/CompactCard.tsx
import React, { memo } from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, UserMinus, FileCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface CompactCardProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

// Menggunakan memo untuk optimasi performance
export const CompactCard: React.FC<CompactCardProps> = memo(({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_pemberhentian_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();

    // Hitung jumlah file yang tersedia
    const fileCount = data.file_status_pelayanan ? 1 : 0;

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group">
            <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <UserMinus size={12} />
                            </div>
                            <h4 className="font-semibold text-xs text-slate-800 truncate">
                                {namaLengkap || "Tanpa Nama"}
                            </h4>
                        </div>
                        <p className="text-[9px] font-mono text-slate-400 truncate">
                            {data.peg_nip || "-"}
                        </p>
                    </div>
                    <StatusBadge status={status} size="sm" />
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[9px] text-slate-500">
                        <FileCheck size={8} />
                        <span>{fileCount} berkas</span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={onDetail}
                            className="p-1 hover:bg-slate-100 rounded transition-colors"
                            title="Detail"
                        >
                            <Eye size={12} className="text-slate-500" />
                        </button>
                        {status === "pengajuan" && (
                            <>
                                <button onClick={onPerbaiki} className="p-1 hover:bg-orange-50 rounded" title="Perbaiki">
                                    <Edit size={12} className="text-orange-500" />
                                </button>
                                <button onClick={onTolak} className="p-1 hover:bg-red-50 rounded" title="Tolak">
                                    <Ban size={12} className="text-red-500" />
                                </button>
                                <button onClick={() => onTerima?.(data.layanan_pemberhentian_id, false)} className="p-1 hover:bg-green-50 rounded" title="Terima">
                                    <CheckCircle size={12} className="text-green-500" />
                                </button>
                            </>
                        )}
                        {status === "diterima" && (
                            <button onClick={onUpload} className="p-1 hover:bg-emerald-50 rounded" title="Upload">
                                <Upload size={12} className="text-emerald-500" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

CompactCard.displayName = 'CompactCard';