// src/components/cards/StandardCard.tsx
import React from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, UserMinus, Clock, FileCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';
import { pemberhentianFileConfig } from '../../service/pemberhentianService';

interface StandardCardProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const StandardCard: React.FC<StandardCardProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_pemberhentian_status || "pengajuan";
    const namaLengkap = [data.peg_gelar_depan, data.peg_nama, data.peg_gelar_belakang]
        .filter(Boolean).join(" ").trim();
    const jenisPemberhentian = data.jenis_pemberhentian || "Pemberhentian ASN";

    const availableFiles = pemberhentianFileConfig.filter(
        fileConfig => data[fileConfig.key] && data[fileConfig.key].trim() !== ""
    ).length;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col overflow-hidden">
            <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                        <UserMinus size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                            #{index}
                        </span>
                        <StatusBadge status={status} size="sm" />
                    </div>
                </div>

                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 line-clamp-2">
                    {namaLengkap || "Tanpa Nama"}
                </h3>
                <p className="text-[10px] font-mono text-slate-500 mb-2">NIP. {data.peg_nip || "-"}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full">
                        {jenisPemberhentian}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {availableFiles} berkas
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-slate-100 pt-3 mt-2">
                    <Clock size={10} />
                    <span>{formatDateTimeId(data.timestamp || data.tgl_usul)}</span>
                </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-100">
                <div className="flex gap-1.5 flex-wrap">
                    <button onClick={onDetail} className="flex-1 px-2 py-1.5 text-[10px] font-medium bg-white border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all">
                        <Eye size={12} className="inline mr-1" /> Detail
                    </button>
                    {status === "pengajuan" && (
                        <>
                            <button onClick={onPerbaiki} className="flex-1 px-2 py-1.5 text-[10px] font-medium bg-white border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white">
                                <Edit size={12} className="inline mr-1" /> Perbaiki
                            </button>
                            <button onClick={onTolak} className="flex-1 px-2 py-1.5 text-[10px] font-medium bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white">
                                <Ban size={12} className="inline mr-1" /> Tolak
                            </button>
                            <button onClick={() => onTerima?.(data.layanan_pemberhentian_id, false)} className="flex-1 px-2 py-1.5 text-[10px] font-medium bg-white border border-green-200 text-green-600 rounded-lg hover:bg-green-600 hover:text-white">
                                <CheckCircle size={12} className="inline mr-1" /> Terima
                            </button>
                        </>
                    )}
                    {status === "diterima" && (
                        <button onClick={onUpload} className="flex-1 px-2 py-1.5 text-[10px] font-medium bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white">
                            <Upload size={12} className="inline mr-1" /> Upload
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};