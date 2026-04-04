// src/components/cards/Pelayanan/Admin/Lpp/DataCardLpp.tsx

import React, { useState } from 'react';
import { GraduationCap, Clock, Eye, Edit, Ban, CheckCircle, Upload, FileCheck, Building, Loader } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';
import { formatDateTimeId } from '../../../../../utils/formatters';
import { lppFileConfig } from '../../../../../service/lppService';

interface DataCardLppProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardLpp: React.FC<DataCardLppProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const status = data?.layanan_lpp_status || "pengajuan";
    const namaLengkap = `${data?.peg_gelar_depan || ""} ${data?.peg_nama || ""} ${data?.peg_gelar_belakang || ""}`.trim();
    const unitKerja = data?.unit_org_induk_nm || "-";

    const availableFiles = lppFileConfig.filter(
        fileConfig => data?.[fileConfig.key] && data[fileConfig.key].trim() !== ""
    ).length;

    const handleUploadClick = () => {
        onUpload?.();
    };

    const handleTerimaClick = async () => {
        setActionLoading('terima');
        try {
            await onTerima?.(data?.layanan_id, false);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDetailClick = () => {
        setActionLoading('detail');
        onDetail();
        setActionLoading(null);
    };

    const handlePerbaikiClick = () => {
        setActionLoading('perbaiki');
        onPerbaiki?.();
        setActionLoading(null);
    };

    const handleTolakClick = () => {
        setActionLoading('tolak');
        onTolak?.();
        setActionLoading(null);
    };

    return (
        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col overflow-hidden relative">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg shadow-emerald-200">
                        <GraduationCap size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase">
                            #{index}
                        </span>
                        <StatusBadge status={status} />
                    </div>
                </div>

                <h3 className="font-black text-slate-800 text-sm leading-tight mb-1 line-clamp-2 uppercase group-hover:text-emerald-600 transition-colors">
                    {namaLengkap || "Tanpa Nama"}
                </h3>

                <p className="text-[9px] font-bold text-slate-400 font-mono mb-2">
                    NIP. {data?.peg_nip || "-"}
                </p>

                <div className="mb-3">
                    <div className="flex items-start gap-1.5">
                        <Building size={10} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                                Unit Kerja
                            </p>
                            <p className="text-[10px] font-medium text-slate-700 leading-tight line-clamp-2" title={unitKerja}>
                                {unitKerja}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-[9px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                    <FileCheck size={10} />
                    {availableFiles} dari {lppFileConfig.length} Berkas tersedia
                </p>

                {data?.file_status_pelayanan && (
                    <div className="mt-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[8px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <FileCheck size={10} />
                            <span>Berkas sudah diupload</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase">
                    <Clock size={10} />
                    <span>{formatDateTimeId(data?.timestamp)}</span>
                </div>
            </div>

            <div className="bg-slate-50/50 p-4 space-y-2 border-t border-slate-100">
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        onClick={handleDetailClick}
                        disabled={actionLoading === 'detail'}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {actionLoading === 'detail' ? <Loader size={12} className="animate-spin" /> : <Eye size={12} />}
                        Detail
                    </button>

                    <button
                        onClick={handlePerbaikiClick}
                        disabled={actionLoading === 'perbaiki'}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {actionLoading === 'perbaiki' ? <Loader size={12} className="animate-spin" /> : <Edit size={12} />}
                        Perbaiki
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={handleTolakClick}
                                disabled={actionLoading === 'tolak'}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === 'tolak' ? <Loader size={12} className="animate-spin" /> : <Ban size={12} />}
                                Tolak
                            </button>

                            <button
                                onClick={handleTerimaClick}
                                disabled={actionLoading === 'terima'}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === 'terima' ? <Loader size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                                Terima
                            </button>
                        </>
                    )}

                    {(status === "diterima" || status === "selesai") && (
                        <button
                            onClick={handleUploadClick}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border transition-all hover:text-white ${status === "selesai"
                                    ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-600'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-600'
                                }`}
                            title={status === "selesai" ? "Ganti Berkas" : "Upload Berkas"}
                        >
                            <Upload size={12} />
                            {status === "selesai" ? "Ganti" : "Upload"}
                        </button>
                    )}
                </div>

                <div className="flex gap-1 pt-1 flex-wrap">
                    {lppFileConfig.slice(0, 4).map(fileConfig => (
                        data?.[fileConfig.key] && data[fileConfig.key].trim() !== "" && (
                            <span key={fileConfig.key} className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                                ✓ {fileConfig.label.slice(0, 12)}
                            </span>
                        )
                    ))}
                    {availableFiles > 4 && (
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            +{availableFiles - 4} lainnya
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};