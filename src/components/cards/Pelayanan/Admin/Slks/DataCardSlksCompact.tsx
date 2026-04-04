// src/components/cards/Pelayanan/Admin/Slks/DataCardSlksCompact.tsx

import React, { useState } from 'react';
import { Award, Eye, Edit, Ban, CheckCircle, Upload, Loader, FileCheck } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';

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
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const status = data?.layanan_status || "pengajuan";
    const namaLengkap = `${data?.peg_gelar_depan || ""} ${data?.peg_nama || ""} ${data?.peg_gelar_belakang || ""}`.trim();
    const unitKerja = data?.unit_org_induk_nm || "-";

    const handleUploadClick = () => {
        onUpload?.();
    };

    const handleTerimaClick = async () => {
        setActionLoading('terima');
        try {
            await onTerima?.(data?.slks_id, false);
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
                                {data?.peg_nip || "-"}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={status} size="sm" />
                </div>

                <div className="text-[9px] text-slate-500 mb-1 line-clamp-1">
                    {unitKerja}
                </div>

                {/* Indikator Berkas Hasil */}
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
                        className="flex-1 py-1.5 rounded-lg text-[9px] font-bold bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
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
                        Perbaikan
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

                    {/* Tombol Upload/Ganti */}
                    {(status === "diterima" || status === "selesai") && (
                        <button
                            onClick={handleUploadClick}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1 ${status === "selesai"
                                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
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