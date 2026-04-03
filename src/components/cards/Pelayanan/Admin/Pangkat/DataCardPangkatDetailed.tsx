// src/components/cards/DataCardPangkatDetailed.tsx
import React from 'react';
import { TrendingUp, Clock, Eye, Edit, Ban, CheckCircle, Upload, Calendar, Building, Award } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';
import { formatDateTimeId } from '../../../../../utils/formatters';

interface DataCardPangkatDetailedProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardPangkatDetailed: React.FC<DataCardPangkatDetailedProps> = ({
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
    const jenisKp = data.lay_kp_jenis || "-";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all group">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                            <TrendingUp size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-base uppercase group-hover:text-purple-600 transition-colors">
                                {namaLengkap || "Tanpa Nama"}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || "-"}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        <span className="truncate">{data.unit_org_induk_nm || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Award size={14} className="text-purple-500" />
                        <span>Jenis: {jenisKp}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDateTimeId(data.layanan_tgl || data.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-purple-500 font-bold">#{index}</span>
                    </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                        onClick={onDetail}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail Lengkap
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={onPerbaiki}
                                className="py-2 px-4 rounded-xl text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={onTolak}
                                className="py-2 px-4 rounded-xl text-xs font-bold bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Ban size={14} />
                            </button>
                            <button
                                onClick={() => onTerima?.(data.layanan_id, false)}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={14} /> Terima
                            </button>
                        </>
                    )}

                    {status === "diterima" && (
                        <button
                            onClick={onUpload}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={14} /> Upload Berkas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};