// src/components/cards/Pelayanan/Admin/Pangkat/DataCardPangkatCompact.tsx

import React, { useState } from 'react';
import { TrendingUp, Eye, Edit, Ban, CheckCircle, Upload, Loader, FileCheck } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';

interface DataCardPangkatCompactProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardPangkatCompact: React.FC<DataCardPangkatCompactProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const status = data?.layanan_status || "pengajuan";
    const namaLengkap = `${data?.peg_gelar_depan || ""} ${data?.peg_nama || ""} ${data?.peg_gelar_belakang || ""}`.trim();
    const unitKerja = data?.unit_org_induk_nm || "-";
    const jenisKp = data?.lay_kp_jenis || "-";

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
        <div className="bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-purple-200 transition-all group">
            <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <TrendingUp size={14} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-xs text-slate-800 line-clamp-1">
                                {namaLengkap || "Tanpa Nama"}
                            </p>
                            <p className="text-[8px] text-slate-400 font-mono">
                                {data?.peg_nip || "-"}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={status} size="sm" />
                </div>

                <div className="text-[9px] text-slate-500 mb-1 line-clamp-1">
                    {unitKerja}
                </div>

                <div className="text-[9px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full inline-block mb-1">
                    {jenisKp}
                </div>

                {data?.file_status_pelayanan && (
                    <div className="mb-2">
                        <div className="inline-flex items-center gap-1 text-[7px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            <FileCheck size={8} />
                            <span>Sudah upload</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100">
                    <button
                        onClick={handleDetailClick}
                        disabled={actionLoading === 'detail'}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                        {actionLoading === 'detail' ? <Loader size={10} className="animate-spin" /> : <Eye size={10} />}
                        Detail
                    </button>

                    <button
                        onClick={handlePerbaikiClick}
                        disabled={actionLoading === 'perbaiki'}
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                        {actionLoading === 'perbaiki' ? <Loader size={10} className="animate-spin" /> : <Edit size={10} />}
                        Edit
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={handleTolakClick}
                                disabled={actionLoading === 'tolak'}
                                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            >
                                {actionLoading === 'tolak' ? <Loader size={10} className="animate-spin" /> : <Ban size={10} />}
                                Tolak
                            </button>
                            <button
                                onClick={handleTerimaClick}
                                disabled={actionLoading === 'terima'}
                                className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                            >
                                {actionLoading === 'terima' ? <Loader size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                                Terima
                            </button>
                        </>
                    )}

                    {(status === "diterima" || status === "selesai") && (
                        <button
                            onClick={handleUploadClick}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${status === "selesai"
                                    ? 'bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                }`}
                            title={status === "selesai" ? "Ganti Berkas" : "Upload Berkas"}
                        >
                            <Upload size={10} />
                            {status === "selesai" ? "Ganti" : "Upload"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};