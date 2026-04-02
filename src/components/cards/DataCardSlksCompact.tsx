// components/cards/DataCardSlksCompact.tsx
import React from 'react';
import { User, Award, Eye, Edit, Ban, CheckCircle, Upload } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface DataCardSlksCompactProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardSlksCompact: React.FC<DataCardSlksCompactProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all group">
            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                            <Award size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-xs text-slate-800 line-clamp-1">
                                {namaLengkap || "Tanpa Nama"}
                            </p>
                            <p className="text-[8px] text-slate-400 font-mono">
                                {data.peg_nip || "-"}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={status} size="sm" />
                </div>

                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={onDetail}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-all"
                    >
                        <Eye size={10} className="inline mr-1" /> Detail
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={onPerbaiki}
                                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Edit size={10} className="inline mr-1" /> Edit
                            </button>
                            <button
                                onClick={onTolak}
                                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Ban size={10} className="inline mr-1" /> Tolak
                            </button>
                            <button
                                onClick={() => onTerima?.(data.slks_id, false)}
                                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                            >
                                <CheckCircle size={10} className="inline mr-1" /> Terima
                            </button>
                        </>
                    )}

                    {status === "diterima" && (
                        <button
                            onClick={onUpload}
                            className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                        >
                            <Upload size={10} className="inline mr-1" /> Upload
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};