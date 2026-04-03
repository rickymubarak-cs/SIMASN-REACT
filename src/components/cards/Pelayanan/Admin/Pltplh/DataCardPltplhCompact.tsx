// src/components/cards/DataCardPltplhCompact.tsx
import React from 'react';
import { UserCog, Eye, Edit, Ban, CheckCircle, Upload } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';

interface DataCardPltplhCompactProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardPltplhCompact: React.FC<DataCardPltplhCompactProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_pltplh_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisPltplh = data.layanan_pltplh_pengajuan || "-";

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                            <UserCog size={14} className="text-white" />
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

                <div className="text-[9px] text-slate-500 mb-1 line-clamp-1">
                    {data.unit_org_induk_nm || "-"}
                </div>

                <div className="text-[9px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full inline-block mb-2">
                    {jenisPltplh}
                </div>

                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={onDetail}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
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
                                onClick={() => onTerima?.(data.layanan_pltplh_id, false)}
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