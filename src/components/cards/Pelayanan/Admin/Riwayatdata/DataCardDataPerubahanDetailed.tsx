// src/components/cards/DataCardDataPerubahanDetailed.tsx
import React from 'react';
import { Database, Clock, Eye, Edit, Ban, CheckCircle, Upload, Calendar, Building, FileText } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';
import { formatDateTimeId } from '../../../../../utils/formatters';

interface DataCardDataPerubahanDetailedProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardDataPerubahanDetailed: React.FC<DataCardDataPerubahanDetailedProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_data_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisLayanan = data.jenis_layanan_data || "-";
    const ketPerbaikan = data.ket_perbaikan || "-";

    return (
        <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all group">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                            <Database size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-base uppercase group-hover:text-slate-600 transition-colors">
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
                        <Database size={14} className="text-slate-500" />
                        <span>Jenis: {jenisLayanan}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDateTimeId(data.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-slate-500 font-bold">#{index}</span>
                    </div>
                </div>

                {ketPerbaikan !== "-" && (
                    <div className="mb-4 bg-amber-50 rounded-xl p-3 border border-amber-200">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Keterangan Perbaikan</p>
                        <p className="text-xs text-amber-700">{ketPerbaikan}</p>
                    </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                        onClick={onDetail}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800 transition-all flex items-center justify-center gap-2"
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
                                onClick={() => onTerima?.(data.layanan_data_id, false)}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={14} /> Terima
                            </button>
                        </>
                    )}

                    {status === "diterima" && (
                        <button
                            onClick={onUpload}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={14} /> Upload Berkas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};