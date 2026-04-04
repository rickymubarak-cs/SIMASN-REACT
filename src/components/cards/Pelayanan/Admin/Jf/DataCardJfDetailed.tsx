// src/components/cards/Pelayanan/Admin/Jf/DataCardJfDetailed.tsx

import React, { useState } from 'react';
import { Briefcase, Clock, Eye, Edit, Ban, CheckCircle, Upload, Calendar, Building, Award, FileCheck, Loader } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';
import { formatDateTimeId } from '../../../../../utils/formatters';

interface DataCardJfDetailedProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardJfDetailed: React.FC<DataCardJfDetailedProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const status = data?.layanan_jf_status || "pengajuan";
    const namaLengkap = `${data?.peg_gelar_depan || ""} ${data?.peg_nama || ""} ${data?.peg_gelar_belakang || ""}`.trim();
    const jenisJf = data?.jenis_jf || "-";
    const unitKerja = data?.unit_org_induk_nm || "-";

    const handleUploadClick = () => {
        onUpload?.();
    };

    const handleTerimaClick = async () => {
        setActionLoading('terima');
        try {
            await onTerima?.(data?.layanan_jf_id, false);
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
        <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-indigo-200 transition-all group">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Briefcase size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-base uppercase group-hover:text-indigo-600 transition-colors">
                                {namaLengkap || "Tanpa Nama"}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">NIP. {data?.peg_nip || "-"}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        <span className="truncate">{unitKerja}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Award size={14} className="text-indigo-500" />
                        <span>Jenis: {jenisJf}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDateTimeId(data?.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-indigo-500 font-bold">#{index}</span>
                    </div>
                </div>

                {data?.file_status_pelayanan && (
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-1.5 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <FileCheck size={12} />
                            <span>Berkas sudah diupload: {data.file_status_pelayanan}</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                        onClick={handleDetailClick}
                        disabled={actionLoading === 'detail'}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {actionLoading === 'detail' ? <Loader size={14} className="animate-spin" /> : <Eye size={14} />}
                        Detail Lengkap
                    </button>

                    <button
                        onClick={handlePerbaikiClick}
                        disabled={actionLoading === 'perbaiki'}
                        className="py-2 px-4 rounded-xl text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {actionLoading === 'perbaiki' ? <Loader size={14} className="animate-spin" /> : <Edit size={14} />}
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={handleTolakClick}
                                disabled={actionLoading === 'tolak'}
                                className="py-2 px-4 rounded-xl text-xs font-bold bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {actionLoading === 'tolak' ? <Loader size={14} className="animate-spin" /> : <Ban size={14} />}
                            </button>
                            <button
                                onClick={handleTerimaClick}
                                disabled={actionLoading === 'terima'}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading === 'terima' ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                Terima
                            </button>
                        </>
                    )}

                    {(status === "diterima" || status === "selesai") && (
                        <button
                            onClick={handleUploadClick}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${status === "selesai"
                                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                                }`}
                            title={status === "selesai" ? "Ganti Berkas" : "Upload Berkas"}
                        >
                            <Upload size={14} />
                            {status === "selesai" ? "Ganti Berkas" : "Upload Berkas"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};