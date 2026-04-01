// src/components/cards/DetailedListItem.tsx
import React, { memo } from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, UserMinus, FileCheck, Clock, Building, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';

interface DetailedListItemProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DetailedListItem: React.FC<DetailedListItemProps> = memo(({
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
    const jenisPemberhentian = data.jenis_pemberhentian || "Pemberhentian ASN";

    return (
        <div className="bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group">
            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Info Utama */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <UserMinus size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-sm text-slate-800 truncate">
                                        {namaLengkap || "Tanpa Nama"}
                                    </h3>
                                    <StatusBadge status={status} size="sm" />
                                </div>
                                <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                                    NIP. {data.peg_nip || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Detail Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <Building size={12} className="text-slate-400 flex-shrink-0" />
                                <span className="truncate">{data.unit_org_induk_nm || "-"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <UserMinus size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{jenisPemberhentian}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                                <Clock size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{formatDateTimeId(data.timestamp || data.tgl_usul)}</span>
                            </div>
                        </div>

                        {/* File Indicator */}
                        {data.file_status_pelayanan && (
                            <div className="mt-2 flex items-center gap-1">
                                <FileCheck size={10} className="text-green-500" />
                                <span className="text-[9px] text-green-600">SK Pemberhentian tersedia</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5">
                        <button
                            onClick={onDetail}
                            className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all whitespace-nowrap flex items-center gap-1"
                        >
                            <Eye size={12} /> Detail
                            <ChevronRight size={12} />
                        </button>

                        {status === "pengajuan" && (
                            <div className="flex gap-1">
                                <button onClick={onPerbaiki} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Perbaiki">
                                    <Edit size={14} />
                                </button>
                                <button onClick={onTolak} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Tolak">
                                    <Ban size={14} />
                                </button>
                                <button onClick={() => onTerima?.(data.layanan_pemberhentian_id, false)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Terima">
                                    <CheckCircle size={14} />
                                </button>
                            </div>
                        )}
                        {status === "diterima" && (
                            <button onClick={onUpload} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Upload">
                                <Upload size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

DetailedListItem.displayName = 'DetailedListItem';